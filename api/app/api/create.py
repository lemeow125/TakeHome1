from datetime import datetime, timezone
from uuid import uuid4

from ..models import Widget, WidgetCreate, db


def create_widget(payload: WidgetCreate) -> Widget:
    now = datetime.now(timezone.utc)
    widget = Widget(
        id=str(uuid4()),
        text=payload.text,
        created_at=now,
        updated_at=now,
    )
    with db() as conn:
        conn.execute(
            "INSERT INTO widgets (id, text, created_at, updated_at) "
            "VALUES (?, ?, ?, ?)",
            (
                widget.id,
                widget.text,
                widget.created_at.isoformat(),
                widget.updated_at.isoformat(),
            ),
        )
    return widget