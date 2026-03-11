from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Major(Base):
    __tablename__ = "majors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100), index=True)
    unemployment_rate: Mapped[float] = mapped_column(Float)
    automation_risk: Mapped[float] = mapped_column(Float)
    avg_debt: Mapped[float] = mapped_column(Float)
    median_starting_salary: Mapped[float] = mapped_column(Float)

    # Acceleration: unemployment rate before ChatGPT (pre Nov 2022)
    unemployment_rate_pre_ai: Mapped[float] = mapped_column(Float, default=0.0)

    # Per-field source citations
    source_unemployment: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_automation: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_debt: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_salary: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class School(Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(300))
    ipeds_id: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(100), index=True)
    state: Mapped[str] = mapped_column(String(2), index=True)
    city: Mapped[str] = mapped_column(String(200))
    control: Mapped[str] = mapped_column(String(50))
    enrollment: Mapped[int] = mapped_column(Integer, default=0)

    # Financial data (from College Scorecard)
    avg_debt: Mapped[float] = mapped_column(Float, default=0.0)
    median_salary_10yr: Mapped[float] = mapped_column(Float, default=0.0)
    median_salary_4yr: Mapped[float] = mapped_column(Float, default=0.0)
    graduation_rate: Mapped[float] = mapped_column(Float, default=0.0)
    in_state_tuition: Mapped[float] = mapped_column(Float, default=0.0)
    out_state_tuition: Mapped[float] = mapped_column(Float, default=0.0)
    admission_rate: Mapped[float | None] = mapped_column(Float, nullable=True)

    # STEM & AI readiness
    pct_stem: Mapped[float] = mapped_column(Float, default=0.0)
    has_ai_program: Mapped[bool] = mapped_column(Boolean, default=False)
    research_tier: Mapped[int] = mapped_column(Integer, default=0)

    # Network premium
    alumni_salary_premium: Mapped[float] = mapped_column(Float, default=0.0)
    startup_density: Mapped[float] = mapped_column(Float, default=0.0)

    # Post-AI employability
    popular_majors_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    weighted_major_automation: Mapped[float] = mapped_column(Float, default=50.0)

    # Sources
    source_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
