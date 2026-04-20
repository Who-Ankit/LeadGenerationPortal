"use client";

import { FormEvent, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit lead.");
      }

      setForm(initialForm);
      setFeedback("Lead submitted successfully. Your team can review it in the dashboard.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card w-full p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sea">Lead capture form</p>
        <h2 className="text-3xl font-black tracking-tight">Turn interest into qualified pipeline.</h2>
        <p className="text-sm leading-6 text-slate-600">
          Submit a lead here to test the intake flow, scoring engine, and dashboard.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Work email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Phone number"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        />
        <textarea
          className="input min-h-32 resize-none"
          placeholder="Tell us about your use case"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        />

        <button className="button-primary w-full" disabled={loading} type="submit">
          {loading ? "Submitting..." : "Capture lead"}
        </button>
      </form>

      {feedback ? <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-sea">{feedback}</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
