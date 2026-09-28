import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import ProductCard from "./ProductCard";

export default function ProductCategoryRail({
  title = "BEST-SELLING FOUNTAIN PENS",
  eyebrow = "HALLMARK CATEGORY SPOTLIGHT",
  subtitle = "Master-crafted nibs, ergonomic brass barrels, and archival ink flows.",
  products = [],
  categoryLink = "/shop?category=Fountain%20Pens",
  className = "",
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-20 ${className}`} data-testid="product-category-rail">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2 tracking-wide uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-[#6E685E]">
              {subtitle}
            </p>
          )}
        </div>
        <Link
          to={categoryLink}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1C1815] hover:text-[#B8860B] border-b border-[#1C1815] pb-1 font-semibold self-start sm:self-auto transition-colors"
          data-testid="rail-view-all-link"
        >
          <span>Browse All</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Swipeable Carousel */}
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {products.map((p) => (
            <CarouselItem key={p.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
              <ProductCard p={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-4 mt-8">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>
    </section>
  );
}
