"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const r = await fetch("/api/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (r.ok) router.push("/login");
    else { setError((await r.json()).error); setLoading(false); }
  };

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <form onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md fade-up">
        <h1 className="text-3xl font-bold text-center">Create account</h1>
        <p className="text-gray-500 text-sm text-center mt-2 mb-8">Join NexusStore -- it takes less than a minute</p>

        {error && <p className="bg-red-500/10 text-red-400 text-sm rounded-xl p-3 mb-4 text-center">{error}</p>}

        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full Name</label>
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full glass rounded-xl px-4 py-3 mt-1.5 mb-4 outline-none focus:border-indigo-500 transition" placeholder="John Doe" />
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full glass rounded-xl px-4 py-3 mt-1.5 mb-4 outline-none focus:border-indigo-500 transition" placeholder="you@example.com" />
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
        <input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full glass rounded-xl px-4 py-3 mt-1.5 mb-6 outline-none focus:border-indigo-500 transition" placeholder="Minimum 6 characters" />

        <button disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 py-3.5 rounded-xl font-semibold transition hover:shadow-lg hover:shadow-indigo-500/30">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
        </p>
      </form>
    </main>
  );
}