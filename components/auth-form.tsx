"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export function AuthForm() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase client is still loading. Please try again.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error: authError } = await action;

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      setMessage("Account created. Check your inbox if email confirmation is enabled.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="card w-full p-8">
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          className={mode === "signin" ? "button-primary flex-1" : "button-secondary flex-1"}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "signup" ? "button-primary flex-1" : "button-secondary flex-1"}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
        <button className="button-primary w-full" disabled={loading} type="submit">
          {!supabase ? "Loading..." : null}
          {supabase ? (loading ? "Please wait..." : mode === "signin" ? "Continue to dashboard" : "Create account") : null}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-sea">{message}</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <p className="mt-6 text-sm text-slate-500">
        Need to test the public flow first? <Link href="/" className="font-medium text-sea">Go back home</Link>
      </p>
    </div>
  );
}
