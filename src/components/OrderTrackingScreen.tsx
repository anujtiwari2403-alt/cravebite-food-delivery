import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Phone, MessageSquare, ChefHat, Bike, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { Address, CartItem } from '../data/mockData';
import { VegBadge } from './VegBadge';

export interface ActiveOrder {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  appliedCoupon: string | null;
  placedAt: string;
  stage: 'received' | 'kitchen' | 'packed' | 'transit' | 'delivered';
}

interface OrderTrackingScreenProps {
  order: ActiveOrder;
  onAdvanceStage: () => void;
  onReorder: () => void;
}

export function OrderTrackingScreen({
  order,
  onAdvanceStage,
  onReorder,
}: OrderTrackingScreenProps) {
  const [etaMinutes, setEtaMinutes] = useState(24);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Hi there! I'm Ramesh, your delivery partner. The kitchen is packing your hot meal now. I'll handle it with extra care!",
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (order.stage === 'received') setEtaMinutes(26);
    else if (order.stage === 'kitchen') setEtaMinutes(20);
    else if (order.stage === 'packed') setEtaMinutes(15);
    else if (order.stage === 'transit') setEtaMinutes(8);
    else if (order.stage === 'delivered') setEtaMinutes(0);
  }, [order.stage]);

  const stages = [
    { key: 'received', title: 'Order Confirmed', sub: 'Kitchen accepted your request', icon: CheckCircle2 },
    { key: 'kitchen', title: 'Live Kitchen: In Prep', sub: 'Chef artisanal cooking in progress', icon: ChefHat },
    { key: 'packed', title: 'Tamper Sealed & Checked', sub: 'Insulated hot thermal box ready', icon: ShieldCheck },
    { key: 'transit', title: 'Out for Delivery', sub: 'Ramesh is on the way (EV Scooter)', icon: Bike },
    { key: 'delivered', title: 'Delivered', sub: 'Bon Appetit! Enjoy your meal', icon: CheckCircle2 },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.stage);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages((prev) => [...prev, `You: ${msg}`]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        "Ramesh: Noted! I will make sure everything is taken care of. See you shortly!",
      ]);
    }, 1000);
  };

  return (
    <div className="pt-2 pb-28 px-4 min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-md">
              Order #{order.id}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {order.stage === 'delivered' ? 'Order Delivered! 🎉' : 'Live Order Tracking'}
          </h1>
        </div>

        {/* Demo Simulator button */}
        <button
          onClick={onAdvanceStage}
          className="text-[11px] font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
          title="Simulate order progression"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Next Status</span>
        </button>
      </div>

      {/* ETA Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider">
            {order.stage === 'delivered' ? 'Status' : 'Estimated Arrival'}
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-0.5">
            {order.stage === 'delivered' ? 'Delivered' : `Arriving in ~${etaMinutes} mins`}
          </h2>
          <p className="text-[11px] text-orange-100 mt-0.5">
            Delivering to {order.address.addressLine.split(',')[0]}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
          <Clock className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Interactive Delivery Map Simulation */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-44 mb-4 border border-slate-200 shadow-xs flex flex-col justify-between p-3.5 text-white">
        {/* Stylized vector map background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-20,40 Q100,120 220,60 T420,130" stroke="#f97316" strokeWidth="6" fill="none" strokeDasharray="6 6"/>
          <path d="M50,-10 L150,180" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
          <path d="M220,-10 L300,180" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
          <circle cx="80" cy="70" r="40" fill="#38bdf8" opacity="0.1"/>
        </svg>

        {/* Map Top badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-bold bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-slate-200">
            GPS Live Telemetry
          </span>
          <span className="text-[10px] font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-md">
            Safe Speed: 24 km/h
          </span>
        </div>

        {/* Dynamic rider pin and destination pin */}
        <div className="relative z-10 flex items-center justify-around my-auto">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center text-orange-400 shadow-md">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 mt-1">Kitchen</span>
          </div>

          {/* Animated path */}
          <div className="flex-1 max-w-[120px] mx-2 relative flex items-center">
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-700"
                style={{ width: `${Math.min(100, (currentStageIndex + 1) * 20)}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg transition-all duration-700"
              style={{ left: `${Math.min(85, currentStageIndex * 25)}%` }}
            >
              <Bike className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 mt-1">Your Door</span>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Route: 100ft Rd ➔ 12th Main Indiranagar</span>
          <span className="text-orange-400 font-bold">1.8 km away</span>
        </div>
      </div>

      {/* Delivery Partner Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-slate-800 font-bold text-base overflow-hidden border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Ramesh Kumar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-slate-900">
                  Ramesh Kumar
                </h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                  ★ 4.9
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                1,420 deliveries · Vaccinated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-colors shadow-2xs"
              title="Chat with rider"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <a
              href="tel:9876543210"
              className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Call rider"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Collapsible Chat */}
        {chatOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="max-h-32 overflow-y-auto space-y-2 mb-2 p-2 bg-slate-50 rounded-xl text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    msg.startsWith('You:')
                      ? 'bg-orange-500 text-white ml-auto max-w-[85%]'
                      : 'bg-white border border-slate-200 text-slate-800 max-w-[85%]'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message delivery partner..."
                className="flex-1 text-xs p-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-3">
          Preparation Journey
        </h3>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.key} className="flex items-start gap-3 relative">
                {/* Connecting Line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -mb-4 transition-colors ${
                      idx < currentStageIndex ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isCompleted
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                {/* Text info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded-md animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stage.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary & Digital Receipt */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Order Items ({order.items.length})
          </h3>
          <span className="text-xs font-extrabold text-slate-900 tabular-nums">
            Paid: ₹{order.total}
          </span>
        </div>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.dish.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <VegBadge isVeg={item.dish.isVeg} size="sm" />
                <span className="font-semibold text-slate-800">
                  {item.dish.name}
                </span>
                <span className="text-slate-400">×{item.quantity}</span>
              </div>
              <span className="font-bold text-slate-900 tabular-nums">
                ₹{item.dish.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reorder Action */}
      <button
        onClick={onReorder}
        className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Order Another Feast</span>
      </button>
    </div>
  );
}
