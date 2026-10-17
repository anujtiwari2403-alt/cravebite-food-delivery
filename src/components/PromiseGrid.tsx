import { Leaf, Clock, UtensilsCrossed, ShieldCheck } from 'lucide-react';

export function PromiseGrid() {
  const promises = [
    {
      id: 'fresh',
      title: '100% Fresh',
      desc: 'Farm-sourced produce and certified quality meats daily.',
      icon: Leaf,
      iconBg: 'bg-emerald-100 text-emerald-600',
      cardBg: 'bg-emerald-50/50 border-emerald-100/70',
    },
    {
      id: 'speed',
      title: '28 Min Delivery',
      desc: 'Guaranteed hot delivery or get a meal voucher automatically.',
      icon: Clock,
      iconBg: 'bg-orange-100 text-orange-600',
      cardBg: 'bg-orange-50/50 border-orange-100/70',
    },
    {
      id: 'chef',
      title: 'Chef Crafted',
      desc: 'Artisanal recipes formulated by award-winning head chefs.',
      icon: UtensilsCrossed,
      iconBg: 'bg-amber-100 text-amber-600',
      cardBg: 'bg-amber-50/50 border-amber-100/70',
    },
    {
      id: 'safe',
      title: 'Safe & Clean',
      desc: 'Tamper-evident seal packaging with contactless delivery.',
      icon: ShieldCheck,
      iconBg: 'bg-blue-100 text-blue-600',
      cardBg: 'bg-blue-50/50 border-blue-100/70',
    },
  ];

  return (
    <section className="py-4 px-4">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        The CraveBite Promise
      </h2>
      <p className="text-xs text-slate-500 mb-3.5 mt-0.5">
        Quality dining, curated for your comfort
      </p>

      <div className="grid grid-cols-2 gap-3">
        {promises.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border ${item.cardBg} flex flex-col justify-between transition-all hover:shadow-xs`}
            >
              <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center mb-2.5 shadow-2xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
