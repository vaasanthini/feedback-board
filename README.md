# Feedback Board

A lightweight public feedback board where users can submit, vote on, and track feature requests and bug reports. Admins can manage status updates and delete items via a secret-key login.

## Features

- Submit feedback with a title and description
- Upvote feedback items (one vote per browser)
- Filter by status: Open, In Progress, Done, Closed
- Sort by most votes or newest
- Admin panel — change status, delete items
- Dark mode support
- Fully responsive UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | SQLite (via `better-sqlite3`) |
| Deployment | Vercel (frontend), Render (backend) |
| CI/CD | GitHub Actions |

## Project Structure

```
feedback-board/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context (admin, dark mode, filters)
│   │   └── pages/       # Board and detail pages
│   └── vite.config.js
├── server/          # Express backend
│   └── src/
│       ├── db/          # SQLite connection and migrations
│       ├── feedback/    # Router, service, repository
│       └── middleware/  # Admin auth, error handler
├── .github/
│   └── workflows/deploy.yml
└── render.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/vaasanthini/feedback-board.git
cd feedback-board
npm install
```

### Environment Variables

Create `server/.env` (use `server/.env.example` as a template):

```env
PORT=3001
ADMIN_SECRET=your-secret-key-here
```

### Running Locally

```bash
npm run dev
```

This starts both the frontend (`localhost:5173`) and backend (`localhost:3001`) concurrently with hot reload.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Health check | http://localhost:3001/health |

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/feedback` | — | List all feedback (`?status=`, `?sort=`) |
| `POST` | `/api/feedback` | — | Create feedback |
| `GET` | `/api/feedback/:id` | — | Get single feedback item |
| `POST` | `/api/feedback/:id/vote` | — | Toggle vote |
| `PATCH` | `/api/feedback/:id/status` | Admin | Update status |
| `DELETE` | `/api/feedback/:id` | Admin | Delete item |
| `GET` | `/api/feedback/admin/verify` | Admin | Verify admin key |

Admin requests require the `x-admin-key` header.

## Deployment

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set **Root Directory** to `server`
3. Build command: `npm install` | Start command: `npm start`
4. Add environment variables: `ADMIN_SECRET`, `CLIENT_URL`

The `render.yaml` in this repo can also be used for Render's Infrastructure as Code setup.

### Frontend — Vercel

1. Import the repo on [vercel.com](https://vercel.com), set **Root Directory** to `client`
2. Framework: **Vite**
3. Add environment variable: `VITE_API_URL` = your Render backend URL

### GitHub Actions (CI/CD)

The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:

1. Installs dependencies
2. Builds both client and server
3. Triggers a Render deploy hook on success

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | Your Render backend URL |
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook URL from Render dashboard |

## Admin Access

Click **Admin** in the top-right corner of the app and enter the `ADMIN_SECRET` value from your environment. The key is stored in `localStorage` for the session.

## License

MIT
