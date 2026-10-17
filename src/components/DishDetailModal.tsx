import { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, Check } from 'lucide-react';
import { Dish, CartItem } from '../data/mockData';
import { VegBadge } from './VegBadge';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCartWithOptions: (cartItem: CartItem) => void;
}

export function DishDetailModal({
  dish,
  onClose,
  onAddToCartWithOptions,
}: DishDetailModalProps) {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<string>(
    dish.customizationOptions?.spiciness ? dish.customizationOptions.spiciness[0] : 'Medium'
  );
  const [notes, setNotes] = useState('');

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = dish.customizationOptions?.addons.find((a) => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const totalPrice = (dish.price + addonsTotal) * quantity;

  const handleAdd = () => {
    onAddToCartWithOptions({
      dish,
      quantity,
      selectedAddons,
      spiceLevel: selectedSpice,
      specialInstructions: notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-slate-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image header */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <VegBadge isVeg={dish.isVeg} size="md" />
          </div>
          {dish.isBestseller && (
            <div className="absolute bottom-3 left-4 bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Flame className="w-3.5 h-3.5" />
              <span>Bestseller</span>
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="p-5 flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                {dish.name}
              </h3>
              <span className="text-xl font-extrabold text-orange-600 tabular-nums">
                ₹{dish.price}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="font-bold text-slate-900">{dish.rating}</span>
                <span>({dish.reviewsCount} reviews)</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{dish.prepTime}</span>
              </div>
              {dish.calories && (
                <>
                  <span>·</span>
                  <span>{dish.calories}</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Spice level options */}
          {dish.customizationOptions?.spiciness && (
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Spice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {dish.customizationOptions.spiciness.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedSpice(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedSpice === lvl
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {dish.customizationOptions?.addons && dish.customizationOptions.addons.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Customize Add-ons
                </label>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>
              <div className="space-y-2">
                {dish.customizationOptions.addons.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-orange-500 bg-orange-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-orange-500 text-white'
                              : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-800">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special notes */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Cooking instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra crispy, less sauce, no mayo..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Sticky footer with quantity and action */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-extrabold text-slate-900 tabular-nums min-w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center justify-between active:scale-98 transition-all"
          >
            <span>Add to Cart</span>
            <span className="tabular-nums">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
