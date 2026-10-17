import { useState, useMemo } from 'react';
import { Search, X, Star, Plus, Minus, ArrowUpDown, Filter } from 'lucide-react';
import { Dish, CartItem, CATEGORIES } from '../data/mockData';
import { VegBadge } from './VegBadge';

interface ExploreScreenProps {
  dishes: Dish[];
  cartItems: CartItem[];
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onSelectDish: (dish: Dish) => void;
  initialCategory?: string;
}

export function ExploreScreen({
  dishes,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onSelectDish,
  initialCategory,
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [under200Only, setUnder200Only] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'rating' | 'prepTime'>('popular');

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(query);
        const matchCategory = dish.category.toLowerCase().includes(query);
        const matchDesc = dish.description.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.id === selectedCategory);
        if (cat && dish.category !== cat.name && !dish.name.toLowerCase().includes(cat.name.toLowerCase())) {
          return false;
        }
      }

      // Dietary
      if (isVegOnly && !dish.isVeg) return false;

      // Price
      if (under200Only && dish.price >= 200) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'prepTime') return parseInt(a.prepTime) - parseInt(b.prepTime);
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [dishes, searchQuery, selectedCategory, isVegOnly, under200Only, sortBy]);

  const getItemQuantity = (dishId: string) => {
    const item = cartItems.find((ci) => ci.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="pt-2 pb-24 px-4 min-h-screen">
      {/* Title */}
      <div className="mb-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Explore Our Kitchen
        </h1>
        <p className="text-xs text-slate-500">
          Handcrafted artisanal recipes made to order
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3.5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search burgers, pizzas, creamy pastas, momos..."
          className="w-full bg-white rounded-2xl py-3 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200/90 focus:outline-hidden focus:border-orange-500 shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category horizontal filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2.5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary filter chips & sort */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all border ${
              isVegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>

          <button
            onClick={() => setUnder200Only(!under200Only)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all border ${
              under200Only
                ? 'bg-orange-50 border-orange-500 text-orange-800 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Under ₹200</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl py-1 pl-2 pr-6 appearance-none focus:outline-hidden"
          >
            <option value="popular">Popular</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="rating">Top Rated</option>
            <option value="prepTime">Fastest Prep</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span>Showing {filteredDishes.length} artisanal dishes</span>
        {(isVegOnly || under200Only || searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setIsVegOnly(false);
              setUnder200Only(false);
            }}
            className="text-orange-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching dishes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search query or reset your dietary filters to browse our full menu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDishes.map((dish) => {
            const qty = getItemQuantity(dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs hover:shadow-md transition-all flex gap-3 cursor-pointer group"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
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

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {dish.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span className="font-bold text-slate-800">{dish.rating}</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {dish.prepTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      ₹{dish.price}
                    </span>

                    {qty > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-2 py-1 shadow-xs"
                      >
                        <button
                          onClick={() => onUpdateQuantity(dish.id, -1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-orange-600 rounded-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold tabular-nums min-w-3 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(dish.id, 1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-orange-600 rounded-md"
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
      )}
    </div>
  );
}
