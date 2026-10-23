# Notes

A minimal notes app: add, edit, or remove text widgets, and they persist. Each widget is independent — text is never shared between them, and every save is debounced ~2s before hitting the API.

- [`api/`](api/README.md) — FastAPI backend
- [`web/`](web/README.md) — React, TypeScript, React Query, and Vite frontend

## Development

### Backend ([`api/`](api/README.md))

Follow the commands below in order to produce a development build:

```bash
cd api
uv sync
uvicorn app:app --reload --port 8000

## TODO
- [] Containerization
- [] Drone/Woodpecker pipeline
  - [] Test (FE)
  - [] Test (BE)
  - [] Build
  - [] Push to CR (Forgejo)
  - [] Deploy dev
  - [] Uptime/Status Tracker
  - [] Backup job entry