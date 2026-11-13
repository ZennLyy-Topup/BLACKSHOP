"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) router.push("/");
    else { setError("Invalid email or password."); setLoading(false); }
  };

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <form onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md fade-up">
        <h1 className="text-3xl font-bold text-center">Welcome back</h1>
        <p className="text-gray-500 text-sm text-center mt-2 mb-8">Sign in to your NexusStore account</p>

        {error && <p className="bg-red-500/10 text-red-400 text-sm rounded-xl p-3 mb-4 text-center">{error}</p>}

        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 mt-1.5 mb-4 outline-none focus:border-indigo-500 transition" placeholder="you@example.com" />
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 mt-1.5 mb-6 outline-none focus:border-indigo-500 transition" placeholder="••••••••" />

        <button disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 py-3.5 rounded-xl font-semibold transition hover:shadow-lg hover:shadow-indigo-500/30">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-gray-500 text-center mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
        </p>
      </form>
    </main>
  );
}