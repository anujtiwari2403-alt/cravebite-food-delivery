import { Home, Compass, ShoppingBag, ClipboardList, User } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'cart' | 'orders' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  cartCount: number;
  hasActiveOrder?: boolean;
}

export function BottomNav({
  activeTab,
  onChangeTab,
  cartCount,
  hasActiveOrder = false,
}: BottomNavProps) {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { id: 'cart' as NavTab, label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'orders' as NavTab, label: 'Orders', icon: ClipboardList, hasDot: hasActiveOrder },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 max-w-md mx-auto shadow-lg shadow-slate-900/5">
      <div className="flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all relative ${
                isActive
                  ? 'text-orange-500 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
                {tab.hasDot && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
