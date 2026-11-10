# AI Symptom Intake Assistant

A chat app that asks guided intake questions, streams the AI's replies, and produces a structured summary for a doctor. It never diagnoses.

**Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, any OpenAI-compatible LLM API, Jest + React Testing Library.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `LLM_API_KEY`. A free key from https://console.groq.com works with the defaults. If the default model name is retired, pick a current one from the provider's model list and set `LLM_MODEL`.
3. `npm run dev` and open http://localhost:3000

## Test
- `npm test`
- `npm run test:coverage` prints the coverage percentage for your resume.

## Deploy on Vercel (free)
1. Push this folder to a public GitHub repo (`.env.local` is git-ignored).
2. On vercel.com choose Add New, then Project, and import the repo.
3. Under Environment Variables add `LLM_API_KEY` (plus `LLM_BASE_URL` and `LLM_MODEL` if you changed them), then Deploy.

## How it works
- `app/api/chat`: validates input, rate-limits, calls the LLM with streaming on, and converts the provider's SSE stream into plain text for the browser.
- `app/api/summary`: sends the transcript, asks for JSON only, then parses and normalizes it so bad model output cannot break the UI.
- `components/Chat.tsx`: reads the stream chunk by chunk, validates input, and handles errors without losing the conversation.
- The API key stays on the server and is never sent to the browser.

## Limits
This is a demo, not a medical device. The rate limiter is in-memory per server instance. For production add real auth, persistent rate limiting, logging with consent, and privacy and compliance review.
