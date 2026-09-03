import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, Share2, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, fileUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useWishlist } from "../lib/wishlist";
import { money } from "../lib/format";
import WishlistButton from "../components/WishlistButton";

export default function Wishlist() {
  const { user, ready } = useAuth();
  const { refresh } = useWishlist();
  const [products, setProducts] = useState([]);
  const [shareToken, setShareToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/wishlist").then((r) => {
      setProducts(r.data.products || []);
      setShareToken(r.data.share_token);
    }).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh, products.length]);

  if (!ready) return <div className="pt-[76px] p-12 text-center text-[#6E685E]">Loading…</div>;
  if (!user) return <Navigate to="/login" replace/>;

  const generateShare = async () => {
    try {
      const r = await api.post("/wishlist/share");
      setShareToken(r.data.share_token);
      const url = `${window.location.origin}/wishlist/shared/${r.data.share_token}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Share link copied to clipboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Can't share an empty wishlist");
    }
  };

  const copyShare = async () => {
    const url = `${window.location.origin}/wishlist/shared/${shareToken}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Link copied");
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6E0D6] pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">THE VAULT</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2">Your wishlist.</h1>
            <p className="mt-2 text-sm text-[#6E685E]">{products.length} instrument{products.length === 1 ? "" : "s"} saved</p>
          </div>
          {products.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={shareToken ? copyShare : generateShare}
                className="inline-flex items-center gap-2 border border-[#1C1815] text-[#1C1815] px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors"
                data-testid="share-wishlist-btn"
              >
                {shareToken ? <><Copy size={14}/> Copy share link</> : <><Share2 size={14}/> Get share link</>}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="mt-10 text-[#6E685E]" data-testid="wishlist-loading">Loading…</p>
        ) : products.length === 0 ? (
          <div className="mt-16 border border-dashed border-[#E6E0D6] p-16 text-center" data-testid="empty-wishlist">
            <Heart size={32} className="mx-auto text-[#B8860B]" strokeWidth={1.2}/>
            <p className="mt-6 font-serif italic text-2xl text-[#6E685E]">Nothing saved yet.</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3D4838] border-b border-[#3D4838] pb-1">
              Browse the atelier <ArrowRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10" data-testid="wishlist-grid">
            {products.map((p) => {
              const price = p.discount_price || p.price;
              return (
                <article key={p.id} className="group" data-testid={`wishlist-item-${p.id}`}>
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative aspect-[4/5] bg-[#F3EFEA] overflow-hidden">
                      {p.images?.[0] && <img src={fileUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>}
                      <div className="absolute top-3 right-3">
                        <div className="bg-[#FAF8F5]/90 backdrop-blur-sm rounded-full p-2">
                          <WishlistButton productId={p.id} testId={`wishlist-remove-${p.id}`}/>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">{p.brand}</p>
                      <h3 className="font-serif text-lg text-[#1C1815] mt-1 leading-tight">{p.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-medium text-[#1C1815]">{money(price)}</span>
                        {p.discount_price && <span className="text-sm text-[#6E685E] line-through">{money(p.price)}</span>}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
