from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .api.create import create_widget
from .api.delete import delete_widget
from .api.list import list_widgets
from .api.update import update_widget
from .models import Widget, WidgetCreate, WidgetUpdate, init_db

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)
init_db()


@app.get("/api/widgets", response_model=list[Widget])
def get_widgets() -> list[Widget]:
    return list_widgets()


@app.post("/api/widgets", response_model=Widget, status_code=201)
def post_widget(payload: WidgetCreate) -> Widget:
    return create_widget(payload)


@app.patch("/api/widgets/{widget_id}", response_model=Widget)
def patch_widget(widget_id: str, payload: WidgetUpdate) -> Widget:
    widget = update_widget(widget_id, payload)
    if widget is None:
        raise HTTPException(status_code=404, detail="Widget not found")
    return widget


@app.delete("/api/widgets/{widget_id}", status_code=204)
def remove_widget(widget_id: str) -> None:
    if not delete_widget(widget_id):
        raise HTTPException(status_code=404, detail="Widget not found")