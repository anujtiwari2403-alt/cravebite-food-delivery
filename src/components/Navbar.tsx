import { Search, ShoppingBag, MapPin, ChevronDown, Sparkles, Navigation } from 'lucide-react';
import { Address } from '../data/mockData';

interface NavbarProps {
  cartCount: number;
  currentAddress: Address;
  onOpenAddressModal: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  onOpenMaps: () => void;
  activeTab: string;
}

export function Navbar({
  cartCount,
  currentAddress,
  onOpenAddressModal,
  onOpenCart,
  onOpenSearch,
  onOpenProfile,
  onOpenChat,
  onOpenMaps,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/60 px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-sm shadow-orange-500/20 text-white">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" opacity="0.3"/>
              <path d="M18.06 9.42C17.65 6.34 15.08 4 12 4c-3.08 0-5.65 2.34-6.06 5.42-.54.38-.94.99-.94 1.7 0 1.16.94 2.1 2.1 2.1.28 0 .54-.06.78-.16.89 2.08 2.82 3.6 5.12 3.86v3.08h-2v2h6v-2h-2v-3.08c2.3-.26 4.23-1.78 5.12-3.86.24.1.5.16.78.16 1.16 0 2.1-.94 2.1-2.1 0-.71-.4-1.32-.94-1.7z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-sans">
            <span className="text-slate-900">Crave</span>
            <span className="text-orange-500">Bite</span>
          </span>
        </div>

        {/* Center: Address selector */}
        <button
          onClick={onOpenAddressModal}
          className="flex items-center gap-1.5 text-left py-1 px-2 rounded-lg hover:bg-orange-50/80 transition-colors max-w-[170px] sm:max-w-xs"
          title="Change delivery location"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase leading-none">
              {currentAddress.tag}
            </span>
            <span className="text-xs font-semibold text-slate-600 truncate flex items-center gap-0.5">
              <span>Deliver to {currentAddress.addressLine.split(',')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </span>
          </div>
        </button>

        {/* Right actions: Maps, Chef AI, Search, Cart, Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenMaps}
            aria-label="Nearby Kitchens on Google Maps"
            title="Google Maps Grounding"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <Navigation className="w-4 h-4 text-orange-500" />
          </button>

          <button
            onClick={onOpenChat}
            aria-label="Ask Chef Gemini"
            title="Chef Gemini AI"
            className="px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:shadow-sm active:scale-95 transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline">Chef AI</span>
          </button>

          <button
            onClick={onOpenSearch}
            aria-label="Search food"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`View cart with ${cartCount} items`}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Open profile"
            className="relative w-8 h-8 rounded-full ring-2 ring-orange-200 overflow-hidden hover:ring-orange-400 transition-all ml-1 shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Ananya Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // styled CSS fallback
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            <div className="w-full h-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
              AI
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
