import { ArrowRight, Star, Zap, ShieldCheck, Flame, Plus, Check } from 'lucide-react';
import { Dish } from '../data/mockData';

interface HeroSectionProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
  onAddFeatured: (dish: Dish) => void;
  featuredDish: Dish;
  isFeaturedAdded?: boolean;
}

export function HeroSection({
  onOrderNow,
  onExploreMenu,
  onAddFeatured,
  featuredDish,
  isFeaturedAdded = false,
}: HeroSectionProps) {
  return (
    <section className="pt-3 pb-6 px-4">
      {/* Kicker badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/70 text-amber-900 text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs">
        <span role="img" aria-label="fire">🔥</span>
        <span>FRESH FOOD, HAPPY MOOD</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-2.5">
        Delicious Food, <br />
        <span className="text-orange-500">Delivered Fast.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5 max-w-lg">
        Chef-crafted artisanal meals, comforting street bites, and gourmet desserts at your doorstep in under 30 mins.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onOrderNow}
          className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>Order Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onExploreMenu}
          className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-blue-50/90 hover:bg-blue-100 text-slate-800 font-bold text-sm sm:text-base border border-blue-100/80 active:scale-95 transition-all flex items-center justify-center"
        >
          Explore Menu
        </button>
      </div>

      {/* Trust row */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/80 rounded-xl py-2 px-3 border border-slate-200/60 mb-5">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span className="text-slate-900 font-bold">4.9</span>
          <span className="text-slate-500">(15k+)</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
          <span>25-35 min</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1 text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Fresh</span>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-orange-950/10 border border-slate-200/80 group">
        {/* Main image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={featuredDish.image}
            alt={featuredDish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Top floating pill: Live Kitchen */}
          <div className="absolute top-3 left-3 bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Live Kitchen: Prep in 8m</span>
          </div>
        </div>

        {/* Bottom floating frosted card */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div className="truncate">
              <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                Chef's Signature Melt
              </h4>
              <p className="text-xs text-slate-500 truncate">
                Top trending bite today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-extrabold text-orange-600 tabular-nums">
              ₹199
            </span>
            <button
              onClick={() => onAddFeatured(featuredDish)}
              className={`p-2 rounded-xl transition-all font-bold text-xs flex items-center gap-1 active:scale-95 ${
                isFeaturedAdded
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
              }`}
              title="Add to cart"
            >
              {isFeaturedAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
