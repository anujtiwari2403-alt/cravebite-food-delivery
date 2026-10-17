import { useState } from 'react';
import { DISHES, Dish, CartItem, ADDRESSES, Address, Category } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { CategoryScroll } from './components/CategoryScroll';
import { DishList } from './components/DishList';
import { PromoBanner } from './components/PromoBanner';
import { PromiseGrid } from './components/PromiseGrid';
import { FoodieReviews } from './components/FoodieReviews';
import { FoodieClub } from './components/FoodieClub';
import { Footer } from './components/Footer';
import { DishDetailModal } from './components/DishDetailModal';
import { AddressModal } from './components/AddressModal';
import { ExploreScreen } from './components/ExploreScreen';
import { CartScreen } from './components/CartScreen';
import { OrderTrackingScreen, ActiveOrder } from './components/OrderTrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GeminiChatModal } from './components/GeminiChatModal';
import { MapsExploreModal } from './components/MapsExploreModal';
import { Smartphone, Monitor, CheckCircle, X, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [exploreCategory, setExploreCategory] = useState<string | undefined>(undefined);

  // Device view mode: 'mobile' (matches exact screenshot frame) or 'fluid'
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('mobile');

  // Address State
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<Address>(ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Modal State
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapsOpen, setIsMapsOpen] = useState(false);

  // Cart State (Initialized with 2 items to match the "2" badge in the screenshot)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      dish: DISHES[0], // Classic Cheese Burger
      quantity: 1,
      selectedAddons: ['cheese'],
    },
    {
      dish: DISHES[1], // Margherita Pizza
      quantity: 1,
      selectedAddons: [],
    },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Active Order State (for live tracking)
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Operations
  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
    showToast(`Added ${dish.name} to cart!`);
  };

  const handleAddToCartWithOptions = (customItem: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.dish.id === customItem.dish.id &&
          JSON.stringify(item.selectedAddons) === JSON.stringify(customItem.selectedAddons)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += customItem.quantity;
        return updated;
      }
      return [...prev, customItem];
    });
    showToast(`Added ${customItem.dish.name} (${customItem.quantity}x) to cart!`);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (dishId: string) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
    showToast('Item removed from cart');
  };

  const handleApplyCoupon = (code: string) => {
    if (code === 'CRAVE50' || code === 'FOODIE100' || code === 'FREESHIP') {
      setAppliedCoupon(code);
      showToast(`Coupon ${code} applied!`);
      return true;
    }
    return false;
  };

  const handlePlaceOrder = (orderDetails: any) => {
    const newOrder: ActiveOrder = {
      id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      items: orderDetails.items,
      total: orderDetails.total,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      appliedCoupon: orderDetails.appliedCoupon,
      placedAt: orderDetails.placedAt,
      stage: 'received',
    };
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setActiveTab('orders');
    showToast(`Order #${newOrder.id} confirmed! Kitchen is prepping.`);
  };

  const handleAdvanceStage = () => {
    if (!activeOrder) return;
    const stages: ActiveOrder['stage'][] = ['received', 'kitchen', 'packed', 'transit', 'delivered'];
    const currentIndex = stages.indexOf(activeOrder.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setActiveOrder({ ...activeOrder, stage: nextStage });
      showToast(`Order status updated to: ${nextStage.toUpperCase()}`);
    } else {
      setActiveOrder({ ...activeOrder, stage: 'received' });
      showToast('Simulation reset to Order Confirmed');
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isHeroBurgerAdded = cartItems.some((ci) => ci.dish.id === DISHES[0].id);

  return (
    <div className="min-h-screen bg-slate-900/90 text-slate-900 font-sans flex flex-col items-center">
      {/* Top Floating Viewport Mode Switcher */}
      <aside aria-label="View mode settings" className="w-full bg-slate-950 text-slate-300 py-1.5 px-4 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">CraveBite Live Applet</span>
          <span className="text-slate-500 hidden sm:inline">· Bengaluru Kitchen Hub</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile Screen</span>
          </button>
          <button
            onClick={() => setViewMode('fluid')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              viewMode === 'fluid'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Responsive Web</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        className={`w-full bg-white relative transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'max-w-md my-0 sm:my-4 sm:rounded-[40px] shadow-2xl overflow-hidden sm:ring-8 sm:ring-slate-800/90 sm:border-4 sm:border-slate-700'
            : 'max-w-4xl min-h-screen shadow-2xl'
        }`}
      >
        {/* Mobile Notch / Speaker Bar for high fidelity mobile preview */}
        {viewMode === 'mobile' && (
          <div className="hidden sm:flex items-center justify-center pt-2 pb-1 bg-white">
            <div className="w-24 h-4 rounded-full bg-slate-900/90 flex items-center justify-end px-2 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
            </div>
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar
          cartCount={totalCartCount}
          currentAddress={currentAddress}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          onOpenCart={() => setActiveTab('cart')}
          onOpenSearch={() => {
            setActiveTab('explore');
            setExploreCategory(undefined);
          }}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenMaps={() => setIsMapsOpen(true)}
          activeTab={activeTab}
        />

        {/* Dynamic Screen View */}
        {activeTab === 'home' && (
          <div className="divide-y divide-slate-100">
            {/* 1. Hero Section */}
            <HeroSection
              featuredDish={DISHES[0]}
              isFeaturedAdded={isHeroBurgerAdded}
              onAddFeatured={handleAddToCart}
              onOrderNow={() => {
                const el = document.getElementById('dishes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('explore');
              }}
              onExploreMenu={() => {
                setActiveTab('explore');
                setExploreCategory(undefined);
              }}
            />

            {/* 2. What Are You Craving? Category Carousel */}
            <CategoryScroll
              selectedCategoryId={exploreCategory}
              onSelectCategory={(cat: Category) => {
                setExploreCategory(cat.id);
                setActiveTab('explore');
              }}
              onViewAll={() => {
                setExploreCategory(undefined);
                setActiveTab('explore');
              }}
            />

            {/* 3. Our Most Loved Dishes with Chef Picks & Filters */}
            <DishList
              dishes={DISHES}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* 4. Weekend Fest 50% Off Promo Banner */}
            <PromoBanner
              onApplyPromo={(code) => {
                handleApplyCoupon(code);
                showToast(`Promo ${code} added to checkout!`);
              }}
              isApplied={appliedCoupon === 'CRAVE50'}
            />

            {/* AI Chef & Maps Grounding Feature Strip */}
            <div className="py-2.5 px-4">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/90 border border-orange-200/90 text-left hover:border-orange-400 transition-all flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded-md">
                      Multi-Turn
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                      Chef Gemini AI
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      Diet advice & pairings
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setIsMapsOpen(true)}
                  className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/90 border border-blue-200/90 text-left hover:border-blue-400 transition-all flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-md">
                      Google Maps
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Maps Grounding
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      Live kitchens & coverage
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. The CraveBite Promise */}
            <PromiseGrid />

            {/* 6. What Foodies Say (Reviews) */}
            <FoodieReviews />

            {/* 7. Join The Foodie Club */}
            <FoodieClub
              onCouponUnlocked={(code) => {
                handleApplyCoupon(code);
                showToast(`Code ${code} unlocked & applied!`);
              }}
            />

            {/* 8. Footer */}
            <Footer
              onOpenInfoModal={(title, content) => setInfoModal({ title, content })}
            />
          </div>
        )}

        {activeTab === 'explore' && (
          <ExploreScreen
            dishes={DISHES}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onSelectDish={(dish) => setSelectedDish(dish)}
            initialCategory={exploreCategory}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onExploreMore={() => setActiveTab('explore')}
            currentAddress={currentAddress}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => {
              setAppliedCoupon(null);
              showToast('Coupon removed');
            }}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'orders' && (
          activeOrder ? (
            <OrderTrackingScreen
              order={activeOrder}
              onAdvanceStage={handleAdvanceStage}
              onReorder={() => {
                handleAddToCart(activeOrder.items[0].dish);
                setActiveTab('cart');
              }}
            />
          ) : (
            <div className="pt-16 pb-28 px-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                No Active Orders Right Now
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                Whenever you place an order, live GPS tracking and chef updates will appear here in real-time.
              </p>
              <button
                onClick={() => {
                  // Simulate an active order from previous cart or first dish
                  const simulated: ActiveOrder = {
                    id: 'CB-8492',
                    items: [
                      { dish: DISHES[0], quantity: 1 },
                      { dish: DISHES[1], quantity: 1 },
                    ],
                    total: 448,
                    address: currentAddress,
                    paymentMethod: 'UPI',
                    appliedCoupon: 'CRAVE50',
                    placedAt: new Date().toISOString(),
                    stage: 'kitchen',
                  };
                  setActiveOrder(simulated);
                  showToast('Sample active order launched for live tracking!');
                }}
                className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                Track Sample Live Order
              </button>
            </div>
          )
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            currentAddress={currentAddress}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            onReorderDish={(dishId) => {
              const dish = DISHES.find((d) => d.id === dishId) || DISHES[0];
              handleAddToCart(dish);
              setActiveTab('cart');
            }}
          />
        )}

        {/* Global Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          cartCount={totalCartCount}
          hasActiveOrder={!!activeOrder && activeOrder.stage !== 'delivered'}
        />

        {/* Dish Customization Modal */}
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCartWithOptions={handleAddToCartWithOptions}
        />

        {/* Address Selection Modal */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          addresses={addresses}
          currentAddress={currentAddress}
          onSelectAddress={(addr) => {
            setCurrentAddress(addr);
            showToast(`Location set to ${addr.tag}`);
          }}
          onAddNewAddress={(newAddr) => {
            setAddresses((prev) => [newAddr, ...prev]);
            showToast('New address saved!');
          }}
        />

        {/* Simple Info Modal for Footer Links */}
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {infoModal.title}
                </h3>
                <button
                  onClick={() => setInfoModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {infoModal.content}
              </p>
              <button
                onClick={() => setInfoModal(null)}
                className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* Gemini AI Multi-turn Chatbot Modal */}
        <GeminiChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onAddToCart={handleAddToCart}
        />

        {/* Google Maps Grounded Kitchen Explorer Modal */}
        <MapsExploreModal
          isOpen={isMapsOpen}
          onClose={() => setIsMapsOpen(false)}
        />

        {/* Floating AI Chef & Google Maps Trigger */}
        <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40">
          <button
            onClick={() => setIsChatOpen(true)}
            aria-label="Open Chef Gemini AI Concierge"
            className="flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xl shadow-orange-950/25 border border-white/30 active:scale-95 transition-all group cursor-pointer"
          >
            <div className="relative">
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <span>Chef Gemini & Maps 📍</span>
          </button>
        </div>

        {/* Interactive Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-xs w-auto px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
