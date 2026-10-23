from datetime import datetime, timezone

from ..models import Widget, WidgetUpdate, db, row_to_widget


def update_widget(widget_id: str, payload: WidgetUpdate) -> Widget | None:
    now = datetime.now(timezone.utc).isoformat()
    with db() as conn:
        cur = conn.execute(
            "UPDATE widgets SET text = ?, updated_at = ? WHERE id = ?",
            (payload.text, now, widget_id),
        )
        if cur.rowcount == 0:
            return None
        row = conn.execute(
            "SELECT * FROM widgets WHERE id = ?", (widget_id,)
        ).fetchone()
    return row_to_widget(row)