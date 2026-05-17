# Feedback Board

A full-stack Canny-style feedback board. Users can submit feedback, upvote items, and filter by status. Admins can update status and delete entries.

## Features

- Submit feedback with title and description
- Anonymous upvote / toggle vote (tracked per browser)
- Filter by status: All, Open, In Progress, Done, Closed
- Sort by Newest or Top Voted
- Feedback detail page
- Admin mode: change status, delete feedback

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React + Vite + Tailwind CSS     |
| Backend  | Node.js + Express               |
| Database | SQLite (built-in `node:sqlite`) |
| Deploy   | Vercel (frontend) + Render.com (backend) |
| CI/CD    | GitHub Actions                  |

## Local Development

### Prerequisites
- Node.js v22 or higher

### Setup

```bash
git clone <your-repo-url>
cd feedback-board
npm install
```

Create `server/.env`:
```
PORT=3001
ADMIN_SECRET=your-secret
```

### Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## API Reference

| Method | Path                        | Auth  | Description              |
|--------|-----------------------------|-------|--------------------------|
| GET    | /api/feedback               | No    | List feedback            |
| POST   | /api/feedback               | No    | Create feedback          |
| GET    | /api/feedback/:id           | No    | Get single feedback      |
| POST   | /api/feedback/:id/vote      | No    | Toggle upvote            |
| PATCH  | /api/feedback/:id/status    | Admin | Update status            |
| DELETE | /api/feedback/:id           | Admin | Delete feedback          |

Admin endpoints require the `x-admin-key` header matching `ADMIN_SECRET`.

Query params for `GET /api/feedback`:
- `status` — filter by `open`, `in_progress`, `done`, `closed`
- `sort` — `newest` (default) or `top`

## Deployment

### Environment Variables

| Variable                | Where           | Description                       |
|-------------------------|-----------------|-----------------------------------|
| `ADMIN_SECRET`          | Render          | Admin key for protected endpoints |
| `VITE_API_URL`          | Vercel          | Full URL of the Render backend    |
| `RENDER_DEPLOY_HOOK_URL`| GitHub Secret   | Webhook to trigger Render redeploy |

### Steps

1. **Push to GitHub** — create a repo and push this code
2. **Render.com** — create a new Web Service, connect your GitHub repo, set `ADMIN_SECRET`
3. **Vercel** — import the repo, set root to `client/`, add `VITE_API_URL` pointing to your Render URL
4. **GitHub Secrets** — add `RENDER_DEPLOY_HOOK_URL` and `VITE_API_URL` under Settings → Secrets

After that, every push to `main` will build and auto-deploy both services.
