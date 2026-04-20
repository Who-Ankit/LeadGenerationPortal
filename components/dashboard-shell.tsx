"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, LogOut, RefreshCw } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Lead, LeadStatus } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type Filters = {
  date: string;
  status: string;
};

const defaultFilters: Filters = {
  date: "",
  status: ""
};

const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified"];

function toCsv(leads: Lead[]) {
  const header = ["id", "name", "email", "phone", "message", "status", "score", "created_at"];
  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.name,
      lead.email,
      lead.phone ?? "",
      lead.message ?? "",
      lead.status,
      String(lead.score),
      lead.created_at
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
}

export function DashboardShell() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
  }, []);

  async function loadLeads(currentFilters: Filters) {
    if (!supabase) {
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setAuthenticated(false);
      setLeads([]);
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    setAuthenticated(true);
    const searchParams = new URLSearchParams();

    if (currentFilters.date) {
      searchParams.set("date", currentFilters.date);
    }

    if (currentFilters.status) {
      searchParams.set("status", currentFilters.status);
    }

    const response = await fetch(`/api/leads?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to load leads.");
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    setLeads(data.leads ?? []);
    setLoading(false);
    setSessionChecked(true);
  }

  useEffect(() => {
    if (!supabase) {
      return;
    }

    loadLeads(filters);
  }, [filters, supabase]);

  async function handleExport() {
    const csv = toCsv(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leads-export.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setAuthenticated(false);
    setLeads([]);
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    if (!supabase) {
      return;
    }

    setUpdatingLeadId(id);
    setError(null);

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setAuthenticated(false);
      setUpdatingLeadId(null);
      return;
    }

    const response = await fetch("/api/leads", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ id, status })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to update status.");
      setUpdatingLeadId(null);
      return;
    }

    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, status: data.lead.status as LeadStatus } : lead))
    );
    setUpdatingLeadId(null);
  }

  if (sessionChecked && !authenticated) {
    return (
      <div className="card mx-auto max-w-2xl p-10 text-center">
        <h1 className="text-3xl font-black tracking-tight">Dashboard access requires sign in.</h1>
        <p className="mt-4 text-slate-600">
          Use Supabase Auth first, then come back here to review and export leads.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/auth" className="button-primary">
            Go to auth
          </Link>
          <Link href="/" className="button-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sea">Lead dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Monitor submissions and act faster.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Filter by date or lead status, review score at a glance, and export the current view to CSV.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="button-secondary" onClick={() => loadLeads(filters)} type="button">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button className="button-primary" onClick={handleExport} type="button" disabled={!leads.length}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          <button className="button-secondary" onClick={handleLogout} type="button">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Filter by date</label>
          <input
            className="input"
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Filter by status</label>
          <select
            className="input"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="button-secondary w-full" onClick={() => setFilters(defaultFilters)} type="button">
            Clear filters
          </button>
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Score</th>
                <th className="px-5 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-slate-500" colSpan={6}>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <div>{lead.email}</div>
                      {lead.message ? <div className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{lead.message}</div> : null}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{lead.phone || "-"}</td>
                    <td className="px-5 py-4">
                      <select
                        className="input min-w-36 py-2 text-xs font-semibold uppercase tracking-wide"
                        value={lead.status}
                        onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                        disabled={updatingLeadId === lead.id}
                      >
                        {leadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updatingLeadId === lead.id ? (
                        <div className="mt-2 text-xs text-slate-400">Saving status...</div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-slate-900">
                      <div className="font-semibold">{lead.score}</div>
                      <div className="text-xs text-slate-400">{lead.score >= 50 ? "High intent" : "Early stage"}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-6 text-slate-500" colSpan={6}>
                    No leads match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
