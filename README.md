# DigitalShield AI — Full-stack MVP Starter

This package contains a detailed responsive dashboard UI, Next.js/React frontend, Express API, Supabase schema, and API endpoints for storing brand profiles and scan submissions.

## What works in this package

- Responsive command-center dashboard and navigation for the feature set
- Dashboard charts and investigation-oriented visual components
- Local text-pattern warning check with honest "Caution" / "Unverified" labels
- Express health endpoint with API/database/provider configuration status
- Brand profile create/list/detail API routes
- Scan submission and scan history API routes
- Supabase schema for brands, scans, findings, and cases; RLS is enabled
- Graceful behavior when API or Supabase is not configured

## Important: production integrations are not yet complete

This is a full-stack MVP foundation, not a production-complete digital risk protection service. The interface still contains illustrative dashboard rows and the relationship map is illustrative. The included API stores scan requests but does not query threat-intelligence providers. Social media monitoring, app store discovery, real QR decoding, screenshot OCR, AI analysis, authentication, user-scoped authorization, alert delivery, and PDF evidence export need provider configuration and additional implementation/testing. Never treat sample rows as live detections.

## Requirements

Node.js 20 LTS recommended, npm, a Supabase project for persistence.

## Run frontend

From the project root:

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Run backend

Open a second terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5000/api/health`.

## Configure Supabase

1. Open your Supabase project dashboard and use SQL Editor.
2. Run `supabase/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`. Keep the service role key secret and never use it in frontend variables.
5. Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `.env.local`.
6. Restart the backend after editing environment variables.

The backend service-role key bypasses RLS, so production deployment must add authenticated API middleware and enforce user/organization ownership checks before exposing brand and scan routes. Do not deploy the current API publicly with unrestricted service-role access.

## Endpoints

- `GET /api/health` — API/database/provider configuration status
- `GET /api/brands` — list stored brands
- `POST /api/brands` — create a brand
- `GET /api/brands/:id` — get one brand
- `GET /api/scans` — list stored scan submissions
- `POST /api/scans` — store a scan submission as unverified

## Provider configuration

The backend `.env.example` names optional API credentials for Google Safe Browsing, VirusTotal, YouTube, and X. Merely adding keys does not activate integrations; provider adapters, permission checks, quotas, and tests must be implemented before calling results live.

## Security checklist before deployment

- Implement Supabase Auth, JWT verification, and user/tenant ownership checks.
- Keep RLS enabled and add policies matching the intended user access model.
- Never send the Supabase service-role key to the browser.
- Add upload size/type limits, malware-safe file handling, rate limiting, audit logs, and secret management.
- Connect only authorized data sources and retain source URLs/timestamps for each finding.
- Label unavailable providers and never fabricate findings or risk scores.
- Run `npm run build`, API tests, and end-to-end tests after installing dependencies.


## Frontend + backend connection (local development)

### 1. Configure the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never use a `NEXT_PUBLIC_` prefix)

### 2. Create the database tables

Open Supabase Dashboard → SQL Editor and run the full `supabase/schema.sql` file. This includes the `workspace_items` table used by the Add Item and View Details workflow.

### 3. Configure and run the frontend

In the project root, copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

From the project root, open one terminal and run:

```bash
npm install
npm run dev
```

### 4. Run the backend

Open a second terminal in the project root and run:

```bash
npm run backend
```

The frontend is normally at `http://localhost:3000`; the backend health check is `http://localhost:5000/api/health`.

### Connected API routes

- `GET /api/health` — backend and configuration status
- `GET /api/items` — list saved workspace items
- `POST /api/items` — save an Add Item form submission
- `GET /api/items/:id` — retrieve one saved item
- `GET/POST /api/brands` — brand profiles
- `GET/POST /api/scans` — scan request records (not a live threat verdict)

The Add Item form now saves records through Express into Supabase, and View Details shows the saved record fields. Refresh the page to confirm persistence.

### Security warning

This starter currently uses a server-side Supabase service-role key and does not implement user authentication/ownership checks. Keep it local or in a trusted test environment until authentication, authorization, and tenant-scoped data access are implemented. Do not deploy this API publicly as-is. The schema keeps RLS enabled; a service-role client bypasses RLS, so the API itself must enforce access controls before production.
