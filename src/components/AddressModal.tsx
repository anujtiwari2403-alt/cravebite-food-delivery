import { useState } from 'react';
import { X, MapPin, Check, Plus, Home, Briefcase } from 'lucide-react';
import { Address } from '../data/mockData';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  currentAddress: Address;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: (address: Address) => void;
}

export function AddressModal({
  isOpen,
  onClose,
  addresses,
  currentAddress,
  onSelectAddress,
  onAddNewAddress,
}: AddressModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTag, setNewTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newLine, setNewLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      tag: newTag,
      addressLine: newLine,
      city: 'Bengaluru - 560001',
      landmark: newLandmark || 'Near Main Gate',
      isDefault: false,
    };
    onAddNewAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    setNewLine('');
    setNewLandmark('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Select Delivery Location
            </h3>
            <p className="text-xs text-slate-500">
              Fresh food will be delivered here in ~28 mins
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAddingNew ? (
          <div className="py-4 space-y-3">
            {addresses.map((addr) => {
              const isSelected = currentAddress.id === addr.id;
              const Icon = addr.tag === 'Home' ? Home : addr.tag === 'Work' ? Briefcase : MapPin;
              return (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectAddress(addr);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {addr.tag}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-orange-600 flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5">
                      {addr.addressLine}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {addr.city} · {addr.landmark}
                    </p>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-2xl border border-dashed border-orange-300 hover:border-orange-500 text-orange-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="py-4 space-y-3">
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNewTag(tag)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    newTag === tag
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                House / Flat / Street address
              </label>
              <input
                type="text"
                required
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                placeholder="e.g. 104, Blue Ridge Apt, 4th Cross"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={newLandmark}
                onChange={(e) => setNewLandmark(e.target.value)}
                placeholder="e.g. Opposite Metro Station"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs"
              >
                Save & Deliver Here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
