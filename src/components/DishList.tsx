import { useState } from 'react';
import { Heart, Star, Plus, Minus } from 'lucide-react';
import { Dish, CartItem } from '../data/mockData';
import { VegBadge } from './VegBadge';

interface DishListProps {
  dishes: Dish[];
  cartItems: CartItem[];
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onSelectDish: (dish: Dish) => void;
}

type FilterType = 'all' | 'bestsellers' | 'veg' | 'under200';

export function DishList({
  dishes,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onSelectDish,
}: DishListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'dish-1': false,
    'dish-2': true,
  });

  const toggleFavorite = (e: React.MouseEvent, dishId: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const filteredDishes = dishes.filter((dish) => {
    if (activeFilter === 'bestsellers') return dish.isBestseller;
    if (activeFilter === 'veg') return dish.isVeg;
    if (activeFilter === 'under200') return dish.price < 200;
    return true;
  });

  const getItemQuantity = (dishId: string) => {
    const item = cartItems.find((ci) => ci.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="py-4 px-4" id="dishes-section">
      {/* Title & Badge */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Our Most Loved Dishes
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-orange-100/80 text-orange-800 text-[11px] font-bold tracking-wide">
          Chef Picks
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3.5">
        Voted #1 by neighborhood foodies
      </p>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === 'all'
              ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveFilter('bestsellers')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeFilter === 'bestsellers'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>🔥</span>
          <span>Bestsellers</span>
        </button>

        <button
          onClick={() => setActiveFilter('veg')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeFilter === 'veg'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>🌱</span>
          <span>Pure Veg</span>
        </button>

        <button
          onClick={() => setActiveFilter('under200')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
            activeFilter === 'under200'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>⚡</span>
          <span>Under ₹200</span>
        </button>
      </div>

      {/* Dish Cards List */}
      <div className="space-y-3">
        {filteredDishes.map((dish) => {
          const qty = getItemQuantity(dish.id);
          const isFav = !!favorites[dish.id];

          return (
            <div
              key={dish.id}
              onClick={() => onSelectDish(dish)}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-200/80 transition-all flex gap-3 cursor-pointer group"
            >
              {/* Left Thumbnail with Veg Indicator */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 left-1.5">
                  <VegBadge isVeg={dish.isVeg} size="sm" />
                </div>
              </div>

              {/* Right Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                    <button
                      onClick={(e) => toggleFavorite(e, dish.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav
                            ? 'text-rose-500 fill-rose-500'
                            : 'stroke-[1.8]'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                    <span className="font-bold text-slate-800">{dish.rating}</span>
                    <span className="text-slate-400 text-[11px]">({dish.reviewsCount})</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Add Button */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      ₹{dish.price}
                    </span>
                    {dish.originalPrice && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{dish.originalPrice}
                      </span>
                    )}
                  </div>

                  {qty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-2 py-1 shadow-xs"
                    >
                      <button
                        onClick={() => onUpdateQuantity(dish.id, -1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-orange-600 rounded-md transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold tabular-nums min-w-3 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-orange-600 rounded-md transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(dish);
                      }}
                      className="px-3.5 py-1 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-xs tracking-wide flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
