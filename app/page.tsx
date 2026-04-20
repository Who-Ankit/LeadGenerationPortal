import Link from "next/link";
import { ArrowRight, BarChart3, Download, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

const highlights = [
  {
    title: "Fast lead capture",
    description: "Turn campaign traffic into structured leads with a clean, mobile-first form.",
    icon: ArrowRight
  },
  {
    title: "Score automatically",
    description: "Apply basic scoring rules the moment a lead is submitted.",
    icon: BarChart3
  },
  {
    title: "Export anytime",
    description: "Review the pipeline and export leads as CSV from the dashboard.",
    icon: Download
  },
  {
    title: "Secure auth",
    description: "Use Supabase authentication for sign-up, sign-in, and session management.",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="flex flex-col justify-between gap-10 py-8">
          <div className="space-y-8">
            <div className="inline-flex w-fit rounded-full border border-sea/20 bg-sea/10 px-4 py-2 text-sm font-medium text-sea">
              Vercel-ready SaaS lead generation
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-ink md:text-6xl">
                Capture better leads and qualify them before your team ever opens the dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A polished starter built with Next.js App Router, Supabase, and Tailwind. Collect inbound
                leads, score them, filter them, and export clean CSVs without leaving the browser.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="#capture" className="button-primary">
                Start collecting leads
              </Link>
              <Link href="/auth" className="button-secondary">
                Admin login
              </Link>
              <Link href="/dashboard" className="button-secondary">
                View dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="card p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-mist p-3 text-sea">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div id="capture" className="flex items-center py-8">
          <LeadForm />
        </div>
      </section>
    </main>
  );
}
