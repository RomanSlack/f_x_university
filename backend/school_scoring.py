"""
School Worth-It Score: 0-100 (higher = BETTER, more worth attending)

This is INVERTED from the major risk score (where higher = worse).
A school scoring 85 is a great bet. A school scoring 20 is overpriced.

Four factors:
- DEBT_SALARY:      How reasonable is the debt relative to post-grad earnings?
- AI_READINESS:     Does the school prepare students for an AI-driven economy?
- NETWORK:          Is the alumni network valuable enough to justify the cost?
- EMPLOYABILITY:    Are the school's popular majors resilient to automation?
"""

# --- WEIGHTS (must sum to 1.0) ---
DEBT_SALARY_WEIGHT = 0.35
AI_READINESS_WEIGHT = 0.20
NETWORK_WEIGHT = 0.20
EMPLOYABILITY_WEIGHT = 0.25

# --- NORMALIZATION ---
MAX_DEBT_SALARY_RATIO = 1.5
MAX_SALARY_PREMIUM = 0.5  # 50% above national avg = max score
MAX_STARTUP_DENSITY = 10.0  # 10+ startups per 1000 alumni = max


def compute_school_score(
    avg_debt: float,
    median_salary_10yr: float,
    pct_stem: float,
    has_ai_program: bool,
    research_tier: int,
    alumni_salary_premium: float,
    startup_density: float,
    weighted_major_automation: float,
) -> tuple[float, dict]:
    """
    Compute a 0-100 worth-it score for a school.

    Returns:
        (score, breakdown) where breakdown has individual factor scores (0-100 each)
    """
    # 1. Debt-to-salary: lower ratio = higher score
    # If salary data is missing ($0), use conservative national median fallback ($45k)
    effective_salary = median_salary_10yr if median_salary_10yr > 0 else 45000.0
    ratio = avg_debt / effective_salary
    debt_salary_norm = max(1.0 - min(ratio / MAX_DEBT_SALARY_RATIO, 1.0), 0.0)

    # 2. AI readiness: composite of STEM %, AI program, research tier
    stem_score = min(pct_stem / 0.50, 1.0)
    ai_program_score = 1.0 if has_ai_program else 0.0
    research_score = min(research_tier / 3.0, 1.0)
    ai_readiness_norm = 0.3 * stem_score + 0.4 * ai_program_score + 0.3 * research_score

    # 3. Network premium
    salary_uplift = min(max(alumni_salary_premium, 0) / MAX_SALARY_PREMIUM, 1.0)
    startup_score = min(max(startup_density, 0) / MAX_STARTUP_DENSITY, 1.0)
    network_norm = 0.6 * salary_uplift + 0.4 * startup_score

    # 4. Post-AI employability: inverse of automation risk
    employability_norm = max(1.0 - min(weighted_major_automation / 100.0, 1.0), 0.0)

    # Weighted combination
    raw = (
        DEBT_SALARY_WEIGHT * debt_salary_norm
        + AI_READINESS_WEIGHT * ai_readiness_norm
        + NETWORK_WEIGHT * network_norm
        + EMPLOYABILITY_WEIGHT * employability_norm
    )

    score = round(raw * 100, 1)
    breakdown = {
        "debt_salary": round(debt_salary_norm * 100, 1),
        "ai_readiness": round(ai_readiness_norm * 100, 1),
        "network": round(network_norm * 100, 1),
        "employability": round(employability_norm * 100, 1),
    }
    return score, breakdown


def school_label(score: float) -> str:
    if score >= 75:
        return "STRONG BET - Excellent value in the AI age"
    elif score >= 60:
        return "WORTH IT - Good return on investment"
    elif score >= 45:
        return "MIXED - Some strengths, weigh carefully"
    elif score >= 30:
        return "RISKY - Likely overpriced for what you get"
    else:
        return "OVERPRICED - Consider alternatives seriously"


def school_color(score: float) -> str:
    """Inverted from majors: high score = safe (green), low score = critical (red)."""
    if score >= 75:
        return "safe"
    elif score >= 60:
        return "low"
    elif score >= 45:
        return "moderate"
    elif score >= 30:
        return "high"
    else:
        return "critical"
