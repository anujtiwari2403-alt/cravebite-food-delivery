import { useState } from 'react';
import { User, MapPin, Award, Heart, HelpCircle, ChevronRight, Phone, Mail, Sparkles, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Address, DISHES } from '../data/mockData';

interface ProfileScreenProps {
  currentAddress: Address;
  onOpenAddressModal: () => void;
  onReorderDish: (dishId: string) => void;
}

export function ProfileScreen({
  currentAddress,
  onOpenAddressModal,
  onReorderDish,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const pastOrders = [
    {
      id: 'CB-7812',
      date: '14 Oct 2026',
      items: 'Classic Cheese Burger, Chocolate Lava Cake',
      total: 328,
      status: 'Delivered',
      dishId: 'dish-1',
    },
    {
      id: 'CB-7650',
      date: '08 Oct 2026',
      items: 'Paneer Tikka Wrap, Margherita Pizza',
      total: 428,
      status: 'Delivered',
      dishId: 'dish-4',
    },
  ];

  return (
    <div className="pt-2 pb-28 px-4 min-h-screen">
      {/* Profile Header */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative w-14 h-14 rounded-2xl ring-2 ring-orange-400 overflow-hidden shrink-0 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Ananya Iyer"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 truncate">
                Ananya Iyer
              </h1>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3" />
              <span>ananya.iyer@gmail.com</span>
            </p>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+91 98450 12345</span>
            </p>
          </div>
        </div>

        {/* Membership Tier Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-100" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider block">
                Foodie Club Tier
              </span>
              <h3 className="text-xs font-black">
                Gold Epicurean Member
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black tabular-nums block">
              450 Pts
            </span>
            <span className="text-[9px] text-amber-100">
              ₹450 credit ready
            </span>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-2xs">
          <span className="text-lg font-black text-slate-900 block tabular-nums">
            14
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Orders
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-2xs">
          <span className="text-lg font-black text-orange-600 block tabular-nums">
            ₹1,250
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Saved
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-2xs">
          <span className="text-lg font-black text-amber-500 block tabular-nums">
            4.9★
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Avg Rating
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'details'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Account & Addresses
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Past Orders
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="space-y-3">
          {/* Saved Delivery Address */}
          <div
            onClick={onOpenAddressModal}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-orange-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Default Address ({currentAddress.tag})
                </h4>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  {currentAddress.addressLine}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Preferences */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Culinary Preferences
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Diet Preference</span>
                <span className="font-bold text-slate-900">Omnivore / Flexible</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Default Spice Level</span>
                <span className="font-bold text-amber-700">Medium Warm</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Contactless Dropoff</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs cursor-pointer hover:border-orange-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Help & FAQs
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Live chat, refund status & cancellation
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {isHelpOpen && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <p>
                  <strong>How fast is delivery?</strong> All CraveBite orders are prepared in live gourmet kitchens and delivered within 28 minutes.
                </p>
                <p>
                  <strong>Can I cancel an order?</strong> You can cancel within 60 seconds of placing an order before the head chef begins prep.
                </p>
                <p>
                  <strong>Customer Care:</strong> Call 1800-CRAVE-99 (Toll Free, 24/7).
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    {order.id}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    {order.date}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {order.status}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                {order.items}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                  ₹{order.total}
                </span>
                <button
                  onClick={() => onReorderDish(order.dishId)}
                  className="px-3 py-1 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
