import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";

export default function WishlistShared() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/wishlist/shared/${token}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.status === 404 ? "not-found" : "error"));
  }, [token]);

  if (error === "not-found") {
    return (
      <div className="pt-[76px] max-w-2xl mx-auto px-6 py-24 text-center" data-testid="shared-not-found">
        <p className="font-serif italic text-2xl text-[#6E685E]">This wishlist has slipped into the archives.</p>
        <Link to="/shop" className="mt-4 inline-block underline text-[#3D4838]">Browse the atelier</Link>
      </div>
    );
  }
  if (!data) return <div className="pt-[76px] p-12 text-center text-[#6E685E]" data-testid="shared-loading">Loading…</div>;

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="border-b border-[#E6E0D6] pb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">A SHARED VAULT</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2" data-testid="shared-heading">
              {data.owner_name}'s <em className="text-[#3D4838]">wishlist.</em>
            </h1>
            <p className="mt-2 text-sm text-[#6E685E]">{data.count} instrument{data.count === 1 ? "" : "s"} curated with intent.</p>
          </div>
          <Heart size={28} className="text-[#B8860B]" strokeWidth={1.2}/>
        </div>

        {data.products.length === 0 ? (
          <p className="mt-16 font-serif italic text-2xl text-[#6E685E] text-center" data-testid="shared-empty">The vault is empty for now.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10" data-testid="shared-grid">
            {data.products.map((p) => {
              const price = p.discount_price || p.price;
              return (
                <Link key={p.id} to={`/product/${p.id}`} className="group" data-testid={`shared-item-${p.id}`}>
                  <div className="aspect-[4/5] bg-[#F3EFEA] overflow-hidden">
                    {p.images?.[0] && <img src={fileUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>}
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
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 border border-[#1C1815] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#1C1815] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors" data-testid="shared-browse-btn">
            Discover more <ArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
