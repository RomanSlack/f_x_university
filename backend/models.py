from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, Text, JSON
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
