# Lead Generation Portal

A Vercel-ready SaaS starter built with Next.js App Router, Supabase, and Tailwind CSS.

## Included

- Landing page with hero section and lead capture form
- `POST /api/leads` to save leads with simple scoring
- `GET /api/leads` to fetch leads for the dashboard
- Supabase email/password auth
- Dashboard with date and status filters
- CSV export from the current dashboard view

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. In Supabase SQL Editor, run [`supabase/schema.sql`](/D:/LeadGenerationportal/supabase/schema.sql:1).

4. Start the app:

```bash
npm run dev
```

## Seed demo leads

If you want sample records in the dashboard:

```bash
npm run seed:leads
```

## Deploy To Vercel

1. Push this project to a Git repository on GitHub, GitLab, or Bitbucket.
2. In Vercel, click `Add New...` -> `Project`.
3. Import the repository and keep the default Next.js framework settings.
4. Add these environment variables in the Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. Deploy the project.
6. In Supabase SQL Editor, run [`supabase/schema.sql`](/D:/LeadGenerationportal/supabase/schema.sql:1) if you have not already created the `leads` table.
7. In Supabase Authentication settings, add your Vercel production domain to the allowed site URL and redirect URL list.

## Vercel Notes

- No custom `vercel.json` file is required for this Next.js app.
- The `NODE_TLS_REJECT_UNAUTHORIZED=0` workaround was only for your local machine and should not be added in Vercel.
- After changing Vercel environment variables, redeploy the app so the new values are included in the build.

## Notes

- The dashboard requires a signed-in Supabase user.
- Lead creation is public so the landing page form can work without auth.
- Reads are authorized by passing the signed-in user's access token to the API route.
- You can update lead statuses inline from the dashboard after signing in.
