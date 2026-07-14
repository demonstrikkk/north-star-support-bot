#!/usr/bin/env bash
set -e
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
trap 'kill $BACKEND_PID' EXIT
cd frontend
npm run dev
