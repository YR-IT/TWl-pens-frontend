import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, ShoppingBag, Users, DollarSign, Truck, Upload, Trash2, Edit3, Plus, X, Tag, Instagram } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { money } from "../lib/format";
import { useCategories, refreshCategories } from "../lib/categories";
import { toast } from "sonner";

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
          <div className="flex gap-2 flex-wrap">
            {["dashboard", "products", "categories", "banner", "studio", "orders"].map((t) => (
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
  const cats = useCategories();
  const [form, setForm] = useState(product ? {
    ...product,
    features: product.features?.join("\n") || "",
    specs: Object.entries(product.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n"),
    images: product.images || [],
    featured: !!product.featured,
    new_arrival: product.new_arrival ?? true,
    engravable: !!product.engravable,
    engraving_max_length: product.engraving_max_length ?? 20,
  } : {
    name: "", brand: "", category: cats[0]?.name || "",
    price: "", discount_price: "",
    description: "", features: "", specs: "", images: [], stock: 10,
    featured: false, new_arrival: true,
    engravable: true, engraving_max_length: 20,
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
      engravable: !!form.engravable,
      engraving_max_length: parseInt(form.engraving_max_length) || 20,
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} data-testid="pf-featured" className="accent-[#3D4838]"/>
              Feature on homepage
            </label>
            <label className="flex items-center gap-3 text-sm text-[#1C1815] cursor-pointer">
              <input type="checkbox" checked={form.new_arrival} onChange={(e) => set("new_arrival", e.target.checked)} data-testid="pf-new-arrival" className="accent-[#3D4838]"/>
              Mark as New Arrival
            </label>
          </div>

          <div className="border-t border-[#E6E0D6] pt-5">
            <label className="flex items-center gap-3 text-sm text-[#1C1815]">
              <input type="checkbox" checked={form.engravable} onChange={(e) => set("engravable", e.target.checked)} data-testid="pf-engravable"/>
              Allow engraving on this product
            </label>
            {form.engravable && (
              <label className="block mt-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Max engraving length (1–60)</span>
                <input type="number" min="1" max="60" value={form.engraving_max_length} onChange={(e) => set("engraving_max_length", e.target.value)} className="mt-2 w-32 bg-transparent border-b border-[#E6E0D6] py-2 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="pf-engraving-max"/>
              </label>
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
  const [editing, setEditing] = useState(null); // {id, name, order}

  const reload = async () => { await refreshCategories(); };

  const create = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await api.post("/admin/categories", { name: newName.trim(), order: cats.length });
      toast.success("Category created");
      setNewName("");
      await reload();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Create failed");
    } finally { setBusy(false); }
  };

  const save = async () => {
    if (!editing.name.trim()) return;
    try {
      await api.put(`/admin/categories/${editing.id}`, { name: editing.name.trim(), order: parseInt(editing.order) || 0 });
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
        <h2 className="font-serif text-2xl text-[#1C1815]">Categories</h2>
      </div>

      <form onSubmit={create} className="border border-[#E6E0D6] bg-white p-5 flex flex-wrap items-end gap-3 mb-6" data-testid="new-category-form">
        <label className="flex-1 min-w-[200px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">New category</span>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Wooden Pens" className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="new-category-name"/>
        </label>
        <button disabled={busy || !newName.trim()} className="bg-[#1C1815] text-[#FAF8F5] px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] disabled:bg-[#6E685E] inline-flex items-center gap-2" data-testid="create-category-btn">
          <Plus size={14}/> Add category
        </button>
      </form>

      {cats.length === 0 ? (
        <p className="text-[#6E685E]" data-testid="no-categories">No categories yet.</p>
      ) : (
        <ul className="border border-[#E6E0D6] bg-white divide-y divide-[#E6E0D6]" data-testid="categories-list">
          {cats.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-4" data-testid={`category-row-${c.id}`}>
              {editing?.id === c.id ? (
                <>
                  <div className="flex-1 flex flex-wrap items-center gap-3">
                    <input value={editing.name} onChange={(e) => setEditing({...editing, name: e.target.value})} className="flex-1 min-w-[160px] bg-transparent border-b border-[#3D4838] py-2 outline-none" data-testid={`edit-cat-name-${c.id}`}/>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">
                      Order
                      <input type="number" value={editing.order} onChange={(e) => setEditing({...editing, order: e.target.value})} className="w-16 bg-transparent border-b border-[#E6E0D6] py-1 outline-none text-[#1C1815]" data-testid={`edit-cat-order-${c.id}`}/>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={save} className="text-xs uppercase tracking-[0.15em] bg-[#1C1815] text-[#FAF8F5] px-4 py-2 hover:bg-[#3D4838]" data-testid={`save-cat-${c.id}`}>Save</button>
                    <button onClick={() => setEditing(null)} className="text-xs uppercase tracking-[0.15em] border border-[#E6E0D6] px-4 py-2 hover:border-[#3D4838]" data-testid={`cancel-cat-${c.id}`}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <Tag size={14} className="text-[#B8860B]"/>
                    <div>
                      <p className="font-serif text-lg text-[#1C1815]" data-testid={`cat-name-${c.id}`}>{c.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Order · {c.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing({ id: c.id, name: c.name, order: c.order })} className="p-2 hover:bg-[#F3EFEA]" data-testid={`edit-cat-${c.id}`}><Edit3 size={14}/></button>
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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/site/banner")
      .then((r) => {
        if (r.data) setBanner((prev) => ({ ...prev, ...r.data }));
      })
      .finally(() => setLoading(false));
  }, []);

  const upload = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setBanner((prev) => ({ ...prev, image: r.data.url }));
      toast.success("Banner image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/banner", banner);
      toast.success("Homepage banner updated");
    } catch (err) {
      toast.error("Save failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[#6E685E]">Loading banner settings…</p>;

  return (
    <div className="max-w-4xl bg-white border border-[#E6E0D6] p-8 space-y-6" data-testid="admin-banner-tab">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">HERO SECTION</p>
        <h2 className="font-serif text-3xl text-[#1C1815] mt-1">Homepage Banner Configuration</h2>
        <p className="text-sm text-[#6E685E] mt-1">Manage the hero banner image, headline, subtitle, and action buttons shown on the main page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#E6E0D6]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] block mb-2 font-medium">Banner Image</span>
          <div className="aspect-[4/3] bg-[#F3EFEA] border border-[#E6E0D6] overflow-hidden relative group flex items-center justify-center">
            {banner.image ? (
              <img src={fileUrl(banner.image)} alt="Banner preview" className="w-full h-full object-cover"/>
            ) : (
              <span className="text-xs text-[#6E685E] uppercase tracking-[0.15em]">No banner image</span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="bg-[#1C1815] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-[0.15em] cursor-pointer hover:bg-[#3D4838] transition-colors">
              {uploading ? "Uploading…" : "Upload New Image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {banner.image && (
              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, image: "" }))}
                className="text-xs text-red-700 hover:underline uppercase tracking-[0.15em]"
              >
                Clear Image
              </button>
            )}
          </div>
          <label className="block mt-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Or Direct Image URL</span>
            <input
              type="text"
              value={banner.image}
              onChange={(e) => setBanner((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Eyebrow text</span>
            <input
              type="text"
              value={banner.eyebrow || ""}
              onChange={(e) => setBanner((prev) => ({ ...prev, eyebrow: e.target.value }))}
              className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Main Headline</span>
            <input
              type="text"
              value={banner.title || ""}
              onChange={(e) => setBanner((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm font-serif text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Subtitle / Description</span>
            <textarea
              rows={3}
              value={banner.subtitle || ""}
              onChange={(e) => setBanner((prev) => ({ ...prev, subtitle: e.target.value }))}
              className="mt-1 w-full bg-transparent border border-[#E6E0D6] p-2.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Primary Button Text</span>
              <input
                type="text"
                value={banner.cta_text || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, cta_text: e.target.value }))}
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Primary Button Link</span>
              <input
                type="text"
                value={banner.cta_link || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, cta_link: e.target.value }))}
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Secondary Button Text</span>
              <input
                type="text"
                value={banner.secondary_cta_text || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, secondary_cta_text: e.target.value }))}
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Secondary Button Link</span>
              <input
                type="text"
                value={banner.secondary_cta_link || ""}
                onChange={(e) => setBanner((prev) => ({ ...prev, secondary_cta_link: e.target.value }))}
                className="mt-1 w-full bg-transparent border-b border-[#E6E0D6] py-1.5 text-xs text-[#1C1815] outline-none focus:border-[#3D4838]"
              />
            </label>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs text-[#1C1815] cursor-pointer">
              <input
                type="checkbox"
                checked={banner.enabled}
                onChange={(e) => setBanner((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="accent-[#3D4838]"
              />
              <span>Enable banner on homepage</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E6E0D6] flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#1C1815] text-[#FAF8F5] px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors disabled:opacity-50"
          data-testid="save-banner-btn"
        >
          {saving ? "Saving…" : "Save Banner Changes"}
        </button>
      </div>
    </div>
  );
}
