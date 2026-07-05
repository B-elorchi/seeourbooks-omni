# seeourbook-omni

Client-facing portal for SeeOurBook — upload a PDF/EPUB, paste a YouTube link, or pick a catalog book, then track AI summarization/audio/mindmap generation in real time and browse your personal library.

Built with React 19 + Vite + Tailwind, Supabase Auth, and `react-i18next` (EN/AR).

## Stack

- **React 19 / Vite / TypeScript**
- **Supabase JS** — auth (email/password) against the same Supabase project as the main backend
- **react-i18next** — EN/AR UI translation
- **axios** — talks to the `seeourbook-summarizer-api` backend (FastAPI)

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_API_BASE_URL
npm run dev
```

## Environment variables

| Var | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (same project as the main backend) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_BASE_URL` | Base URL of the `seeourbook-summarizer-api` backend, e.g. `https://api.seeourbook.sa/api` |

## Pages

- `LandingPage` — public marketing page
- `LoginPage` / `SignupPage` — Supabase email/password auth
- `DashboardPage` — overview
- `ProcessingPage` — submit a new job (Upload / Library pick / YouTube URL)
- `MyBooksPage` — job history, filterable by source
- `LibraryPage` — browse the hosted catalog
