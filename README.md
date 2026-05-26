# Acko Consultancy — Recruitment Platform

Deployable on **Vercel** with static frontend + Python serverless API.

## Project structure

```
├── api/
│   └── app.py              # Vercel serverless entry (Mangum + FastAPI)
├── lib/                    # Python application (routes, CSV, Excel)
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── download_service.py
│   └── excel_generator.py
├── public/                 # Static frontend (served at /)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js
│   └── assets/images/
├── requirements.txt
├── vercel.json
└── .env.example
```

| Folder | Purpose |
|--------|---------|
| `public/` | Static site (Vercel auto-serves at `/`) |
| `api/` | Serverless function entry only |
| `lib/` | FastAPI app + business logic |

## Deploy

```bash
npm i -g vercel
vercel
vercel --prod
```

**Environment variables** (Vercel Dashboard):

| Variable | Required |
|----------|----------|
| `DOWNLOAD_PASSWORD` | Yes |

## Local development

```bash
cd /path/to/project
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
chmod +x run_local.sh
./run_local.sh
```

Open **http://localhost:3000** (frontend + API on one port).

Optional: `vercel dev` if you have Node.js and Vercel CLI installed.

## API (relative URLs)

| Method | Path |
|--------|------|
| POST | `/api/submit` |
| POST | `/api/reports/generate` |
| GET | `/api/health` |

## Note

On Vercel, CSV/Excel data uses `/tmp/acko-data` (ephemeral). Use external storage for production persistence.
