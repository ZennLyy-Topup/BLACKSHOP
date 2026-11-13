import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="text-lg font-bold mb-2"><span className="gradient-text">Nexus</span>Store</p>
          <p className="text-gray-500 leading-relaxed">Premium hardware and digital cards, delivered worldwide.</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Shop</p>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/?tab=ITEM" className="hover:text-white transition">Hardware</Link></li>
            <li><Link href="/?tab=CARD" className="hover:text-white transition">Digital Cards</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Account</p>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
            <li><Link href="/register" className="hover:text-white transition">Register</Link></li>
            <li><Link href="/orders" className="hover:text-white transition">Order History</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">We Accept</p>
          <div className="flex gap-3 text-gray-400">
            <span className="glass px-3 py-1.5 rounded-lg text-xs">💳 Visa</span>
            <span className="glass px-3 py-1.5 rounded-lg text-xs">PayPal</span>
            <span className="glass px-3 py-1.5 rounded-lg text-xs">₿ Crypto</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} NexusStore. All rights reserved.
      </div>
    </footer>
  );
}