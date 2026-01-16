# DoubtIQ

AI-powered doubt solver with a React (Vite) frontend and a Node.js/Express backend. Users can sign up, ask questions, get AI-generated answers, and track their doubts in a dashboard.

## Features
- User auth with JWT and email OTP verification.
- Create, list, and resolve doubts; AI answers via the integrated model helper.
- Clean landing page with marketing sections plus authenticated dashboard.
- Configurable mailer and database; environment-first configuration.

## Tech Stack
- Frontend: React, Vite.
- Backend: Node.js, Express, MongoDB (Mongoose).
- Auth: JWT, OTP over email.
- AI: Groq AI (or compatible) via `utils/ai.js`.

## Repository Layout
- `DoubtIQ_Backend/` – API server (Express, MongoDB, JWT, OTP, AI helper).
- `DoubtIQ_Frontend/` – Vite/React client.
- `.gitignore` – excludes env files and dependencies.

## Prerequisites
- Node.js 18+ and npm.
- MongoDB instance.
- SMTP account for OTP mail.
- OpenAI-compatible API key for AI answers.

## Setup
1) Install dependencies
- Backend: `cd DoubtIQ_Backend && npm install`
- Frontend: `cd DoubtIQ_Frontend && npm install`

2) Run locally
- Start API: `cd DoubtIQ_Backend && npm run start` (or `npm run dev` if defined)
- Start client: `cd DoubtIQ_Frontend && npm run dev`

Frontend defaults to Vite’s dev port (5173); backend default is 5000. Update CORS/base URLs in the frontend if needed.

## Development Notes
- Keep `.env` files out of version control (already in root `.gitignore`).
- If you add new config values, document them above.
- Consider adding lint and test scripts for CI once the API surface stabilizes.

## Deployment
- Configure environment variables on your host (no env files committed).
- Build frontend for production: `cd DoubtIQ_Frontend && npm run build` (outputs `dist/`).
- Serve backend with a process manager (e.g., pm2) and point the frontend to the deployed API base URL.
