import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, ShoppingBag, Users, DollarSign, Truck, Upload, Trash2, Edit3, Plus, X, Tag, Instagram, ArrowUp, ArrowDown, Sparkles, Layers, ChevronRight, Image as ImageIcon, Eye, Activity, ArrowDownRight } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { money } from "../lib/format";
import { useCategories, refreshCategories } from "../lib/categories";
import { toast } from "sonner";

const SHIPMENT_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending_whatsapp", "paid", "pending", "cancelled", "refunded"];

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
          <div className="flex gap-2 flex-wrap">
            {["dashboard", "products", "categories", "banner", "studio", "orders"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${tab === t ? "border-[#1C1815] bg-[#1C1815] text-[#FAF8F5]" : "border-[#E6E0D6] text-[#6E685E] hover:border-[#3D4838]"}`}
                data-testid={`admin-tab-${t}`}
              >
                {t === "banner" ? "Homepage Sections" : t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {tab === "dashboard" && <Dashboard/>}
          {tab === "products" && <ProductsTab/>}
          {tab === "categories" && <CategoriesTab/>}
          {tab === "banner" && <BannerTab/>}
          {tab === "studio" && <StudioTab/>}
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
    <div className="space-y-10" data-testid="admin-dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-[#E6E0D6] bg-white p-5 shadow-xs" data-testid={c.testid}>
            <c.icon size={16} className="text-[#B8860B]"/>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mt-3">{c.label}</p>
            <p className="font-serif text-2xl text-[#1C1815] mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Funnel Section */}
      <FunnelWidget />

      {/* Most Viewed & Most Abandoned Products */}
      <ProductEngagementWidget />
    </div>
  );
}

function FunnelWidget() {
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/funnel")
      .then((r) => setFunnel(r.data))
      .catch(() => setFunnel(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border border-[#E6E0D6] bg-white p-6 rounded-xs" data-testid="funnel-loading">
        <p className="text-xs text-[#6E685E]">Loading cart & conversion funnel…</p>
      </div>
    );
  }

  if (!funnel || !funnel.steps) return null;

  const maxSessions = Math.max(...funnel.steps.map((s) => s.sessions), 1);

  return (
    <div className="border border-[#E6E0D6] bg-white p-6 lg:p-8" data-testid="analytics-funnel-widget">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E0D6] gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold flex items-center gap-1.5">
            <Activity size={13} /> ATELIER CONVERSION FUNNEL
          </p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">E-Commerce Flow & Drop-offs</h2>
          <p className="text-xs text-[#6E685E] mt-1">
            Tracking customer progression from product discovery to WhatsApp checkout completion.
          </p>
        </div>
        <div className="bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 rounded-sm flex items-center gap-3 self-start sm:self-auto">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#6E685E] block">Overall Conversion</span>
            <span className="font-serif text-xl text-[#3D4838] font-medium" data-testid="overall-conversion-rate">
              {funnel.overall_conversion_pct}%
            </span>
          </div>
          <span className="text-xs text-[#6E685E] border-l border-[#E6E0D6] pl-3">
            {funnel.total_unique_sessions} total sessions
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mt-6">
        {funnel.steps.map((step, idx) => {
          const barWidthPct = Math.max(8, Math.round((step.sessions / maxSessions) * 100));
          return (
            <div key={step.stage} className="bg-[#FAF8F5] border border-[#E6E0D6] p-5 flex flex-col justify-between" data-testid={`funnel-step-${step.stage}`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#6E685E] font-medium">
                    0{idx + 1} · {step.name}
                  </span>
                  {idx > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E6E0D6] text-[#B8860B]">
                      {step.conversion_from_prev}% of prev
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-[#1C1815]">{step.sessions}</span>
                  <span className="text-xs text-[#6E685E]">sessions</span>
                </div>
                <p className="text-[11px] text-[#6E685E] mt-0.5 font-mono">
                  {step.raw_count} total events
                </p>

                {/* Funnel relative bar */}
                <div className="mt-4 w-full bg-[#E6E0D6] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1C1815] h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidthPct}%` }}
                  />
                </div>
              </div>

              {idx > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E6E0D6] flex items-center justify-between text-xs">
                  <span className="text-[#6E685E] flex items-center gap-1 text-[11px]">
                    <ArrowDownRight size={13} className="text-rose-600" /> Drop-off
                  </span>
                  <span className="font-medium text-rose-700 font-mono text-[11px]">
                    {step.drop_off_pct}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductEngagementWidget() {
  const [data, setData] = useState(null);
  const [viewTab, setViewTab] = useState("viewed"); // 'viewed' | 'abandoned'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/product-views")
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border border-[#E6E0D6] bg-white p-6 rounded-xs">
        <p className="text-xs text-[#6E685E]">Loading product engagement metrics…</p>
      </div>
    );
  }

  if (!data) return null;

  const displayList = viewTab === "viewed" ? (data.most_viewed || []) : (data.most_abandoned || []);

  return (
    <div className="border border-[#E6E0D6] bg-white p-6 lg:p-8" data-testid="product-engagement-widget">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E0D6] gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold flex items-center gap-1.5">
            <Eye size={13} /> PRODUCT INTELLIGENCE
          </p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">
            {viewTab === "viewed" ? "Most Viewed Instruments" : "High Cart Abandonment Instruments"}
          </h2>
          <p className="text-xs text-[#6E685E] mt-1">
            Analyze which writing instruments capture the highest interest versus cart drop-offs.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewTab("viewed")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
              viewTab === "viewed"
                ? "border-[#1C1815] bg-[#1C1815] text-[#FAF8F5]"
                : "border-[#E6E0D6] text-[#6E685E] hover:border-[#3D4838]"
            }`}
            data-testid="tab-most-viewed"
          >
            Most Viewed
          </button>
          <button
            onClick={() => setViewTab("abandoned")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
              viewTab === "abandoned"
                ? "border-[#1C1815] bg-[#1C1815] text-[#FAF8F5]"
                : "border-[#E6E0D6] text-[#6E685E] hover:border-[#3D4838]"
            }`}
            data-testid="tab-most-abandoned"
          >
            Most Abandoned
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left text-sm" data-testid="product-analytics-table">
          <thead>
            <tr className="border-b border-[#E6E0D6] text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">
              <th className="py-3 px-4">Instrument</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Views</th>
              <th className="py-3 px-4 text-center">Cart Adds</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Abandonment Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E0D6]">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6E685E] italic">
                  No engagement recorded for this segment yet.
                </td>
              </tr>
            ) : (
              displayList.map((item) => (
                <tr key={item.product_id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F3EFEA] border border-[#E6E0D6] overflow-hidden shrink-0">
                        {item.image && (
                          <img
                            src={fileUrl(item.image)}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                      <Link
                        to={`/product/${item.product_id}`}
                        target="_blank"
                        className="font-serif text-[#1C1815] hover:text-[#B8860B] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#6E685E]">{item.brand || "—"}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-[#1C1815]">{money(item.price)}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs">{item.views}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs">{item.cart_adds}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs">{item.orders}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-mono rounded ${
                        item.abandonment_rate > 70
                          ? "bg-rose-100 text-rose-800"
                          : item.abandonment_rate > 30
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.abandonment_rate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
  const cats = useCategories();
  const [form, setForm] = useState(product ? {
    ...product,
    features: product.features?.join("\n") || "",
    specs: Object.entries(product.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n"),
    images: product.images || [],
    featured: !!product.featured,
    new_arrival: product.new_arrival ?? true,
    best_seller: !!product.best_seller,
    engravable: !!product.engravable,
    engraving_max_length: product.engraving_max_length ?? 20,
    engraving_fonts: product.engraving_fonts?.join(", ") || "Classic Script, Timeless Serif, Modern Sans",
    engraving_positions: product.engraving_positions?.join(", ") || "Engraving on Cap, Engraving on Barrel, Engraving on Clip",
    engraving_note: product.engraving_note || "Hand-etched in our Panchkula studio · adds 2 working days",
    engraving_whatsapp_note: product.engraving_whatsapp_note || "Need logo engraving? Send your logo and Order Number via WhatsApp after ordering.",
    estimated_delivery: product.estimated_delivery || "",
  } : {
    name: "", brand: "", category: cats[0]?.name || "",
    price: "", discount_price: "",
    description: "", features: "", specs: "", images: [], stock: 10,
    featured: false, new_arrival: true, best_seller: false,
    engravable: true, engraving_max_length: 20,
    engraving_fonts: "Classic Script, Timeless Serif, Modern Sans",
    engraving_positions: "Engraving on Cap, Engraving on Barrel, Engraving on Clip",
    engraving_note: "Hand-etched in our Panchkula studio · adds 2 working days",
    engraving_whatsapp_note: "Need logo engraving? Send your logo and Order Number via WhatsApp after ordering.",
    estimated_delivery: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);
  const set = (k, v) => setForm({ ...form, [k]: v });

  // If no category assigned (new product) and cats loaded later, default it
  useEffect(() => {
    if (!product && !form.category && cats.length) set("category", cats[0].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats.length]);

  const uploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const filesArray = Array.from(fileList);
    const newUrls = [];
    try {
      // First attempt batch upload endpoint
      const fd = new FormData();
      filesArray.forEach((f) => fd.append("files", f));
      try {
        const r = await api.post("/admin/upload-multiple", fd, { headers: { "Content-Type": "multipart/form-data" } });
        if (r.data?.files?.length) {
          r.data.files.forEach((f) => { if (f.url) newUrls.push(f.url); });
        }
      } catch (batchErr) {
        // Fallback to sequential single uploads
        for (const file of filesArray) {
          const singleFd = new FormData();
          singleFd.append("file", file);
          const sr = await api.post("/admin/upload", singleFd, { headers: { "Content-Type": "multipart/form-data" } });
          if (sr.data?.url) newUrls.push(sr.data.url);
        }
      }
      if (newUrls.length > 0) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
        toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} added`);
      }
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const addUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
    setUrlInput("");
    setShowUrlField(false);
    toast.success("Image URL added");
  };

  const removeImage = (i) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const moveImage = (from, to) => {
    setForm((prev) => {
      if (to < 0 || to >= prev.images.length || from === to) return prev;
      const next = [...prev.images];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, images: next };
    });
  };

  const onDragStart = (i) => (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(i));
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (i) => (e) => {
    e.preventDefault();
    const from = parseInt(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from)) moveImage(from, i);
  };

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
      new_arrival: !!form.new_arrival,
      best_seller: !!form.best_seller,
      engravable: !!form.engravable,
      engraving_max_length: parseInt(form.engraving_max_length) || 20,
      engraving_fonts: form.engraving_fonts ? form.engraving_fonts.split(",").map((s) => s.trim()).filter(Boolean) : ["Classic Script", "Timeless Serif", "Modern Sans"],
      engraving_positions: form.engraving_positions ? form.engraving_positions.split(",").map((s) => s.trim()).filter(Boolean) : ["Engraving on Cap", "Engraving on Barrel", "Engraving on Clip"],
      engraving_note: form.engraving_note?.trim() || null,
      engraving_whatsapp_note: form.engraving_whatsapp_note?.trim() || null,
      estimated_delivery: form.estimated_delivery,
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
                {cats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <Fld label="Stock" type="number" value={form.stock} onChange={(v) => set("stock", v)} testid="pf-stock"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Fld label="Price (original)" type="number" value={form.price} onChange={(v) => set("price", v)} testid="pf-price"/>
            <Fld label="Discount price (optional)" type="number" value={form.discount_price ?? ""} onChange={(v) => set("discount_price", v)} testid="pf-discount"/>
          </div>
          <Fld label="Estimated Delivery Date" value={form.estimated_delivery} onChange={(v) => set("estimated_delivery", v)} testid="pf-delivery"/>
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
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Images · drag to reorder · first is the cover</span>
              <span className="text-[10px] text-[#6E685E]">{form.images.length} uploaded</span>
            </div>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((img, i) => (
                <div
                  key={img + i}
                  draggable
                  onDragStart={onDragStart(i)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(i)}
                  className="relative aspect-square bg-[#F3EFEA] cursor-grab active:cursor-grabbing border border-transparent hover:border-[#3D4838]"
                  data-testid={`pf-image-${i}`}
                >
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover pointer-events-none"/>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#1C1815] text-[#FAF8F5] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em]" data-testid={`pf-cover-badge-${i}`}>Cover</span>
                  )}
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0} className="bg-[#FAF8F5]/90 w-6 h-6 grid place-items-center disabled:opacity-30" data-testid={`pf-image-up-${i}`} title="Move earlier">‹</button>
                    <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.images.length - 1} className="bg-[#FAF8F5]/90 w-6 h-6 grid place-items-center disabled:opacity-30" data-testid={`pf-image-down-${i}`} title="Move later">›</button>
                    <button type="button" onClick={() => removeImage(i)} className="bg-[#1C1815] text-[#FAF8F5] w-6 h-6 grid place-items-center" data-testid={`pf-remove-image-${i}`}><X size={12}/></button>
                  </div>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-[#3D4838] flex flex-col items-center justify-center text-[#3D4838] cursor-pointer hover:bg-[#F3EFEA] transition-colors p-2 text-center" data-testid="pf-upload-image">
                <Upload size={20}/>
                <span className="text-[10px] uppercase tracking-[0.15em] mt-2 leading-tight">
                  {uploading ? "Uploading…" : "Add images"}
                </span>
                <span className="text-[8px] text-[#6E685E] mt-0.5">Select multiple</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      uploadFiles(e.target.files);
                      e.target.value = null;
                    }
                  }}
                />
              </label>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowUrlField(!showUrlField)}
                className="text-xs uppercase tracking-[0.15em] text-[#3D4838] hover:text-[#B8860B] transition-colors flex items-center gap-1 font-medium"
              >
                {showUrlField ? "− Close URL field" : "+ Add image via web URL"}
              </button>
            </div>
            {showUrlField && (
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-transparent border border-[#E6E0D6] px-3 py-2 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                />
                <button
                  type="button"
                  onClick={addUrlImage}
                  className="bg-[#1C1815] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-[#3D4838]"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} data-testid="pf-featured" className="accent-[#3D4838]"/>
              Feature on homepage
            </label>
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.new_arrival} onChange={(e) => set("new_arrival", e.target.checked)} data-testid="pf-new-arrival" className="accent-[#3D4838]"/>
              Mark as New Arrival
            </label>
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.best_seller} onChange={(e) => set("best_seller", e.target.checked)} data-testid="pf-best-seller" className="accent-[#3D4838]"/>
              Mark as Best Seller
            </label>
          </div>

          <div className="border-t border-[#E6E0D6] pt-5 space-y-4">
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.engravable} onChange={(e) => set("engravable", e.target.checked)} data-testid="pf-engravable"/>
              Allow bespoke studio engraving on this product
            </label>
            {form.engravable && (
              <div className="space-y-4 bg-[#F3EFEA]/50 p-4 border border-[#E6E0D6] mt-2">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Max engraving length (1–60 chars)</span>
                  <input type="number" min="1" max="60" value={form.engraving_max_length} onChange={(e) => set("engraving_max_length", e.target.value)} className="mt-1 w-32 bg-white border border-[#E6E0D6] px-3 py-1.5 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-max"/>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Allowed Font Styles (comma-separated)</span>
                  <input type="text" value={form.engraving_fonts} onChange={(e) => set("engraving_fonts", e.target.value)} placeholder="Classic Script, Timeless Serif, Modern Sans" className="mt-1 w-full bg-white border border-[#E6E0D6] px-3 py-1.5 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-fonts"/>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Allowed Engraving Positions (comma-separated)</span>
                  <input type="text" value={form.engraving_positions} onChange={(e) => set("engraving_positions", e.target.value)} placeholder="Engraving on Cap, Engraving on Barrel, Engraving on Clip" className="mt-1 w-full bg-white border border-[#E6E0D6] px-3 py-1.5 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-positions"/>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Engraving Studio Disclaimer / Lead Time Note</span>
                  <input type="text" value={form.engraving_note} onChange={(e) => set("engraving_note", e.target.value)} placeholder="Hand-etched in our Panchkula studio · adds 2 working days" className="mt-1 w-full bg-white border border-[#E6E0D6] px-3 py-1.5 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-note"/>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">WhatsApp Custom Logo Engraving Prompt</span>
                  <input type="text" value={form.engraving_whatsapp_note} onChange={(e) => set("engraving_whatsapp_note", e.target.value)} placeholder="Need logo engraving? Send your logo and Order Number via WhatsApp after ordering." className="mt-1 w-full bg-white border border-[#E6E0D6] px-3 py-1.5 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-whatsapp-note"/>
                </label>
              </div>
            )}
          </div>

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

function CategoriesTab() {
  const cats = useCategories();
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null); // {id, name, order, image}

  const reload = async () => { await refreshCategories(); };

  const handleUpload = async (file, isEditing = false) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (isEditing) {
        setEditing((prev) => ({ ...prev, image: r.data.url }));
      } else {
        setNewImage(r.data.url);
      }
      toast.success("Category image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await api.post("/admin/categories", { name: newName.trim(), order: cats.length, image: newImage.trim() });
      toast.success("Category created");
      setNewName("");
      setNewImage("");
      await reload();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Create failed");
    } finally { setBusy(false); }
  };

  const save = async () => {
    if (!editing.name.trim()) return;
    try {
      await api.put(`/admin/categories/${editing.id}`, {
        name: editing.name.trim(),
        order: parseInt(editing.order) || 0,
        image: (editing.image || "").trim()
      });
      toast.success("Category updated");
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    }
  };

  const del = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"? Products in it will need reassignment.`)) return;
    try {
      await api.delete(`/admin/categories/${c.id}`);
      toast.success("Category deleted");
      await reload();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div data-testid="categories-tab">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-[#1C1815]">Categories</h2>
          <p className="text-xs text-[#6E685E] mt-1">Manage store categories, display order, and collection hero images.</p>
        </div>
      </div>

      <form onSubmit={create} className="border border-[#E6E0D6] bg-white p-6 mb-6 space-y-4" data-testid="new-category-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Category Name</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Calligraphy Sets"
              className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]"
              data-testid="new-category-name"
            />
          </label>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] block mb-2">Category Image (Upload or URL)</span>
            <div className="flex items-center gap-2">
              <input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="https://... or upload photo"
                className="flex-1 bg-transparent border-b border-[#E6E0D6] py-2 outline-none focus:border-[#3D4838] text-xs"
              />
              <label className="bg-[#FAF8F5] border border-[#E6E0D6] text-[#1C1815] px-3 py-2 text-xs uppercase tracking-[0.1em] hover:bg-[#F3EFEA] cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                <Upload size={12}/> {uploading ? "..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], false)} disabled={uploading}/>
              </label>
            </div>
          </div>
        </div>

        {newImage && (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-16 h-16 rounded border border-[#E6E0D6] overflow-hidden bg-[#FAF8F5]">
              <img src={fileUrl(newImage)} alt="Preview" className="w-full h-full object-cover"/>
            </div>
            <button type="button" onClick={() => setNewImage("")} className="text-xs text-red-600 hover:underline">Remove image</button>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={busy || !newName.trim()}
            className="bg-[#1C1815] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] disabled:bg-[#6E685E] inline-flex items-center gap-2 transition-colors"
            data-testid="create-category-btn"
          >
            <Plus size={14}/> Add category
          </button>
        </div>
      </form>

      {cats.length === 0 ? (
        <p className="text-[#6E685E]" data-testid="no-categories">No categories yet.</p>
      ) : (
        <ul className="border border-[#E6E0D6] bg-white divide-y divide-[#E6E0D6]" data-testid="categories-list">
          {cats.map((c) => (
            <li key={c.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4" data-testid={`category-row-${c.id}`}>
              {editing?.id === c.id ? (
                <div className="flex-1 flex flex-col md:flex-row flex-wrap items-start md:items-center gap-3">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({...editing, name: e.target.value})}
                    placeholder="Category name"
                    className="flex-1 min-w-[160px] bg-transparent border-b border-[#3D4838] py-2 outline-none font-serif text-lg"
                    data-testid={`edit-cat-name-${c.id}`}
                  />
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">
                    Order
                    <input
                      type="number"
                      value={editing.order}
                      onChange={(e) => setEditing({...editing, order: e.target.value})}
                      className="w-16 bg-transparent border-b border-[#E6E0D6] py-1 outline-none text-[#1C1815]"
                      data-testid={`edit-cat-order-${c.id}`}
                    />
                  </label>
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <input
                      value={editing.image || ""}
                      onChange={(e) => setEditing({...editing, image: e.target.value})}
                      placeholder="Image URL"
                      className="flex-1 bg-transparent border-b border-[#E6E0D6] py-1 text-xs outline-none"
                    />
                    <label className="p-1.5 border border-[#E6E0D6] hover:bg-[#FAF8F5] cursor-pointer" title="Upload Image">
                      <Upload size={13}/>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], true)}/>
                    </label>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={save} className="text-xs uppercase tracking-[0.15em] bg-[#1C1815] text-[#FAF8F5] px-4 py-2 hover:bg-[#3D4838]" data-testid={`save-cat-${c.id}`}>Save</button>
                    <button onClick={() => setEditing(null)} className="text-xs uppercase tracking-[0.15em] border border-[#E6E0D6] px-4 py-2 hover:border-[#3D4838]" data-testid={`cancel-cat-${c.id}`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-sm border border-[#E6E0D6] bg-[#F3EFEA] overflow-hidden shrink-0 flex items-center justify-center">
                      {c.image ? (
                        <img src={fileUrl(c.image)} alt={c.name} className="w-full h-full object-cover"/>
                      ) : (
                        <Tag size={18} className="text-[#B8860B]"/>
                      )}
                    </div>
                    <div>
                      <p className="font-serif text-lg text-[#1C1815]" data-testid={`cat-name-${c.id}`}>{c.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Order · {c.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditing({ id: c.id, name: c.name, order: c.order, image: c.image || "" })} className="p-2 hover:bg-[#F3EFEA]" data-testid={`edit-cat-${c.id}`}><Edit3 size={14}/></button>
                    <button onClick={() => del(c)} className="p-2 hover:bg-[#F3EFEA] text-red-700" data-testid={`delete-cat-${c.id}`}><Trash2 size={14}/></button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StudioTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | post

  const load = () => {
    setLoading(true);
    api.get("/studio-posts", { params: { limit: 100 } }).then((r) => setPosts(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id) => {
    if (!window.confirm("Delete this studio post?")) return;
    await api.delete(`/admin/studio-posts/${id}`);
    toast.success("Post removed");
    load();
  };

  return (
    <div data-testid="studio-tab">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-[#1C1815]">Studio feed</h2>
          <p className="text-xs text-[#6E685E] mt-1">6 most recent tiles are shown on the home page under "From the studio".</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838]" data-testid="add-studio-btn">
          <Plus size={14}/> New tile
        </button>
      </div>
      {loading ? (
        <p className="text-[#6E685E]">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-[#E6E0D6] p-16 text-center" data-testid="no-studio-posts">
          <Instagram size={26} className="mx-auto text-[#B8860B]"/>
          <p className="mt-4 font-serif italic text-xl text-[#6E685E]">No tiles yet — add the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="studio-posts-grid">
          {posts.map((p) => (
            <div key={p.id} className="group relative aspect-square bg-[#F3EFEA] overflow-hidden" data-testid={`studio-row-${p.id}`}>
              <img src={fileUrl(p.image)} alt="" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-[#1C1815]/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1">
                  <button onClick={() => setEditing(p)} className="bg-[#FAF8F5] text-[#1C1815] w-8 h-8 grid place-items-center" data-testid={`edit-studio-${p.id}`}><Edit3 size={14}/></button>
                  <button onClick={() => del(p.id)} className="bg-[#1C1815] text-[#FAF8F5] w-8 h-8 grid place-items-center" data-testid={`delete-studio-${p.id}`}><Trash2 size={14}/></button>
                </div>
                <p className="text-[#FAF8F5] font-serif italic text-sm line-clamp-2">{p.caption || "—"}</p>
              </div>
              <span className="absolute top-2 left-2 bg-[#FAF8F5]/90 backdrop-blur text-[10px] uppercase tracking-[0.15em] px-2 py-0.5" data-testid={`studio-order-${p.id}`}>#{p.order}</span>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <StudioForm
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          fallbackOrder={posts.length}
        />
      )}
    </div>
  );
}

function StudioForm({ post, onClose, onSaved, fallbackOrder }) {
  const [form, setForm] = useState(post || { image: "", caption: "", link: "", order: fallbackOrder });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm({ ...form, [k]: v });

  const upload = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      set("image", r.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.image) { toast.error("Please upload an image first"); return; }
    setSaving(true);
    const payload = { image: form.image, caption: form.caption || "", link: form.link || null, order: parseInt(form.order) || 0 };
    try {
      if (post) await api.put(`/admin/studio-posts/${post.id}`, payload);
      else await api.post("/admin/studio-posts", payload);
      toast.success(post ? "Tile updated" : "Tile added");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4 bg-[#1C1815]/50" onClick={onClose}>
      <div className="bg-[#FAF8F5] w-full max-w-xl p-6 lg:p-10" onClick={(e) => e.stopPropagation()} data-testid="studio-form-modal">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">{post ? "EDIT" : "NEW"}</p>
            <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Studio tile</h2>
          </div>
          <button onClick={onClose} data-testid="close-studio-form"><X size={22}/></button>
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Image</span>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-[#F3EFEA]" data-testid="sf-image-preview">
                {form.image && <img src={fileUrl(form.image)} alt="" className="w-full h-full object-cover"/>}
              </div>
              <label className="aspect-square border border-dashed border-[#3D4838] flex flex-col items-center justify-center text-[#3D4838] cursor-pointer hover:bg-[#F3EFEA]" data-testid="sf-upload">
                <Upload size={20}/>
                <span className="text-[10px] uppercase tracking-[0.15em] mt-2">{uploading ? "Uploading…" : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}/>
              </label>
            </div>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Caption (optional)</span>
            <input value={form.caption || ""} onChange={(e) => set("caption", e.target.value)} maxLength={280} placeholder="New nibs, Turin edition · 001–012" className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="sf-caption"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Instagram permalink (optional)</span>
            <input value={form.link || ""} onChange={(e) => set("link", e.target.value)} placeholder="https://instagram.com/p/..." className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="sf-link"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Order (lower = shown first)</span>
            <input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="mt-2 w-32 bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="sf-order"/>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E6E0D6]">
            <button onClick={onClose} className="px-5 py-3 text-xs uppercase tracking-[0.2em] border border-[#E6E0D6] hover:border-[#3D4838]" data-testid="sf-cancel">Cancel</button>
            <button onClick={save} disabled={saving || !form.image} className="px-6 py-3 text-xs uppercase tracking-[0.2em] bg-[#1C1815] text-[#FAF8F5] hover:bg-[#3D4838] disabled:bg-[#6E685E]" data-testid="sf-save">
              {saving ? "Saving…" : "Save tile"}
            </button>
          </div>
        </div>
      </div>
    </div>
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
      await api.patch(`/admin/orders/${id}`, patch);
      toast.success("Order updated");
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
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium rounded border ${
                o.payment_status === "paid" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300" 
                  : o.payment_status === "pending_whatsapp" 
                  ? "bg-amber-50 text-amber-800 border-amber-300" 
                  : "bg-stone-50 text-stone-700 border-stone-300"
              }`} data-testid={`order-payment-status-badge-${o.id}`}>
                {o.payment_status?.replace(/_/g, " ")}
              </span>
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium rounded border ${
                (o.shipment?.status || o.order_status) === "delivered" 
                  ? "bg-blue-50 text-blue-800 border-blue-300" 
                  : (o.shipment?.status || o.order_status) === "shipped" 
                  ? "bg-indigo-50 text-indigo-800 border-indigo-300" 
                  : "bg-stone-50 text-stone-600 border-stone-200"
              }`} data-testid={`order-shipment-status-badge-${o.id}`}>
                Ship: {o.shipment?.status || o.order_status || "pending"}
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
                  {o.items.map((it, i) => (
                    <li key={i}>
                      {it.quantity}× {it.name} · {money(it.unit_price)}
                      {it.engraving && <span className="text-[#B8860B] italic"> · engraved "{it.engraving}"</span>}
                    </li>
                  ))}
                </ul>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mt-4 mb-2">Ship to</h4>
                <p className="text-sm text-[#1C1815]">
                  {o.shipping?.full_name}<br/>
                  {o.shipping?.line1}{o.shipping?.line2 ? `, ${o.shipping.line2}` : ""}<br/>
                  {o.shipping?.city}, {o.shipping?.state} {o.shipping?.postal_code}<br/>
                  {o.shipping?.country} · {o.shipping?.phone}
                </p>
                {o.shipping?.phone && (
                  <div className="mt-3">
                    <a
                      href={`https://wa.me/${o.shipping.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${o.shipping.full_name || ""}, this is TWL Pens regarding your order #${o.id} (${money(o.total)}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C1815] hover:text-[#3D4838] underline"
                    >
                      💬 Contact Customer on WhatsApp
                    </a>
                  </div>
                )}
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
    payment_status: order.payment_status || "pending_whatsapp",
    shipment_status: order.shipment?.status || "pending",
    tracking_number: order.shipment?.tracking_number || "",
    carrier: order.shipment?.carrier || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(order.id, {
        payment_status: f.payment_status,
        shipment_status: f.shipment_status,
        tracking_number: f.tracking_number,
        carrier: f.carrier,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Manage Status & Shipment</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Payment Status</span>
            <select
              value={f.payment_status}
              onChange={(e) => setF({...f, payment_status: e.target.value})}
              className="mt-1 w-full bg-white border border-[#E6E0D6] px-2.5 py-1.5 text-sm outline-none focus:border-[#3D4838]"
              data-testid={`payment-status-${order.id}`}
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Shipment Status</span>
            <select
              value={f.shipment_status}
              onChange={(e) => setF({...f, shipment_status: e.target.value})}
              className="mt-1 w-full bg-white border border-[#E6E0D6] px-2.5 py-1.5 text-sm outline-none focus:border-[#3D4838]"
              data-testid={`shipment-status-${order.id}`}
            >
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Carrier</span>
            <input
              value={f.carrier}
              onChange={(e) => setF({...f, carrier: e.target.value})}
              placeholder="DHL, FedEx, BlueDart…"
              className="mt-1 w-full bg-white border border-[#E6E0D6] px-2.5 py-1.5 text-sm outline-none focus:border-[#3D4838]"
              data-testid={`shipment-carrier-${order.id}`}
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Tracking #</span>
            <input
              value={f.tracking_number}
              onChange={(e) => setF({...f, tracking_number: e.target.value})}
              placeholder="e.g. TRK123456789"
              className="mt-1 w-full bg-white border border-[#E6E0D6] px-2.5 py-1.5 text-sm outline-none focus:border-[#3D4838]"
              data-testid={`shipment-tracking-${order.id}`}
            />
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors disabled:opacity-50"
          data-testid={`save-shipment-${order.id}`}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

const DEFAULT_HERO_SLIDES = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    eyebrow: "PANCHKULA ATELIER · SS/26",
    title: "The Eternal Quill",
    subtitle: "Discover the art of handcrafted writing instruments, engineered for generations of prose.",
    cta_text: "Shop Now",
    cta_link: "/shop",
    secondary_cta_text: "New Arrivals",
    secondary_cta_link: "/new-arrivals",
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1583195764036-5d2c7b0b5e3f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    eyebrow: "HAND-TUNED NIBS & ENGRAVING",
    title: "Bespoke Personalization",
    subtitle: "Complimentary hand-etched initials, custom nib tuning, and cotton presentation pouch with every fine pen.",
    cta_text: "Fountain Pens",
    cta_link: "/shop?category=Fountain%20Pens",
    secondary_cta_text: "Studio Services",
    secondary_cta_link: "/contact",
  },
  {
    id: "slide-3",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
    eyebrow: "ARCHIVAL PIGMENTS & SHIMMER",
    title: "Rich Inks of the Season",
    subtitle: "From shimmering sheen to waterproof archival formulations, curated from master ink houses worldwide.",
    cta_text: "Explore Inks",
    cta_link: "/shop?category=Inks",
    secondary_cta_text: "Best Sellers",
    secondary_cta_link: "/best-sellers",
  },
];

function BannerTab() {
  const [banner, setBanner] = useState({
    image: "",
    eyebrow: "THE WL PENS · SS/26 ARRIVALS",
    title: "The quiet art of writing well.",
    subtitle: "The WL Pens — a small studio of writing instruments in the shadow of the Shivaliks. Hand-selected pens and inks, engraved to order, delivered in cotton pouches.",
    cta_text: "Enter the atelier",
    cta_link: "/shop",
    secondary_cta_text: "New Arrivals",
    secondary_cta_link: "/new-arrivals",
    enabled: true,
    slides: DEFAULT_HERO_SLIDES,

    categories_eyebrow: "01 / CURATED COLLECTIONS",
    categories_title: "Shop by category.",
    categories_subtitle: "Explore fine pens, rich pigment inks, and handcrafted accessories engineered for effortless writing.",

    bestsellers_eyebrow: "02 / BEST SELLERS",
    bestsellers_title: "Hallmark editions.",
    bestsellers_subtitle: "Our most coveted writing instruments, beloved by connoisseurs.",

    studio_eyebrow: "03 / FROM THE STUDIO",
    studio_title: "Live from the desk.",
    studio_subtitle: "Fresh nib videos, first inks of the season, and bespoke commissions — straight from our Panchkula atelier.",

    featured_cats: [
      { label: "Fine Fountain Pens", sub: "From beginner-friendly to collector-grade nibs.", query: "Fountain Pens", image: "", bg: "#1C1815", accent: "#B8860B" },
      { label: "Premium Inks", sub: "Shimmering, sheening, and waterproof pigments.", query: "Inks", image: "", bg: "#3D4838", accent: "#FAF8F5" },
      { label: "Accessories", sub: "Notebooks, cases, converters and care kits.", query: "Accessories", image: "", bg: "#DED6CC", accent: "#1C1815" },
    ],
    brands: [
      { name: "Pilot",  image: "", link: "/shop?brand=Pilot" },
      { name: "Namiki", image: "", link: "/shop?brand=Namiki" },
      { name: "Sailor", image: "", link: "/shop?brand=Sailor" },
      { name: "Lamy",   image: "", link: "/shop?brand=Lamy" },
    ],
    contact_inquiry_types: [
      "General Studio Inquiry",
      "Bespoke Nib Tuning & Engraving",
      "Corporate & Wedding Gifting",
      "Order Status & Dispatch",
      "Private Studio Consultation (Panchkula)",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCat, setUploadingCat] = useState(null); // index of cat being uploaded
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [uploadingSlide, setUploadingSlide] = useState(null);

  useEffect(() => {
    api.get("/site/banner")
      .then((r) => {
        if (r.data) {
          setBanner((prev) => ({
            ...prev,
            ...r.data,
            contact_inquiry_types: (Array.isArray(r.data.contact_inquiry_types) && r.data.contact_inquiry_types.length > 0)
              ? r.data.contact_inquiry_types
              : prev.contact_inquiry_types,
            slides: (Array.isArray(r.data.slides) && r.data.slides.length > 0)
              ? r.data.slides
              : (r.data.image ? [{
                  id: "slide-1",
                  image: r.data.image,
                  eyebrow: r.data.eyebrow || "PANCHKULA ATELIER · SS/26",
                  title: r.data.title || "The Eternal Quill",
                  subtitle: r.data.subtitle || "",
                  cta_text: r.data.cta_text || "Shop Now",
                  cta_link: r.data.cta_link || "/shop",
                  secondary_cta_text: r.data.secondary_cta_text || "New Arrivals",
                  secondary_cta_link: r.data.secondary_cta_link || "/new-arrivals",
                }] : DEFAULT_HERO_SLIDES),
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const currentSlides = banner.slides && banner.slides.length > 0 ? banner.slides : DEFAULT_HERO_SLIDES;
  const safeActiveSlideIdx = Math.min(activeSlideIdx, currentSlides.length - 1);
  const currentSlide = currentSlides[safeActiveSlideIdx] || currentSlides[0];

  const uploadSlideImage = async (file, idx) => {
    setUploadingSlide(idx);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setBanner((prev) => {
        const slides = [...(prev.slides || DEFAULT_HERO_SLIDES)];
        slides[idx] = { ...slides[idx], image: r.data.url };
        return { ...prev, slides };
      });
      toast.success(`Slide ${idx + 1} image uploaded`);
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingSlide(null);
    }
  };

  const updateSlide = (idx, field, value) => {
    setBanner((prev) => {
      const slides = [...(prev.slides || DEFAULT_HERO_SLIDES)];
      slides[idx] = { ...slides[idx], [field]: value };
      return { ...prev, slides };
    });
  };

  const addSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
      eyebrow: "PANCHKULA ATELIER · NEW",
      title: "Handcrafted Luxury",
      subtitle: "Bespoke writing instruments crafted for precision, balance, and lifelong elegance.",
      cta_text: "Explore Now",
      cta_link: "/shop",
      secondary_cta_text: "Custom Engraving",
      secondary_cta_link: "/contact",
    };
    setBanner((prev) => {
      const slides = [...(prev.slides || DEFAULT_HERO_SLIDES), newSlide];
      setActiveSlideIdx(slides.length - 1);
      return { ...prev, slides };
    });
    toast.success("New hero slide added");
  };

  const removeSlide = (idx) => {
    if (currentSlides.length <= 1) {
      toast.error("At least one hero slide is required");
      return;
    }
    setBanner((prev) => {
      const slides = (prev.slides || DEFAULT_HERO_SLIDES).filter((_, i) => i !== idx);
      setActiveSlideIdx((prevIdx) => Math.max(0, Math.min(prevIdx, slides.length - 1)));
      return { ...prev, slides };
    });
    toast.success("Slide removed");
  };

  const moveSlide = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= currentSlides.length) return;
    setBanner((prev) => {
      const slides = [...(prev.slides || DEFAULT_HERO_SLIDES)];
      const temp = slides[idx];
      slides[idx] = slides[targetIdx];
      slides[targetIdx] = temp;
      setActiveSlideIdx(targetIdx);
      return { ...prev, slides };
    });
  };

  const uploadCatImage = async (file, idx) => {
    setUploadingCat(idx);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setBanner((prev) => {
        const cats = [...(prev.featured_cats || [])];
        cats[idx] = { ...cats[idx], image: r.data.url };
        return { ...prev, featured_cats: cats };
      });
      toast.success("Category image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingCat(null);
    }
  };

  const updateCat = (idx, field, value) => {
    setBanner((prev) => {
      const cats = [...(prev.featured_cats || [])];
      cats[idx] = { ...cats[idx], [field]: value };
      return { ...prev, featured_cats: cats };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      // Keep legacy fields in sync with slide 1 for backward compatibility
      const payload = {
        ...banner,
        slides: currentSlides,
        image: currentSlides[0]?.image || banner.image,
        eyebrow: currentSlides[0]?.eyebrow || banner.eyebrow,
        title: currentSlides[0]?.title || banner.title,
        subtitle: currentSlides[0]?.subtitle || banner.subtitle,
        cta_text: currentSlides[0]?.cta_text || banner.cta_text,
        cta_link: currentSlides[0]?.cta_link || banner.cta_link,
        secondary_cta_text: currentSlides[0]?.secondary_cta_text || banner.secondary_cta_text,
        secondary_cta_link: currentSlides[0]?.secondary_cta_link || banner.secondary_cta_link,
      };
      await api.put("/admin/banner", payload);
      toast.success("Homepage moving carousel & sections updated successfully");
    } catch (err) {
      toast.error("Save failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[#6E685E]">Loading homepage settings…</p>;

  return (
    <div className="max-w-4xl space-y-8" data-testid="admin-banner-tab">
      {/* 1. Hero Moving Carousel Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#B8860B] text-[10px] uppercase tracking-[0.25em]">
              <Sparkles size={12} />
              <span>HERO MOVING CAROUSEL</span>
            </div>
            <h2 className="font-serif text-3xl text-[#1C1815] mt-1">Hero Carousel Slides ({currentSlides.length})</h2>
            <p className="text-sm text-[#6E685E] mt-1">
              Manage the rotating auto-play slides on your homepage. Each slide has its own image, title, and actions.
            </p>
          </div>
          <button
            type="button"
            onClick={addSlide}
            className="inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-4 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#3D4838] transition-colors"
          >
            <Plus size={14} /> Add New Slide
          </button>
        </div>

        {/* Slide Selection Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6E0D6]">
          {currentSlides.map((slide, idx) => (
            <button
              key={slide.id || idx}
              type="button"
              onClick={() => setActiveSlideIdx(idx)}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-all whitespace-nowrap ${
                idx === safeActiveSlideIdx
                  ? "border-[#1C1815] bg-[#1C1815] text-[#FAF8F5] shadow-sm"
                  : "border-[#E6E0D6] bg-[#FAF8F5] text-[#6E685E] hover:border-[#3D4838]"
              }`}
            >
              <Layers size={13} />
              <span>Slide {idx + 1}: {slide.title ? (slide.title.length > 18 ? slide.title.slice(0, 18) + "…" : slide.title) : "Untitled"}</span>
            </button>
          ))}
        </div>

        {/* Active Slide Editor Form */}
        {currentSlide && (
          <div className="p-6 bg-[#FAF8F5] border border-[#E6E0D6] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E0D6] pb-4">
              <span className="font-serif text-xl text-[#1C1815]">
                Editing Slide #{safeActiveSlideIdx + 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safeActiveSlideIdx === 0}
                  onClick={() => moveSlide(safeActiveSlideIdx, -1)}
                  className="p-1.5 border border-[#E6E0D6] bg-white text-[#1C1815] disabled:opacity-30 hover:border-[#1C1815] transition-colors"
                  title="Move slide left / earlier"
                >
                  <ArrowUp size={14} className="-rotate-90" />
                </button>
                <button
                  type="button"
                  disabled={safeActiveSlideIdx === currentSlides.length - 1}
                  onClick={() => moveSlide(safeActiveSlideIdx, 1)}
                  className="p-1.5 border border-[#E6E0D6] bg-white text-[#1C1815] disabled:opacity-30 hover:border-[#1C1815] transition-colors"
                  title="Move slide right / later"
                >
                  <ArrowDown size={14} className="-rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(safeActiveSlideIdx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 transition-colors uppercase tracking-[0.1em]"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Slide Image Upload / URL */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] block mb-2 font-medium">
                  Slide Image
                </span>
                <div className="aspect-[16/9] bg-[#F3EFEA] border border-[#E6E0D6] overflow-hidden relative group flex items-center justify-center">
                  {currentSlide.image ? (
                    <img
                      src={fileUrl(currentSlide.image)}
                      alt="Slide preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon size={28} className="mx-auto text-[#6E685E]/50 mb-1" />
                      <span className="text-xs text-[#6E685E] uppercase tracking-[0.15em]">
                        No slide image
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="bg-[#1C1815] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-[0.15em] cursor-pointer hover:bg-[#3D4838] transition-colors">
                    {uploadingSlide === safeActiveSlideIdx ? "Uploading…" : "Upload New Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadSlideImage(e.target.files[0], safeActiveSlideIdx)}
                    />
                  </label>
                  {currentSlide.image && (
                    <button
                      type="button"
                      onClick={() => updateSlide(safeActiveSlideIdx, "image", "")}
                      className="text-xs text-red-700 hover:underline uppercase tracking-[0.15em]"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
                <label className="block mt-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">
                    Or Direct Image URL
                  </span>
                  <input
                    type="text"
                    value={currentSlide.image || ""}
                    onChange={(e) => updateSlide(safeActiveSlideIdx, "image", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>
              </div>

              {/* Slide Text Content */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Eyebrow Label</span>
                  <input
                    type="text"
                    value={currentSlide.eyebrow || ""}
                    onChange={(e) => updateSlide(safeActiveSlideIdx, "eyebrow", e.target.value)}
                    placeholder="e.g. PANCHKULA ATELIER · SS/26"
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Main Headline</span>
                  <input
                    type="text"
                    value={currentSlide.title || ""}
                    onChange={(e) => updateSlide(safeActiveSlideIdx, "title", e.target.value)}
                    placeholder="e.g. The Eternal Quill"
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Subtitle / Description</span>
                  <textarea
                    rows={2}
                    value={currentSlide.subtitle || ""}
                    onChange={(e) => updateSlide(safeActiveSlideIdx, "subtitle", e.target.value)}
                    placeholder="Descriptive caption for this slide…"
                    className="mt-1 w-full bg-transparent border border-[#E6E0D6] p-2 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Primary Button Text</span>
                    <input
                      type="text"
                      value={currentSlide.cta_text || ""}
                      onChange={(e) => updateSlide(safeActiveSlideIdx, "cta_text", e.target.value)}
                      placeholder="Shop Now"
                      className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Primary Button Link</span>
                    <input
                      type="text"
                      value={currentSlide.cta_link || ""}
                      onChange={(e) => updateSlide(safeActiveSlideIdx, "cta_link", e.target.value)}
                      placeholder="/shop"
                      className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Secondary Button Text</span>
                    <input
                      type="text"
                      value={currentSlide.secondary_cta_text || ""}
                      onChange={(e) => updateSlide(safeActiveSlideIdx, "secondary_cta_text", e.target.value)}
                      placeholder="New Arrivals"
                      className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Secondary Button Link</span>
                    <input
                      type="text"
                      value={currentSlide.secondary_cta_link || ""}
                      onChange={(e) => updateSlide(safeActiveSlideIdx, "secondary_cta_link", e.target.value)}
                      placeholder="/new-arrivals"
                      className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Section 01: Categories Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">SECTION 01</p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Shop by Category Header</h2>
          <p className="text-sm text-[#6E685E] mt-1">Customize the title, subtitle, and eyebrow shown above the category cards strip on the homepage.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6E0D6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Eyebrow</span>
              <input
                type="text"
                value={banner.categories_eyebrow ?? "01 / CURATED COLLECTIONS"}
                onChange={(e) => setBanner((prev) => ({ ...prev, categories_eyebrow: e.target.value }))}
                placeholder="01 / CURATED COLLECTIONS"
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Main Heading</span>
              <input
                type="text"
                value={banner.categories_title ?? "Shop by category."}
                onChange={(e) => setBanner((prev) => ({ ...prev, categories_title: e.target.value }))}
                placeholder="Shop by category."
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Subtitle / Description</span>
            <textarea
              rows={2}
              value={banner.categories_subtitle ?? "Explore fine pens, rich pigment inks, and handcrafted accessories engineered for effortless writing."}
              onChange={(e) => setBanner((prev) => ({ ...prev, categories_subtitle: e.target.value }))}
              placeholder="Explore fine pens, rich pigment inks..."
              className="mt-1 w-full bg-transparent border border-[#E6E0D6] p-2.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>
        </div>
      </div>

      {/* 3. Section 02: Best Sellers Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">SECTION 02</p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Best Sellers Header</h2>
          <p className="text-sm text-[#6E685E] mt-1">Customize the title, subtitle, and eyebrow shown above the best sellers product grid on the homepage.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6E0D6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Eyebrow</span>
              <input
                type="text"
                value={banner.bestsellers_eyebrow ?? "02 / BEST SELLERS"}
                onChange={(e) => setBanner((prev) => ({ ...prev, bestsellers_eyebrow: e.target.value }))}
                placeholder="02 / BEST SELLERS"
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Main Heading</span>
              <input
                type="text"
                value={banner.bestsellers_title ?? "Hallmark editions."}
                onChange={(e) => setBanner((prev) => ({ ...prev, bestsellers_title: e.target.value }))}
                placeholder="Hallmark editions."
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Subtitle / Description</span>
            <textarea
              rows={2}
              value={banner.bestsellers_subtitle ?? "Our most coveted writing instruments, beloved by connoisseurs."}
              onChange={(e) => setBanner((prev) => ({ ...prev, bestsellers_subtitle: e.target.value }))}
              placeholder="Our most coveted writing instruments, beloved by connoisseurs."
              className="mt-1 w-full bg-transparent border border-[#E6E0D6] p-2.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>
        </div>
      </div>

      {/* 4. Section 03: Studio Feed Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">SECTION 03</p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Studio / Desk Feed Header</h2>
          <p className="text-sm text-[#6E685E] mt-1">Customize the title, subtitle, and eyebrow shown above the live studio photo feed on the homepage.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6E0D6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Eyebrow</span>
              <input
                type="text"
                value={banner.studio_eyebrow ?? "03 / FROM THE STUDIO"}
                onChange={(e) => setBanner((prev) => ({ ...prev, studio_eyebrow: e.target.value }))}
                placeholder="03 / FROM THE STUDIO"
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Main Heading</span>
              <input
                type="text"
                value={banner.studio_title ?? "Live from the desk."}
                onChange={(e) => setBanner((prev) => ({ ...prev, studio_title: e.target.value }))}
                placeholder="Live from the desk."
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Section Subtitle / Description</span>
            <textarea
              rows={2}
              value={banner.studio_subtitle ?? "Fresh nib videos, first inks of the season, and bespoke commissions — straight from our Panchkula atelier."}
              onChange={(e) => setBanner((prev) => ({ ...prev, studio_subtitle: e.target.value }))}
              placeholder="Fresh nib videos, first inks of the season..."
              className="mt-1 w-full bg-transparent border border-[#E6E0D6] p-2.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>
        </div>
      </div>

      {/* 5. Section 05: Featured Categories Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">SECTION 05</p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Featured Categories</h2>
          <p className="text-sm text-[#6E685E] mt-1">Edit the 3 editorial portrait banners shown in the &quot;Curated for you&quot; section. Each card has a heading, subtitle, shop link query, background colour, text colour, and image.</p>
        </div>

        <div className="space-y-8 pt-4 border-t border-[#E6E0D6]">
          {(banner.featured_cats || []).map((cat, idx) => (
            <div key={idx} className="border border-[#E6E0D6] p-6 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">Card {idx + 1}</p>

              {/* Image */}
              <div className="flex gap-6 items-start">
                <div className="w-32 h-40 bg-[#F3EFEA] border border-[#E6E0D6] overflow-hidden flex-shrink-0 relative" style={{ background: cat.bg || undefined }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover opacity-40"/>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">No image</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Image URL (or upload)</span>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={cat.image || ""}
                        onChange={(e) => updateCat(idx, "image", e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                      />
                      <label className="bg-[#1C1815] text-[#FAF8F5] px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] cursor-pointer hover:bg-[#3D4838] transition-colors whitespace-nowrap">
                        {uploadingCat === idx ? "…" : "Upload"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCatImage(e.target.files[0], idx)} disabled={uploadingCat !== null}/>
                      </label>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Background Colour</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={cat.bg || "#1C1815"} onChange={(e) => updateCat(idx, "bg", e.target.value)} className="w-8 h-8 border-0 p-0 cursor-pointer rounded"/>
                        <input type="text" value={cat.bg || ""} onChange={(e) => updateCat(idx, "bg", e.target.value)} className="flex-1 bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"/>
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Text / Accent Colour</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={cat.accent || "#B8860B"} onChange={(e) => updateCat(idx, "accent", e.target.value)} className="w-8 h-8 border-0 p-0 cursor-pointer rounded"/>
                        <input type="text" value={cat.accent || ""} onChange={(e) => updateCat(idx, "accent", e.target.value)} className="flex-1 bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"/>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Heading</span>
                  <input
                    type="text"
                    value={cat.label || ""}
                    onChange={(e) => updateCat(idx, "label", e.target.value)}
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Shop link query (category name)</span>
                  <input
                    type="text"
                    value={cat.query || ""}
                    onChange={(e) => updateCat(idx, "query", e.target.value)}
                    placeholder="e.g. Fountain Pens"
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Subtitle</span>
                <input
                  type="text"
                  value={cat.sub || ""}
                  onChange={(e) => updateCat(idx, "sub", e.target.value)}
                  className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Section 06: Exclusive Partners / Brands */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">SECTION 06</p>
          <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Exclusive Partners</h2>
          <p className="text-sm text-[#6E685E] mt-1">Manage brand logos shown in the &quot;Our writing houses&quot; section. Up to 6 brands display as a grid; 7+ automatically switches to a carousel.</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#E6E0D6]">
          {(banner.brands || []).map((brand, idx) => (
            <div key={idx} className="border border-[#E6E0D6] p-4 flex gap-4 items-start">
              {/* Logo preview */}
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E6E0D6] bg-[#F3EFEA] flex-shrink-0 flex items-center justify-center">
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover"/>
                ) : (
                  <span className="font-serif text-xl text-[#1C1815]/40">{(brand.name || "?")[0]}</span>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Brand Name</span>
                  <input
                    type="text"
                    value={brand.name || ""}
                    onChange={(e) => {
                      const b = [...(banner.brands || [])];
                      b[idx] = { ...b[idx], name: e.target.value };
                      setBanner((p) => ({ ...p, brands: b }));
                    }}
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Link (optional)</span>
                  <input
                    type="text"
                    value={brand.link || ""}
                    onChange={(e) => {
                      const b = [...(banner.brands || [])];
                      b[idx] = { ...b[idx], link: e.target.value };
                      setBanner((p) => ({ ...p, brands: b }));
                    }}
                    placeholder="/shop?brand=Pilot"
                    className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Logo Image</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={brand.image || ""}
                      onChange={(e) => {
                        const b = [...(banner.brands || [])];
                        b[idx] = { ...b[idx], image: e.target.value };
                        setBanner((p) => ({ ...p, brands: b }));
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
                    />
                    <label className="bg-[#1C1815] text-[#FAF8F5] px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] cursor-pointer hover:bg-[#3D4838] transition-colors whitespace-nowrap">
                      {uploadingCat === `brand-${idx}` ? "…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingCat !== null}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingCat(`brand-${idx}`);
                          const fd = new FormData();
                          fd.append("file", file);
                          try {
                            const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
                            const b = [...(banner.brands || [])];
                            b[idx] = { ...b[idx], image: r.data.url };
                            setBanner((p) => ({ ...p, brands: b }));
                            toast.success("Brand logo uploaded");
                          } catch (err) {
                            toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
                          } finally {
                            setUploadingCat(null);
                          }
                        }}
                      />
                    </label>
                  </div>
                </label>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => {
                  const b = [...(banner.brands || [])];
                  b.splice(idx, 1);
                  setBanner((p) => ({ ...p, brands: b }));
                }}
                className="text-red-400 hover:text-red-700 text-xs uppercase tracking-[0.15em] mt-1 flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setBanner((p) => ({
                ...p,
                brands: [...(p.brands || []), { name: "", image: "", link: "" }],
              }))
            }
            className="w-full border border-dashed border-[#3D4838] py-3 text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:bg-[#F3EFEA] transition-colors"
          >
            + Add Brand
          </button>
        </div>
      </div>

      {/* 6. Contact Form Inquiry Topics Configuration */}
      <div className="bg-white border border-[#E6E0D6] p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">CONTACT PAGE</p>
            <h2 className="font-serif text-2xl text-[#1C1815] mt-1">Contact Form Inquiry Topics</h2>
            <p className="text-sm text-[#6E685E] mt-1">
              Customize the selectable dropdown topics on the Contact Us form. Users can pick these when reaching out via Email or WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setBanner((prev) => ({
                ...prev,
                contact_inquiry_types: [
                  ...(prev.contact_inquiry_types || [
                    "General Studio Inquiry",
                    "Bespoke Nib Tuning & Engraving",
                    "Corporate & Wedding Gifting",
                    "Order Status & Dispatch",
                    "Private Studio Consultation (Panchkula)",
                  ]),
                  "New Inquiry Topic",
                ],
              }));
            }}
            className="inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-[#3D4838] transition-colors"
          >
            <Plus size={14} /> Add Topic
          </button>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#E6E0D6]">
          {(banner.contact_inquiry_types || [
            "General Studio Inquiry",
            "Bespoke Nib Tuning & Engraving",
            "Corporate & Wedding Gifting",
            "Order Status & Dispatch",
            "Private Studio Consultation (Panchkula)",
          ]).map((topic, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-[#6E685E] w-6 text-right font-medium">{idx + 1}.</span>
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  const updated = [...(banner.contact_inquiry_types || [])];
                  updated[idx] = e.target.value;
                  setBanner((prev) => ({ ...prev, contact_inquiry_types: updated }));
                }}
                placeholder="Inquiry topic name..."
                className="flex-1 bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
              <button
                type="button"
                onClick={() => {
                  const current = banner.contact_inquiry_types || [];
                  if (current.length <= 1) {
                    toast.error("At least one inquiry topic is required");
                    return;
                  }
                  const updated = current.filter((_, i) => i !== idx);
                  setBanner((prev) => ({ ...prev, contact_inquiry_types: updated }));
                }}
                className="text-red-400 hover:text-red-700 p-2 text-xs uppercase tracking-[0.1em]"
                title="Remove topic"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Sticky Bar */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#1C1815] text-[#FAF8F5] px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors disabled:opacity-50 shadow-md"
          data-testid="save-banner-btn"
        >
          {saving ? "Saving…" : "Save All Homepage & Site Changes"}
        </button>
      </div>
    </div>
  );
}
