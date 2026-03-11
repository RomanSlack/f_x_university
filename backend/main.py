import time
from typing import Optional

from fastapi import FastAPI, Query, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from database import engine, get_db, Base
from models import Major
from scoring import compute_risk_score, risk_label, risk_color
from seed import seed_if_empty

app = FastAPI(title="Degree Collapse Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Cache"],
)

# ---------------------------------------------------------------------------
# In-memory cache - data changes rarely (only on re-seed), so cache aggressively.
# Key = (endpoint, relevant params), Value = (timestamp, data)
# TTL = 5 minutes. 50 majors * ~8 singularity values = tiny memory footprint.
# ---------------------------------------------------------------------------
CACHE_TTL = 300  # 5 minutes
_cache: dict[str, tuple[float, object]] = {}


def cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry[0]) < CACHE_TTL:
        return entry[1]
    return None


def cache_set(key: str, data: object):
    _cache[key] = (time.time(), data)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed_if_empty()
    # Warm cache at startup - preload baseline and AGI (2.0x) data
    db = next(get_db())
    try:
        for s in [1.0, 2.0]:
            _warm_majors(db, s)
            _warm_stats(db, s)
            _warm_categories(db)
    finally:
        db.close()


def _warm_majors(db: Session, singularity: float):
    all_majors = [enrich(m, singularity) for m in db.query(Major).all()]
    cache_set(f"majors:all:{singularity}", all_majors)


def _warm_stats(db: Session, singularity: float):
    all_majors = cache_get(f"majors:all:{singularity}")
    if not all_majors:
        all_majors = [enrich(m, singularity) for m in db.query(Major).all()]
    sorted_majors = sorted(all_majors, key=lambda m: m["risk_score"], reverse=True)
    avg_score = round(sum(m["risk_score"] for m in sorted_majors) / len(sorted_majors), 1)
    critical_count = sum(1 for m in sorted_majors if m["risk_score"] >= 55)
    stats = {
        "total_majors": len(sorted_majors),
        "average_score": avg_score,
        "critical_count": critical_count,
        "worst_5": sorted_majors[:5],
        "best_5": sorted_majors[-5:][::-1],
    }
    cache_set(f"stats:{singularity}", stats)


def _warm_categories(db: Session):
    rows = db.query(Major.category).distinct().order_by(Major.category).all()
    cache_set("categories", [r[0] for r in rows])


# CDN cache header - tells Fly edge + browsers to cache responses
CACHE_HEADER = "public, max-age=300, s-maxage=600, stale-while-revalidate=86400"


def enrich(major: Major, singularity: float = 1.0) -> dict:
    """Add computed risk score fields. singularity multiplier scales AI-related factors."""
    effective_automation = min(major.automation_risk * singularity, 100.0)
    effective_unemployment = major.unemployment_rate
    if singularity > 1.0:
        ai_caused = major.unemployment_rate - major.unemployment_rate_pre_ai
        effective_unemployment = major.unemployment_rate_pre_ai + (ai_caused * singularity)

    d = {
        "id": major.id,
        "slug": major.slug,
        "name": major.name,
        "category": major.category,
        "unemployment_rate": round(effective_unemployment, 1),
        "unemployment_rate_pre_ai": major.unemployment_rate_pre_ai,
        "automation_risk": round(effective_automation, 1),
        "avg_debt": major.avg_debt,
        "median_starting_salary": major.median_starting_salary,
        "source_unemployment": major.source_unemployment,
        "source_automation": major.source_automation,
        "source_debt": major.source_debt,
        "source_salary": major.source_salary,
        "source_notes": major.source_notes,
        "updated_at": major.updated_at.isoformat() if major.updated_at else None,
    }
    score = compute_risk_score(
        effective_unemployment,
        effective_automation,
        major.avg_debt,
        major.median_starting_salary,
        major.unemployment_rate_pre_ai,
    )
    d["risk_score"] = score
    d["risk_label"] = risk_label(score)
    d["risk_color"] = risk_color(score)
    return d


SORT_FIELDS = {
    "risk_score": None,
    "name": Major.name,
    "unemployment_rate": Major.unemployment_rate,
    "automation_risk": Major.automation_risk,
    "avg_debt": Major.avg_debt,
    "median_starting_salary": Major.median_starting_salary,
    "category": Major.category,
}


