import { Heart } from "lucide-react";
import { useWishlist } from "../lib/wishlist";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function WishlistButton({ productId, size = 18, className = "", testId }) {
  const { has, toggle } = useWishlist();
  const nav = useNavigate();
  const saved = has(productId);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const r = await toggle(productId);
    if (r?.needsLogin) {
      toast.error("Sign in to save to your wishlist");
      nav("/login");
      return;
    }
    toast.success(r.added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <button
      onClick={onClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`transition-colors ${saved ? "text-[#B8860B]" : "text-[#6E685E] hover:text-[#B8860B]"} ${className}`}
      data-testid={testId || `wishlist-toggle-${productId}`}
    >
      <Heart size={size} fill={saved ? "#B8860B" : "none"} strokeWidth={1.5}/>
    </button>
  );
}
