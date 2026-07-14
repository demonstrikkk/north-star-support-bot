from __future__ import annotations

import os
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.chat import router as chat_router
from app.chatbot.sessions import session_store

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

_start_time = time.time()

app = FastAPI(
    title="North Star Support Bot",
    description="Outdoor customer-support chatbot with deterministic conversation logic.",
    version="1.0.0",
)


def _parse_origins(raw: str) -> list[str]:
    raw = raw.strip()
    if raw == "*":
        return ["*"]
    return [o.strip() for o in raw.split(",") if o.strip()]


origins = _parse_origins(os.getenv("CORS_ORIGINS", "*"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "version": "1.0.0",
        "uptime_seconds": round(time.time() - _start_time, 2),
        "active_sessions": len(session_store._sessions),
    }


if (STATIC_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

if (STATIC_DIR / "index.html").exists():

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        candidate = STATIC_DIR / full_path
        if full_path and candidate.exists() and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(STATIC_DIR / "index.html")
