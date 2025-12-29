# Pastebin Lite

A minimal Pastebin-like application built with Next.js.

Users can create text pastes and share a link to view them.  
Pastes can optionally expire after a time limit (TTL) or a maximum number of views.

---

## Features

- Create a paste with arbitrary text
- Optional time-based expiry (TTL)
- Optional view-count limit
- Shareable URL to view pastes
- Safe rendering (no script execution)
- Persistent storage (serverless-safe)
- Deterministic expiry support for automated testing

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Upstash Redis (persistence)
- Vercel (deployment)

---

## Running Locally

### Prerequisites
- Node.js >= 20
- npm

### Setup

```bash
npm install

###########

Create a .env.local file in the project root with:
UPSTASH_REDIS_REST_URL=<your_upstash_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_redis_token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000

###########

Open http://localhost:3000
 in your browser.

###########

API Endpoints
Health check : GET /api/healthz

###########

GET /api/healthz

###########

Create a paste
POST /api/pastes

###########

Request body:
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}

###########

Persistence Layer

This project uses Upstash Redis for persistence.
Redis is used because it is serverless-friendly and ensures data survives across requests in deployment environments such as Vercel.