"""
Seed the database with US university data.

Primary source: pre-built data/schools.json (processed from College Scorecard API + manual enrichment).
To refresh data, re-run the scorecard fetch script and rebuild schools.json.
"""

import json
import pathlib

from database import SessionLocal
from models import School

SCHOOLS_PATH = pathlib.Path(__file__).parent / "data" / "schools.json"


def seed_schools_if_empty():
    db = SessionLocal()
    try:
        if db.query(School).count() > 0:
            print("Schools table already has data, skipping seed.")
            return

        if not SCHOOLS_PATH.exists():
            print(f"No {SCHOOLS_PATH.name} found. Skipping school seed.")
            return

        data = json.loads(SCHOOLS_PATH.read_text())
        count = 0
        for entry in data:
            school = School(
                slug=entry["slug"],
                name=entry["name"],
                ipeds_id=entry["ipeds_id"],
                category=entry["category"],
                state=entry["state"],
                city=entry["city"],
                control=entry["control"],
                enrollment=entry.get("enrollment", 0),
                avg_debt=entry.get("avg_debt", 0),
                median_salary_10yr=entry.get("median_salary_10yr", 0),
                median_salary_4yr=entry.get("median_salary_4yr", 0),
                graduation_rate=entry.get("graduation_rate", 0),
                in_state_tuition=entry.get("in_state_tuition", 0),
                out_state_tuition=entry.get("out_state_tuition", 0),
                admission_rate=entry.get("admission_rate"),
                pct_stem=entry.get("pct_stem", 0),
                has_ai_program=entry.get("has_ai_program", False),
                research_tier=entry.get("research_tier", 0),
                alumni_salary_premium=entry.get("alumni_salary_premium", 0),
                startup_density=entry.get("startup_density", 0.5),
                weighted_major_automation=entry.get("weighted_major_automation", 40),
                popular_majors_json=entry.get("popular_majors_json"),
                source_notes=entry.get("source_notes", "College Scorecard"),
            )
            db.add(school)
            count += 1

        db.commit()
        print(f"Seeded {count} schools into database.")
    finally:
        db.close()
