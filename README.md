# PanoMelk

A Persian, right-to-left real-estate platform prototype focused on property projects and immersive 360-degree presentation. The codebase combines a Next.js application, PostgreSQL-backed project and account APIs, and a Photo Sphere Viewer preview.

> **Prototype status:** The project schema and APIs cover user accounts, projects, hotspots, conversations, plans, transactions, and analytics. The current 360-degree preview still uses a sample panorama and demonstration markers; it is not yet wired to load each property's saved panorama and hotspot data.

## What Is Included

- Account flows for registration, sign-in, phone/email verification, and password recovery
- Project APIs for creating, updating, listing, and deleting project records
- Property project metadata and optional map, preview, and embedded-view fields
- Hotspot APIs and a 360-degree viewer powered by Photo Sphere Viewer
- User conversations and messaging endpoints
- Plan, transaction, and project-analytics data models and API routes
- Persian RTL interface with light/dark visual assets

Some integrations require external provider credentials. Billing and the sample panorama should be treated as prototype features until their complete production flows are configured and verified.

## Technology

- Next.js 16, React 19, and TypeScript
- PostgreSQL with Prisma 7 and the Prisma PostgreSQL adapter
- NextAuth for session handling
- Photo Sphere Viewer and its markers plugin
- Tailwind CSS 4 and Dockview

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL 15 or newer

## Local Setup

1. Create a PostgreSQL database for PanoMelk.
2. Clone the repository and create the local environment file:

   ```powershell
   git clone https://github.com/MojtabaShams/PanoMelk.git
   cd PanoMelk
   Copy-Item .env.example .env
   ```

3. Set `DATABASE_URL` and `NEXTAUTH_SECRET` in `.env`. Add the SMS and email provider values if you want to exercise those verification flows.
4. Install dependencies and initialize the Prisma client and local schema:

   ```powershell
   npm ci
   npx prisma generate
   npx prisma db push
   ```

   `db push` is for local prototyping. Establish and review a migration workflow before applying schema changes to production data.

5. Start the development server:

   ```powershell
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000). The root route contains the account flow; the dashboard and project preview are available at `/dashboard` and `/preview/{projectId}`.

## Environment Variables

| Variable | Required for | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Database-backed features | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Authentication and verification tokens | Long, random application secret |
| `NEXTAUTH_URL` | Production deployments | Canonical application URL used by NextAuth |
| `SMS_IR_API_KEY` | SMS verification | SMS.ir API credential |
| `SMS_IR_TEMPLATE_ID` | SMS verification | SMS.ir verification template ID |
| `RESEND_API_KEY` | Email verification | Resend API credential |
| `RESEND_FROM_EMAIL` | Email verification | Verified sender address |

`.env.example` contains placeholders only. Keep real credentials in your local environment or deployment secret manager; never commit them.

## Useful Commands

```powershell
npm run dev
npm run lint
npm run build
```

Regenerate Prisma client code after schema changes:

```powershell
npx prisma generate
```

Emit the Prisma contract artifacts:

```powershell
npm run contract:emit
```

## Project Layout

```text
app/
  api/                   Account, project, hotspot, messaging, plan, and analytics APIs
  dashboard/             Authenticated dashboard
  preview/[id]/          360-degree project preview
  page.tsx               Account and verification flows
components/               Shared interface components
lib/                      Database, API, and verification helpers
prisma/schema.prisma      PostgreSQL data model
```

## Development and Deployment Notes

- Use a dedicated PostgreSQL database and a unique `NEXTAUTH_SECRET` in each environment.
- Configure SMS.ir and Resend only when using their corresponding verification flows.
- The preview currently demonstrates the viewer with sample panorama content; connect stored project assets and hotspot records before presenting it as a live property tour.
- Do not treat the included prototype payment and account flows as production-ready without end-to-end testing, security review, and provider configuration.
