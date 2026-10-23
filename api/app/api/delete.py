from ..models import db


def delete_widget(widget_id: str) -> bool:
    with db() as conn:
        cur = conn.execute("DELETE FROM widgets WHERE id = ?", (widget_id,))
        return cur.rowcount > 0