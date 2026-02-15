# Copilot instructions for DJ Silver Web System

## Project snapshot
- Repo currently contains only product requirements: [PRD.json](PRD.json) and [PRD.md](PRD.md). No application code, build config, or scripts are present yet.
- The PRD defines a planned MERN stack: React frontend, Node/Express backend, MongoDB, TailwindCSS, local filesystem storage, JWT-based single-admin auth.

## Architectural intent (from PRD)
- Frontend features: Home (hero + gig ticker + services grid + audio strip), Fans page with masonry posts and guest modal, Booking 3-step wizard, Music embeds.
- Backend services: events ticker, booking submissions, fan posts (with image upload), likes (IP-based), admin auth, admin delete posts.
- Data models (Mongoose) and fields are specified in [PRD.md](PRD.md) (FanPost, Comment, Booking, Event).

## Patterns and constraints to follow once code exists
- File uploads: local filesystem; validate max 5MB and formats jpg/png/webp.
- Rate limits: bookings (10 min window) and fan posts (1 hour window).
- Guest identity: store name in localStorage key `dj_silver_guest_name`.
- Admin auth: single account from environment variables with JWT.

## Gaps to confirm when implementing
- No build/test/debug workflows defined yet in repo. Do not invent commands; ask for preferred tooling once scaffolding begins.
- No folder structure exists yet; align any scaffolding with the PRD sections above.
