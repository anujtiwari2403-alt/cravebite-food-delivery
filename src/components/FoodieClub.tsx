import { useState } from 'react';
import { Gift, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FoodieClubProps {
  onCouponUnlocked: (code: string) => void;
}

export function FoodieClub({ onCouponUnlocked }: FoodieClubProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSubscribed(true);
    onCouponUnlocked('FOODIE100');
  };

  return (
    <section className="py-4 px-4">
      <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-100/90 shadow-xs relative overflow-hidden">
        {/* Gift icon */}
        <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3 shadow-2xs">
          <Gift className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">
          Join The Foodie Club
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Join 50,000+ food lovers. Receive secret chef recipes, weekly weekend discount codes & free dessert on your first order.
        </p>

        {isSubscribed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Welcome to the Club! 🎉</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Use code <span className="font-mono font-bold">FOODIE100</span> at checkout for ₹100 off your order!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-hidden focus:border-orange-500 shadow-2xs transition-colors"
              />
            </div>
            {error && <p className="text-[11px] text-rose-500 pl-3">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Subscribe & Get ₹100 Off</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
