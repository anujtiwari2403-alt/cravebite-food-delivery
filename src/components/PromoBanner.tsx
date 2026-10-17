import { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';

interface PromoBannerProps {
  onApplyPromo: (code: string) => void;
  isApplied?: boolean;
}

export function PromoBanner({ onApplyPromo, isApplied = false }: PromoBannerProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText('CRAVE50');
    setCopied(true);
    onApplyPromo('CRAVE50');
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedTime = `Ends in ${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m`;

  return (
    <section className="py-3 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-700 to-amber-900 text-white p-5 shadow-lg shadow-orange-950/15 border border-orange-600/30">
        {/* Subtle decorative culinary background rings */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-orange-500/10 pointer-events-none" />

        {/* Top meta row */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-xs border border-white/20">
            LIMITED TIME FEST
          </span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">{formattedTime}</span>
          </div>
        </div>

        {/* Headline & Body */}
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-1 text-white">
          50% OFF up to ₹150
        </h3>
        <p className="text-xs text-amber-100/90 leading-relaxed mb-4 max-w-xs">
          Order your weekend feast now. Valid on all orders above ₹299.
        </p>

        {/* Bottom actions row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 border border-white/25 text-xs font-mono font-bold tracking-wider transition-all active:scale-95"
            title="Click to copy coupon code"
          >
            <span>CRAVE50</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-200" />
            )}
          </button>

          <button
            onClick={() => onApplyPromo('CRAVE50')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shadow-md active:scale-95 ${
              isApplied
                ? 'bg-emerald-500 text-white'
                : 'bg-white hover:bg-amber-50 text-slate-900'
            }`}
          >
            {isApplied ? 'Deal Applied ✓' : 'Claim Deal'}
          </button>
        </div>
      </div>
    </section>
  );
}
