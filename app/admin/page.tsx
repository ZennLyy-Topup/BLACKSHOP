"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const tabs = ["Overview", "Products", "Orders"] as const;

export default function Admin() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", type: "ITEM", price: 0, stock: 0, image: "", desc: "", featured: false });
  const [editId, setEditId] = useState<number | null>(null);

  const admin = session?.user?.role === "ADMIN";
  const load = async () => {
    const [o, p] = await Promise.all([
      fetch("/api/orders").then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
    ]);
    setOrders(o.orders || []); setStats(o.stats || {}); setProducts(p);
  };
  useEffect(() => { if (admin) load(); }, [admin]);

  if (!admin)
    return <main className="text-center py-32 text-gray-500">⛔ Access denied. Admins only.</main>;

  /* ── Save / Update product ── */
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { ...form, id: editId } : form),
    });
    setEditId(null);
    setForm({ name: "", type: "ITEM", price: 0, stock: 0, image: "", desc: "", featured: false });
    load();
  };
  const editProduct = (p: any) => {
    setEditId(p.id);
    setForm({ name: p.name, type: p.type, price: p.price, stock: p.stock, image: p.image, desc: p.desc, featured: p.featured });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };
  const setStatus = async (id: number, status: string) => {
    await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 fade-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex glass rounded-full p-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                tab === t ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-white"
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {tab === "Overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Revenue", value: `$${(stats.revenue ?? 0).toFixed(2)}`, color: "text-green-400" },
              { label: "Paid Orders", value: stats.count ?? 0, color: "text-indigo-400" },
              { label: "Revenue (7d)", value: `$${(stats.revenue7d ?? 0).toFixed(2)}`, color: "text-purple-400" },
              { label: "Pending Orders", value: stats.pending ?? 0, color: "text-yellow-400" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</p>
                <p className={`text-3xl font-extrabold mt-2 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="font-semibold mb-4">Low Stock Alerts (&lt; 5 units)</p>
            {products.filter(p => p.stock < 5).map(p => (
              <div key={p.id} className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span>{p.name}</span>
                <span className={p.stock === 0 ? "text-red-400 font-bold" : "text-yellow-400"}>{p.stock} left</span>
              </div>
            ))}
            {products.filter(p => p.stock < 5).length === 0 && <p className="text-gray-500 text-sm">All good -- no low stock items.</p>}
          </div>
        </>
      )}

      {/* ═══ PRODUCTS ═══ */}
      {tab === "Products" && (
        <>
          <form onSubmit={saveProduct} className="glass rounded-2xl p-6 space-y-4 mb-8">
            <h2 className="font-semibold">{editId ? `✏️ Edit Product #${editId}` : "➕ Add New Product"}</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <input required placeholder="Product name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm">
                <option value="ITEM">Hardware</option><option value="CARD">Digital Card</option>
              </select>
              <input type="number" step="0.01" placeholder="Price ($)" value={form.price || ""}
                onChange={e => setForm({ ...form, price: +e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm" />
              <input type="number" placeholder="Stock quantity" value={form.stock || ""}
                onChange={e => setForm({ ...form, stock: +e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm" />
              <input placeholder="Image URL (optional)" value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm" />
              <label className="flex items-center gap-2 text-sm glass rounded-xl px-4">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                Featured on homepage
              </label>
            </div>
            <textarea placeholder="Description" value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })} className="glass rounded-xl px-4 py-2.5 text-sm w-full" rows={2} />
            <div className="flex gap-3">
              <button className="bg-indigo-500 hover:bg-indigo-400 px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                {editId ? "Update Product" : "Save Product"}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ name: "", type: "ITEM", price: 0, stock: 0, image: "", desc: "", featured: false }); }}
                  className="glass px-6 py-2.5 rounded-xl text-sm">Cancel</button>
              )}
            </div>
          </form>

          <table className="w-full text-sm glass rounded-2xl overflow-hidden">
            <thead className="bg-white/5 text-left text-gray-400">
              <tr><th className="p-4">Product</th><th>Type</th><th>Price</th><th>Stock</th><th className="text-right pr-4">Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="text-gray-400">{p.type}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td><span className={p.stock < 5 ? "text-yellow-400" : "text-green-400"}>{p.stock}</span></td>
                  <td className="text-right pr-4">
                    <button onClick={() => editProduct(p)} className="text-indigo-400 hover:text-indigo-300 mr-4">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ═══ ORDERS ═══ */}
      {tab === "Orders" && (
        <table className="w-full text-sm glass rounded-2xl overflow-hidden">
          <thead className="bg-white/5 text-left text-gray-400">
            <tr><th className="p-4">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Method</th><th>Status</th><th className="text-right pr-4">Action</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-white/5">
                <td className="p-4 font-medium">#{o.id}</td>
                <td className="text-gray-400">{o.user?.email}</td>
                <td className="text-gray-400">{o.items.map((i: any) => `${i.name}×${i.qty}`).join(", ")}</td>
                <td className="font-bold">${o.total.toFixed(2)}</td>
                <td className="text-gray-400 capitalize">{o.method}</td>
                <td>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    o.status === "PAID" ? "bg-green-500/15 text-green-400"
                    : o.status === "FAILED" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                  }`}>{o.status}</span>
                </td>
                <td className="text-right pr-4">
                  {o.status !== "PAID" && (
                    <button onClick={() => setStatus(o.id, "PAID")} className="text-green-400 hover:text-green-300 text-xs font-semibold">
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}