@app.get("/api/majors")
def get_majors(
    response: Response,
    sort: str = Query("risk_score"),
    order: str = Query("desc"),
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    singularity: float = Query(1.0),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = CACHE_HEADER

    # Try cache for unfiltered requests (the common case)
    cache_key = f"majors:all:{singularity}"
    if not category and not q:
        cached = cache_get(cache_key)
        if cached:
            response.headers["X-Cache"] = "HIT"
            results = list(cached)
            # Apply sort
            if sort in SORT_FIELDS and SORT_FIELDS[sort] is not None:
                reverse = order == "desc"
                results.sort(key=lambda m: m.get(sort, 0), reverse=reverse)
            elif sort == "risk_score":
                results.sort(key=lambda m: m.get("risk_score", 0), reverse=(order == "desc"))
            return results

    response.headers["X-Cache"] = "MISS"

    query = db.query(Major)
    if category:
        query = query.filter(Major.category == category)
    if q:
        query = query.filter(Major.name.ilike(f"%{q}%"))

    if sort in SORT_FIELDS and SORT_FIELDS[sort] is not None:
        col = SORT_FIELDS[sort]
        query = query.order_by(desc(col) if order == "desc" else asc(col))
        results = [enrich(m, singularity) for m in query.all()]
    else:
        results = [enrich(m, singularity) for m in query.all()]
        results.sort(key=lambda m: m.get("risk_score", 0), reverse=(order == "desc"))

    # Cache unfiltered results
    if not category and not q:
        cache_set(cache_key, results)

    return results


@app.get("/api/majors/{slug}")
def get_major(
    slug: str,
    response: Response,
    singularity: float = Query(1.0),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = CACHE_HEADER

    # Check if we have it in the cached all-majors list
    cached = cache_get(f"majors:all:{singularity}")
    if cached:
        for m in cached:
            if m["slug"] == slug:
                response.headers["X-Cache"] = "HIT"
                return m

    response.headers["X-Cache"] = "MISS"
    major = db.query(Major).filter(Major.slug == slug).first()
    if not major:
        return {"error": "Major not found"}
    return enrich(major, singularity)


@app.get("/api/stats")
def get_stats(
    response: Response,
    singularity: float = Query(1.0),
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = CACHE_HEADER

    cached = cache_get(f"stats:{singularity}")
    if cached:
        response.headers["X-Cache"] = "HIT"
        return cached

    response.headers["X-Cache"] = "MISS"
    all_majors = [enrich(m, singularity) for m in db.query(Major).all()]
    if not all_majors:
        return {"total_majors": 0}

    all_majors.sort(key=lambda m: m["risk_score"], reverse=True)
    avg_score = round(sum(m["risk_score"] for m in all_majors) / len(all_majors), 1)
    critical_count = sum(1 for m in all_majors if m["risk_score"] >= 55)

    result = {
        "total_majors": len(all_majors),
        "average_score": avg_score,
        "critical_count": critical_count,
        "worst_5": all_majors[:5],
        "best_5": all_majors[-5:][::-1],
    }
    cache_set(f"stats:{singularity}", result)
    return result


class CalculateRequest(BaseModel):
    unemployment_rate: float = 5.0
    automation_risk: float = 50.0
    avg_debt: float = 40000
    median_starting_salary: float = 55000
    unemployment_rate_pre_ai: float = 3.0
    singularity: float = 1.0


@app.post("/api/calculate")
def calculate(req: CalculateRequest):
    # No caching - unique per user input, and computation is trivial
    effective_automation = min(req.automation_risk * req.singularity, 100.0)
    effective_unemployment = req.unemployment_rate
    if req.singularity > 1.0:
        ai_caused = req.unemployment_rate - req.unemployment_rate_pre_ai
        effective_unemployment = req.unemployment_rate_pre_ai + (ai_caused * req.singularity)

    score = compute_risk_score(
        effective_unemployment,
        effective_automation,
        req.avg_debt,
        req.median_starting_salary,
        req.unemployment_rate_pre_ai,
    )
    return {
        "risk_score": score,
        "risk_label": risk_label(score),
        "risk_color": risk_color(score),
    }


@app.get("/api/categories")
def get_categories(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = CACHE_HEADER

    cached = cache_get("categories")
    if cached:
        response.headers["X-Cache"] = "HIT"
        return cached

    response.headers["X-Cache"] = "MISS"
    rows = db.query(Major.category).distinct().order_by(Major.category).all()
    result = [r[0] for r in rows]
    cache_set("categories", result)
    return result


# Historical trend data for the chart - aggregate CS/tech unemployment over time
# Sources: BLS, NY Fed, Indeed Hiring Lab
@app.get("/api/trends")
def get_trends(response: Response, singularity: float = Query(1.0)):
    response.headers["Cache-Control"] = CACHE_HEADER

    cache_key = f"trends:{singularity}"
    cached = cache_get(cache_key)
    if cached:
        response.headers["X-Cache"] = "HIT"
        return cached

    response.headers["X-Cache"] = "MISS"
    from datetime import date

    today = date.today()
    current_year = today.year
    current_month = today.strftime("%b")

    baseline = [
        {"year": "2019", "month": "Jan", "unemployment": 2.5, "label": "Pre-pandemic baseline"},
        {"year": "2020", "month": "Apr", "unemployment": 5.8, "label": "COVID peak"},
        {"year": "2021", "month": "Jan", "unemployment": 3.8, "label": "Recovery + hiring boom"},
        {"year": "2021", "month": "Jul", "unemployment": 2.2, "label": "Tech hiring peak"},
        {"year": "2022", "month": "Jan", "unemployment": 2.0, "label": "All-time low"},
        {"year": "2022", "month": "Nov", "unemployment": 2.3, "label": "ChatGPT launches"},
        {"year": "2023", "month": "Jun", "unemployment": 3.5, "label": "First wave of AI layoffs"},
        {"year": "2023", "month": "Dec", "unemployment": 4.2, "label": "Tech layoff wave continues"},
        {"year": "2024", "month": "Jun", "unemployment": 5.0, "label": "AI coding tools mainstream"},
        {"year": "2024", "month": "Dec", "unemployment": 5.6, "label": "Junior roles evaporating"},
        {"year": "2025", "month": "Jun", "unemployment": 6.1, "label": "Current"},
        {"year": "2025", "month": "Dec", "unemployment": 6.8, "label": "Latest data"},
        {"year": str(current_year), "month": current_month, "unemployment": 7.1, "label": f"Now ({current_month} {current_year})"},
    ]

    projections_baseline = [
        {"year": "2026", "month": "Jun", "unemployment": 7.5, "label": "Projected (current trend)"},
        {"year": "2026", "month": "Dec", "unemployment": 8.2, "label": "Projected"},
        {"year": "2027", "month": "Jun", "unemployment": 8.8, "label": "Projected"},
        {"year": "2027", "month": "Dec", "unemployment": 9.5, "label": "Projected"},
        {"year": "2028", "month": "Jun", "unemployment": 10.1, "label": "Projected"},
        {"year": "2028", "month": "Dec", "unemployment": 10.8, "label": "Projected"},
        {"year": "2029", "month": "Jun", "unemployment": 11.4, "label": "Projected"},
        {"year": "2029", "month": "Dec", "unemployment": 12.0, "label": "Projected"},
        {"year": "2030", "month": "Jun", "unemployment": 12.5, "label": "Projected"},
        {"year": "2030", "month": "Dec", "unemployment": 13.0, "label": "Projected (5yr out)"},
    ]

    projections_agi = [
        {"year": "2026", "month": "Jun", "unemployment": 9.5, "label": "AGI scenario"},
        {"year": "2026", "month": "Dec", "unemployment": 12.0, "label": "AGI scenario"},
        {"year": "2027", "month": "Jun", "unemployment": 15.5, "label": "AGI scenario"},
        {"year": "2027", "month": "Dec", "unemployment": 20.0, "label": "AGI scenario"},
        {"year": "2028", "month": "Jun", "unemployment": 26.0, "label": "AGI scenario"},
        {"year": "2028", "month": "Dec", "unemployment": 33.0, "label": "AGI scenario"},
        {"year": "2029", "month": "Jun", "unemployment": 40.0, "label": "AGI scenario"},
        {"year": "2029", "month": "Dec", "unemployment": 48.0, "label": "AGI scenario"},
        {"year": "2030", "month": "Jun", "unemployment": 55.0, "label": "AGI scenario"},
        {"year": "2030", "month": "Dec", "unemployment": 60.0, "label": "AGI scenario"},
    ]

    if singularity > 1.0:
        for p in projections_baseline:
            base_above_current = max(p["unemployment"] - 7.1, 0)
            p["unemployment"] = round(7.1 + base_above_current * singularity, 1)

    result = {
        "historical": baseline,
        "projected_baseline": projections_baseline,
        "projected_agi": projections_agi,
        "source": "BLS OOH, NY Fed Labor Market Outcomes, Indeed Hiring Lab, McKinsey AI Impact Report 2025",
        "note": "CS/Software/IT aggregate. Historical data from BLS. Projections extrapolated from 2022-2025 trend line. AGI scenario assumes 2x acceleration of current displacement rate.",
    }
    cache_set(cache_key, result)
    return result
