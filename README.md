# AI Symptom Intake Assistant

A chat app that asks guided intake questions, streams the AI's replies, and produces a structured summary for a doctor. It never diagnoses.

**Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, any OpenAI-compatible LLM API, Jest + React Testing Library.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `LLM_API_KEY`. A free key from https://console.groq.com works with the defaults. If the default model name is retired, pick a current one from the provider's model list and set `LLM_MODEL`.
3. `npm run dev` and open http://localhost:3000
