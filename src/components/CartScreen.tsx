import { useState } from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, Tag, Check, Sparkles, MapPin, ChevronRight, ShieldCheck, Utensils } from 'lucide-react';
import { CartItem, Address } from '../data/mockData';
import { VegBadge } from './VegBadge';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onExploreMore: () => void;
  currentAddress: Address;
  onOpenAddressModal: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onPlaceOrder: (orderDetails: any) => void;
}

export function CartScreen({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onExploreMore,
  currentAddress,
  onOpenAddressModal,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
}: CartScreenProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [noCutlery, setNoCutlery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const itemTotal = cartItems.reduce((acc, item) => {
    const addonsCost = (item.selectedAddons || []).reduce((sum, addonId) => {
      const addon = item.dish.customizationOptions?.addons.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return acc + (item.dish.price + addonsCost) * item.quantity;
  }, 0);

  const deliveryFee = itemTotal >= 299 || itemTotal === 0 ? 0 : 35;
  const packagingFee = itemTotal > 0 ? 25 : 0;
  const gst = Math.round(itemTotal * 0.05);

  let discount = 0;
  if (appliedCoupon === 'CRAVE50') {
    discount = Math.min(150, Math.round(itemTotal * 0.5));
  } else if (appliedCoupon === 'FOODIE100') {
    discount = Math.min(100, itemTotal);
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee + gst - discount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'CRAVE50' && itemTotal < 299) {
      setCouponError('CRAVE50 is valid on orders above ₹299');
      setCouponSuccess('');
      return;
    }

    const success = onApplyCoupon(code);
    if (success) {
      setCouponSuccess(`Coupon ${code} applied successfully!`);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try CRAVE50 or FOODIE100');
      setCouponSuccess('');
    }
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder({
        items: cartItems,
        total: grandTotal,
        address: currentAddress,
        paymentMethod,
        appliedCoupon,
        placedAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
    }, 1200);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-8 pb-24 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-orange-100/70 text-orange-600 flex items-center justify-center mb-4 shadow-sm">
          <ShoppingBag className="w-10 h-10 stroke-[1.7]" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
          Looks like you haven't indulged your cravings yet. Discover our chef's signature smashes, pizzas, and desserts!
        </p>
        <button
          onClick={onExploreMore}
          className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all"
        >
          Explore Delicious Menu
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-28 px-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onExploreMore}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Checkout Basket
          </h1>
          <p className="text-xs text-slate-500">
            {cartItems.length} items from CraveBite Kitchen
          </p>
        </div>
      </div>

      {/* Delivery Address Card */}
      <div
        onClick={onOpenAddressModal}
        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-3.5 flex items-center justify-between cursor-pointer hover:border-orange-300 transition-all"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase">
                Delivering to {currentAddress.tag}
              </span>
              <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-1.5 py-0.2 rounded-md">
                ~28 mins
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {currentAddress.addressLine}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <div className="divide-y divide-slate-100">
          {cartItems.map((item) => {
            const addonsCost = (item.selectedAddons || []).reduce((sum, addonId) => {
              const addon = item.dish.customizationOptions?.addons.find((a) => a.id === addonId);
              return sum + (addon ? addon.price : 0);
            }, 0);
            const itemPrice = (item.dish.price + addonsCost) * item.quantity;

            return (
              <div key={item.dish.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="mt-1">
                  <VegBadge isVeg={item.dish.isVeg} size="sm" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.dish.name}
                    </h4>
                    <span className="text-xs font-extrabold text-slate-900 tabular-nums shrink-0">
                      ₹{itemPrice}
                    </span>
                  </div>

                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      +{' '}
                      {item.selectedAddons
                        .map((id) => item.dish.customizationOptions?.addons.find((a) => a.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}

                  {item.spiceLevel && (
                    <span className="inline-block text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md font-medium mt-1">
                      Spice: {item.spiceLevel}
                    </span>
                  )}

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => onRemoveItem(item.dish.id)}
                      className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-orange-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold tabular-nums min-w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-orange-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add more button */}
        <button
          onClick={onExploreMore}
          className="w-full mt-3 pt-3 border-t border-dashed border-slate-200 text-orange-600 text-xs font-bold flex items-center justify-center gap-1 hover:text-orange-700"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add more artisanal dishes</span>
        </button>
      </div>

      {/* Green Packaging Note */}
      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-emerald-950 block">
              Green Eco-Packaging
            </span>
            <span className="text-[10px] text-emerald-800">
              Skip plastic cutlery & napkins to save trees
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={noCutlery}
          onChange={(e) => setNoCutlery(e.target.checked)}
          className="w-4 h-4 accent-emerald-600 rounded-sm cursor-pointer"
        />
      </div>

      {/* Coupons Section */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Tag className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Offers & Coupons
          </h3>
        </div>

        {appliedCoupon ? (
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-600" />
              <div>
                <span className="text-xs font-bold text-orange-900">
                  '{appliedCoupon}' Applied
                </span>
                <span className="text-[10px] text-orange-700 block">
                  You are saving ₹{discount} on this meal!
                </span>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon (e.g. CRAVE50)"
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:border-orange-500 uppercase"
              />
              <button
                onClick={() => handleApplyCoupon()}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs"
              >
                Apply
              </button>
            </div>

            {couponError && <p className="text-[11px] text-rose-500 pl-1">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] text-emerald-600 pl-1">{couponSuccess}</p>}

            {/* Quick Coupon Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleApplyCoupon('CRAVE50')}
                className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-bold border border-orange-200 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span>CRAVE50 (50% OFF)</span>
              </button>
              <button
                onClick={() => handleApplyCoupon('FOODIE100')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 flex items-center gap-1 transition-colors"
              >
                <span>FOODIE100 (Flat ₹100)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bill Summary */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-3">
          Bill Details
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Item Total</span>
            <span className="font-semibold text-slate-900 tabular-nums">₹{itemTotal}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Delivery Partner Fee</span>
              {itemTotal >= 299 && (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded-xs">
                  FREE
                </span>
              )}
            </span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Restaurant Packaging & Box</span>
            <span className="font-semibold text-slate-900 tabular-nums">₹{packagingFee}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Govt Taxes & GST (5%)</span>
            <span className="font-semibold text-slate-900 tabular-nums">₹{gst}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount ({appliedCoupon})</span>
              <span className="tabular-nums">-₹{discount}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-extrabold text-slate-900">
            <span>To Pay</span>
            <span className="text-base text-orange-600 tabular-nums">₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-6">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2.5">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'upi', label: 'UPI / QR', sub: 'Instant' },
            { id: 'card', label: 'Card', sub: 'Debit/Credit' },
            { id: 'cod', label: 'Cash', sub: 'On Delivery' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id as any)}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                paymentMethod === m.id
                  ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {m.label}
              </span>
              <span className="text-[10px] text-slate-500">{m.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Safe & Contactless Delivery Guaranteed</span>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={handleCheckout}
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 flex items-center justify-between active:scale-98 transition-all disabled:opacity-75"
      >
        <span>
          {isSubmitting ? 'Confirming with Kitchen...' : `Place Order · ₹${grandTotal}`}
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
