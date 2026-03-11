"""Seed the database with initial major data if the table is empty."""

import json
import pathlib
from database import SessionLocal
from models import Major

SEED_PATH = pathlib.Path(__file__).parent / "data" / "majors.json"


def seed_if_empty():
    db = SessionLocal()
    try:
        if db.query(Major).count() > 0:
            return

        data = json.loads(SEED_PATH.read_text())
        for entry in data:
            major = Major(
                slug=entry["slug"],
                name=entry["name"],
                category=entry["category"],
                unemployment_rate=entry["unemployment_rate"],
                unemployment_rate_pre_ai=entry.get("unemployment_rate_pre_ai", entry["unemployment_rate"]),
                automation_risk=entry["automation_risk"],
                avg_debt=entry["avg_debt"],
                median_starting_salary=entry["median_starting_salary"],
                source_unemployment=entry.get("source_unemployment"),
                source_automation=entry.get("source_automation"),
                source_debt=entry.get("source_debt"),
                source_salary=entry.get("source_salary"),
            )
            db.add(major)
        db.commit()
        print(f"Seeded {len(data)} majors into database.")
    finally:
        db.close()
