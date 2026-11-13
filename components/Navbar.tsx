"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="gradient-text">Nexus</span>Store
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/?tab=ITEM" className="hover:text-white transition">Hardware</Link>
          <Link href="/?tab=CARD" className="hover:text-white transition">Cards</Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 transition">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:text-indigo-400 transition">
            🛒
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {session ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold">
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 glass rounded-xl p-2 text-sm shadow-2xl">
                  <p className="px-3 py-2 text-gray-400 truncate">{session.user?.email}</p>
                  <Link href="/orders" className="block px-3 py-2 rounded-lg hover:bg-white/5">My Orders</Link>
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-white/5">Admin Panel</Link>
                  )}
                  <button onClick={() => signOut()} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-red-400">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition">Sign In</Link>
              <Link href="/register"
                className="text-sm bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-full font-medium transition">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}