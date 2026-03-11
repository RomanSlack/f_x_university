"""
Degree Collapse Risk Scoring Formula

Risk Score: 0-100 (higher = worse, more risky degree)

Five factors:
- UNEMPLOYMENT_WEIGHT:   Can graduates find jobs right now?
- AUTOMATION_WEIGHT:     How likely is AI to eat this career in 2 years?
- DEBT_SALARY_WEIGHT:    How bad is the debt relative to earnings?
- ACCELERATION_WEIGHT:   How fast has unemployment risen since ChatGPT? (Nov 2022)
                         This captures the RATE of AI disruption, not just the snapshot.

The acceleration factor is the key differentiator. A field going from 2% to 6%
unemployment in 3 years is in freefall. A field sitting at 6% for a decade is stable.
"""

# --- SCORING WEIGHTS (must sum to 1.0) ---
UNEMPLOYMENT_WEIGHT = 0.20
AUTOMATION_WEIGHT = 0.25
DEBT_SALARY_WEIGHT = 0.35
ACCELERATION_WEIGHT = 0.20

# --- NORMALIZATION CAPS ---
MAX_UNEMPLOYMENT = 15.0
MAX_DEBT_SALARY_RATIO = 2.0
MAX_ACCELERATION = 3.0  # 3x increase = max score (e.g. 2% -> 6%)


def compute_risk_score(
    unemployment_rate: float,
    automation_risk: float,
    avg_debt: float,
    median_starting_salary: float,
    unemployment_rate_pre_ai: float = 0.0,
) -> float:
    """
    Compute a 0-100 risk score for a degree.

    Args:
        unemployment_rate: Current recent grad unemployment % (e.g. 6.1)
        automation_risk: % chance of significant automation in 2 years (0-100)
        avg_debt: Average student debt in dollars
        median_starting_salary: Median first-year salary in dollars
        unemployment_rate_pre_ai: Unemployment rate before ChatGPT (pre Nov 2022)

    Returns:
        Risk score 0-100 (higher = worse)
    """
    # Normalize each factor to 0-1
    unemployment_norm = min(unemployment_rate / MAX_UNEMPLOYMENT, 1.0)
    automation_norm = min(automation_risk / 100.0, 1.0)
    debt_salary_ratio = min(
        (avg_debt / max(median_starting_salary, 1)) / MAX_DEBT_SALARY_RATIO, 1.0
    )

    # Acceleration: how much has unemployment increased since pre-AI era?
    if unemployment_rate_pre_ai > 0:
        acceleration_ratio = unemployment_rate / unemployment_rate_pre_ai
        # Normalize: 1.0x = no change (score 0), 4.0x+ = max (score 1)
        acceleration_norm = min(max(acceleration_ratio - 1.0, 0.0) / MAX_ACCELERATION, 1.0)
    else:
        acceleration_norm = 0.0

    # Weighted combination
    raw = (
        UNEMPLOYMENT_WEIGHT * unemployment_norm
        + AUTOMATION_WEIGHT * automation_norm
        + DEBT_SALARY_WEIGHT * debt_salary_ratio
        + ACCELERATION_WEIGHT * acceleration_norm
    )

    return round(raw * 100, 1)


def risk_label(score: float) -> str:
    if score >= 70:
        return "CRITICAL  - Do not enroll"
    elif score >= 55:
        return "HIGH RISK  - Proceed with extreme caution"
    elif score >= 40:
        return "MODERATE  - Weigh alternatives seriously"
    elif score >= 25:
        return "LOW RISK  - Reasonable bet"
    else:
        return "SAFE  - Strong career outlook"


def risk_color(score: float) -> str:
    if score >= 70:
        return "critical"
    elif score >= 55:
        return "high"
    elif score >= 40:
        return "moderate"
    elif score >= 25:
        return "low"
    else:
        return "safe"
