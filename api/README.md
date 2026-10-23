# Notes

A minimal notes api: add, edit, or remove text widgets, and they persist.

Built with FastAPI

# Development

## Running
Follow the commands below in order to produce a development build
```bash
uv sync
uvicorn app:app --reload --port 8000
```

## Testing
Run tests via the following command Tests utilize Bruno to test API endpoints
```bash
# TODO: Add this in
bru run --env local # alternatively --env docker/dev
```
