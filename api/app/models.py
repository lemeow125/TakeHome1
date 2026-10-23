import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Iterator

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

DB_PATH = Path(__file__).resolve().parent / "widgets.db"


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Widget(CamelModel):
    id: str
    text: str
    created_at: datetime
    updated_at: datetime


class WidgetCreate(CamelModel):
    text: str = Field(min_length=1)


class WidgetUpdate(CamelModel):
    text: str = Field(min_length=1)


@contextmanager
def db() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    with db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS widgets (
                id         TEXT PRIMARY KEY,
                text       TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )


def row_to_widget(row: sqlite3.Row) -> Widget:
    return Widget(
        id=row["id"],
        text=row["text"],
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
    )