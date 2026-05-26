#!/usr/bin/env bash
# Local dev: frontend (public/) + API on http://localhost:3000
set -e
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
  python3 -m venv venv
  ./venv/bin/pip install -r requirements.txt
fi

export PYTHONPATH="${PWD}:${PYTHONPATH}"
echo "Starting at http://localhost:3000"
echo "  Landing page: http://localhost:3000"
echo "  API health:   http://localhost:3000/api/health"
echo "  API docs:     http://localhost:3000/docs"
./venv/bin/uvicorn local_dev:app --reload --host 0.0.0.0 --port 3000
