import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between rounded-[2rem] bg-ink px-8 py-10 text-white">
          <div>
            <Link href="/" className="text-sm text-white/70 hover:text-white">
              Back to landing page
            </Link>
            <h1 className="mt-8 text-4xl font-black tracking-tight">Keep your lead pipeline organized.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/75">
              Sign in with Supabase Auth to review submissions, filter by date or status, and export the list
              to CSV for outreach or CRM imports.
            </p>
          </div>
          <div className="mt-10 space-y-4 text-sm text-white/75">
            <p>Includes sign up and sign in flows.</p>
            <p>Dashboard requests are authorized with the user session access token.</p>
            <p>Lead writes stay server-side through secure route handlers.</p>
          </div>
        </section>
        <section className="flex items-center">
          <AuthForm />
        </section>
      </div>
    </main>
  );
}
