from ..models import Widget, db, row_to_widget


def list_widgets() -> list[Widget]:
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM widgets ORDER BY created_at"
        ).fetchall()
    return [row_to_widget(row) for row in rows]