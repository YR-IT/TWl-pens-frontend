import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, ShoppingBag, Users, DollarSign, Truck, Upload, Trash2, Edit3, Plus, X } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { money } from "../lib/format";
import { toast } from "sonner";

const CATEGORIES = ["Fountain Pens", "Rollerball", "Ballpoint", "Mechanical Pencils", "Inks", "Accessories", "Limited Editions"];
const SHIPMENT_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Admin() {
  const { user, ready } = useAuth();
  const [tab, setTab] = useState("dashboard");

  if (!ready) return <div className="pt-[76px] p-12 text-center text-[#6E685E]">Loading…</div>;
  if (!user) return <Navigate to="/login" replace/>;
  if (user.role !== "admin") return <Navigate to="/" replace/>;

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6E0D6] pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">ATELIER · INTERNAL</p>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#1C1815] mt-2">Admin dashboard</h1>
          </div>
          <div className="flex gap-2">
            {["dashboard", "products", "orders"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${tab === t ? "border-[#1C1815] bg-[#1C1815] text-[#FAF8F5]" : "border-[#E6E0D6] text-[#6E685E] hover:border-[#3D4838]"}`}
                data-testid={`admin-tab-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {tab === "dashboard" && <Dashboard/>}
          {tab === "products" && <ProductsTab/>}
          {tab === "orders" && <OrdersTab/>}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);
  if (!stats) return <p className="text-[#6E685E]" data-testid="dashboard-loading">Loading metrics…</p>;
  const cards = [
    { label: "Revenue", value: money(stats.revenue), icon: DollarSign, testid: "stat-revenue" },
    { label: "Orders", value: stats.total_orders, icon: ShoppingBag, testid: "stat-orders" },
    { label: "Paid", value: stats.paid_orders, icon: Package, testid: "stat-paid" },
    { label: "Shipped", value: stats.shipped_orders, icon: Truck, testid: "stat-shipped" },
    { label: "Products", value: stats.total_products, icon: Package, testid: "stat-products" },
    { label: "Customers", value: stats.total_customers, icon: Users, testid: "stat-customers" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="admin-dashboard">
      {cards.map((c) => (
        <div key={c.label} className="border border-[#E6E0D6] bg-white p-5" data-testid={c.testid}>
          <c.icon size={16} className="text-[#B8860B]"/>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mt-3">{c.label}</p>
          <p className="font-serif text-2xl text-[#1C1815] mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | product object
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/products", { params: { limit: 500 } }).then((r) => setProducts(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    toast.success("Product deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-[#1C1815]">Product catalog</h2>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838]" data-testid="add-product-btn">
          <Plus size={14}/> Add product
        </button>
      </div>
      {loading ? (
        <p className="text-[#6E685E]">Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-[#E6E0D6] bg-white">
          <table className="w-full text-sm" data-testid="products-table">
            <thead className="bg-[#F3EFEA] text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[#E6E0D6]" data-testid={`product-row-${p.id}`}>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-[#F3EFEA] overflow-hidden">
                      {p.images?.[0] && <img src={fileUrl(p.images[0])} alt="" className="w-full h-full object-cover"/>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-serif text-[#1C1815]">{p.name}</p>
                    <p className="text-xs text-[#6E685E]">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6E685E]">{p.category}</td>
                  <td className="px-4 py-3 text-[#1C1815]">
                    {p.discount_price ? (
                      <><span className="font-medium">{money(p.discount_price)}</span> <span className="text-xs text-[#6E685E] line-through ml-1">{money(p.price)}</span></>
                    ) : money(p.price)}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(p)} className="p-2 hover:bg-[#F3EFEA]" data-testid={`edit-product-${p.id}`}><Edit3 size={14}/></button>
                    <button onClick={() => del(p.id)} className="p-2 hover:bg-[#F3EFEA] text-red-700" data-testid={`delete-product-${p.id}`}><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? {
    ...product,
    features: product.features?.join("\n") || "",
    specs: Object.entries(product.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n"),
    images: product.images || [],
  } : {
    name: "", brand: "", category: CATEGORIES[0], price: "", discount_price: "",
    description: "", features: "", specs: "", images: [], stock: 10, featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm({ ...form, [k]: v });

  const upload = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      set("images", [...form.images, r.data.url]);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => set("images", form.images.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: parseFloat(form.price) || 0,
      discount_price: form.discount_price === "" || form.discount_price === null ? null : parseFloat(form.discount_price),
      description: form.description,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      specs: Object.fromEntries(
        form.specs.split("\n").map((l) => l.split(":").map((s) => s.trim())).filter((p) => p.length === 2 && p[0])
      ),
      images: form.images,
      stock: parseInt(form.stock) || 0,
      featured: !!form.featured,
    };
    try {
      if (product) await api.put(`/admin/products/${product.id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4 bg-[#1C1815]/50" onClick={onClose}>
      <div className="bg-[#FAF8F5] w-full max-w-3xl p-6 lg:p-10" onClick={(e) => e.stopPropagation()} data-testid="product-form-modal">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">{product ? "EDIT" : "NEW"}</p>
            <h2 className="font-serif text-3xl text-[#1C1815] mt-1">{product ? product.name : "New product"}</h2>
          </div>
          <button onClick={onClose} data-testid="close-product-form"><X size={22}/></button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Fld label="Name" value={form.name} onChange={(v) => set("name", v)} testid="pf-name"/>
            <Fld label="Brand" value={form.brand} onChange={(v) => set("brand", v)} testid="pf-brand"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Category</span>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="pf-category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <Fld label="Stock" type="number" value={form.stock} onChange={(v) => set("stock", v)} testid="pf-stock"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Fld label="Price (original)" type="number" value={form.price} onChange={(v) => set("price", v)} testid="pf-price"/>
            <Fld label="Discount price (optional)" type="number" value={form.discount_price ?? ""} onChange={(v) => set("discount_price", v)} testid="pf-discount"/>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Description</span>
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-2 w-full bg-transparent border border-[#E6E0D6] p-3 outline-none focus:border-[#3D4838] resize-y" data-testid="pf-description"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Features (one per line)</span>
            <textarea rows={3} value={form.features} onChange={(e) => set("features", e.target.value)} className="mt-2 w-full bg-transparent border border-[#E6E0D6] p-3 outline-none focus:border-[#3D4838] resize-y" data-testid="pf-features"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Specs · one per line, "key: value"</span>
            <textarea rows={4} value={form.specs} onChange={(e) => set("specs", e.target.value)} placeholder="Colour: Silver\nMaterial: Metal" className="mt-2 w-full bg-transparent border border-[#E6E0D6] p-3 outline-none focus:border-[#3D4838] resize-y" data-testid="pf-specs"/>
          </label>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Images</span>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-[#F3EFEA]" data-testid={`pf-image-${i}`}>
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover"/>
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-[#1C1815] text-[#FAF8F5] w-6 h-6 grid place-items-center" data-testid={`pf-remove-image-${i}`}><X size={12}/></button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-[#3D4838] flex flex-col items-center justify-center text-[#3D4838] cursor-pointer hover:bg-[#F3EFEA]" data-testid="pf-upload-image">
                <Upload size={20}/>
                <span className="text-[10px] uppercase tracking-[0.15em] mt-2">{uploading ? "Uploading…" : "Upload"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}/>
              </label>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-[#1C1815]">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} data-testid="pf-featured"/>
            Feature on homepage
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E6E0D6]">
            <button onClick={onClose} className="px-5 py-3 text-xs uppercase tracking-[0.2em] border border-[#E6E0D6] hover:border-[#3D4838]" data-testid="pf-cancel">Cancel</button>
            <button onClick={save} disabled={saving} className="px-6 py-3 text-xs uppercase tracking-[0.2em] bg-[#1C1815] text-[#FAF8F5] hover:bg-[#3D4838] disabled:bg-[#6E685E]" data-testid="pf-save">
              {saving ? "Saving…" : "Save product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, type = "text", value, onChange, testid }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">{label}</span>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid={testid}/>
    </label>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/admin/orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const update = async (id, patch) => {
    try {
      await api.patch(`/admin/orders/${id}/shipment`, patch);
      toast.success("Shipment updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    }
  };

  if (loading) return <p className="text-[#6E685E]">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-[#6E685E]" data-testid="no-admin-orders">No orders yet.</p>;

  return (
    <div className="space-y-4" data-testid="admin-orders-list">
      {orders.map((o) => (
        <article key={o.id} className="border border-[#E6E0D6] bg-white p-6" data-testid={`admin-order-${o.id}`}>
          <header className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E0D6]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">ORDER {o.id}</p>
              <p className="text-xs text-[#6E685E] mt-1">{new Date(o.created_at).toLocaleString()} · {o.shipping?.full_name} · {o.shipping?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] uppercase tracking-[0.2em] ${o.payment_status === "paid" ? "text-[#3D4838]" : "text-[#B8860B]"}`}>
                {o.payment_status}
              </span>
              <span className="font-serif text-xl text-[#1C1815]">{money(o.total)}</span>
              <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-xs uppercase tracking-[0.15em] underline text-[#3D4838]" data-testid={`toggle-order-${o.id}`}>
                {expanded === o.id ? "Hide" : "Manage"}
              </button>
            </div>
          </header>

          {expanded === o.id && (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid={`order-details-${o.id}`}>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Items</h4>
                <ul className="text-sm space-y-1">
                  {o.items.map((it, i) => <li key={i}>{it.quantity}× {it.name} · {money(it.unit_price)}</li>)}
                </ul>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mt-4 mb-2">Ship to</h4>
                <p className="text-sm text-[#1C1815]">
                  {o.shipping?.full_name}<br/>
                  {o.shipping?.line1}{o.shipping?.line2 ? `, ${o.shipping.line2}` : ""}<br/>
                  {o.shipping?.city}, {o.shipping?.state} {o.shipping?.postal_code}<br/>
                  {o.shipping?.country} · {o.shipping?.phone}
                </p>
              </div>
              <ShipmentForm order={o} onUpdate={update}/>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ShipmentForm({ order, onUpdate }) {
  const [f, setF] = useState({
    status: order.shipment?.status || "pending",
    tracking_number: order.shipment?.tracking_number || "",
    carrier: order.shipment?.carrier || "",
  });
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Shipment</h4>
      <div className="space-y-3">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Status</span>
          <select value={f.status} onChange={(e) => setF({...f, status: e.target.value})} className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 outline-none focus:border-[#3D4838]" data-testid={`shipment-status-${order.id}`}>
            {SHIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Carrier</span>
            <input value={f.carrier} onChange={(e) => setF({...f, carrier: e.target.value})} placeholder="DHL, FedEx…" className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 outline-none focus:border-[#3D4838]" data-testid={`shipment-carrier-${order.id}`}/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Tracking #</span>
            <input value={f.tracking_number} onChange={(e) => setF({...f, tracking_number: e.target.value})} className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 outline-none focus:border-[#3D4838]" data-testid={`shipment-tracking-${order.id}`}/>
          </label>
        </div>
        <button onClick={() => onUpdate(order.id, f)} className="mt-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838]" data-testid={`save-shipment-${order.id}`}>
          Save shipment
        </button>
      </div>
    </div>
  );
}
