# Robotics Updates 2026

Website profesionale për përditësimet e robotikës, organizuar nga SHFMU Ismail Qemali, Prishtinë.

## Teknologjitë

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- React 18

## Instalimi

```bash
npm install
```

## Development

```bash
npm run dev
```

Aplikacioni do të hapet në `http://localhost:3000` (ose port tjetër nëse 3000 është i zënë).

## Build

```bash
npm run build
npm start
```

## Struktura e Projektit

- `app/` - Next.js App Router pages dhe API routes
- `components/` - React components
- `lib/` - Utility functions (auth, database, etc.)
- `sql/` - Database schema

## Credentials

**Admin:**
- Username: `admin`
- Password: `Admin@2026!RobotikaSHFMU`

**Teacher:**
- Username: `mesuese`
- Password: `Mesuese@2026!SHFMUIsmailQemali`

## Setup Database

Ekzekuto `/api/setup` për të krijuar përdoruesit default në database.

## Deployment

Projekti është i gatshëm për deployment në Vercel. Sigurohu që ke konfiguruar environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET` (optional, ka default)
