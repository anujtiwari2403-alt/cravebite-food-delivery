import { useState } from 'react';
import { X, MapPin, ExternalLink, Navigation, Search, Sparkles } from 'lucide-react';

interface MapsExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MapsExploreModal({ isOpen, onClose }: MapsExploreModalProps) {
  const [query, setQuery] = useState('Top artisanal cloud kitchens and bakeries near Indiranagar Bengaluru');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [mapsLinks, setMapsLinks] = useState<Array<{ title: string; uri: string; snippet?: string }>>([]);

  if (!isOpen) return null;

  const handleFetchPlaces = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/maps-explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          userLocation: {
            latitude: 12.9784,
            longitude: 77.6408,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      setResultText(data.text);
      setMapsLinks(data.mapsLinks || []);
    } catch (err: any) {
      setResultText(`Unable to retrieve Google Maps data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const predefinedZones = [
    { name: 'Indiranagar Hub', desc: '100ft Road Kitchen · 12 min avg prep', query: 'Top rated cloud kitchens and gourmet restaurants on 100 Feet Road Indiranagar Bengaluru' },
    { name: 'Koramangala Hub', desc: '5th Block Food District · 15 min avg prep', query: 'Artisanal pizza and burger restaurants in 5th Block Koramangala Bengaluru' },
    { name: 'HSR Layout Hub', desc: 'Sector 3 Kitchen · 10 min avg prep', query: 'Gourmet street food kitchens and bakeries in HSR Layout Sector 3 Bengaluru' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Live Kitchens & Google Maps Grounding
              </h3>
              <p className="text-[11px] text-orange-100">
                Powered by gemini-3.8-flash with googleMaps tool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
              Select Kitchen Hub Zone
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {predefinedZones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => {
                    setQuery(zone.query);
                    handleFetchPlaces(zone.query);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50/70 hover:bg-orange-50/50 text-left transition-all"
                >
                  <span className="text-xs font-bold text-slate-900 block">
                    {zone.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                    {zone.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food locations on Google Maps..."
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <button
              onClick={() => handleFetchPlaces(query)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs"
            >
              {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              <span>Ground Places</span>
            </button>
          </div>

          {/* Grounding Results */}
          {resultText && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-1.5 text-orange-600 font-bold text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Grounded Intelligence</span>
              </div>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {resultText}
              </p>

              {mapsLinks.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Direct Google Maps Place Links:
                  </span>
                  <div className="space-y-1.5">
                    {mapsLinks.map((place, idx) => (
                      <a
                        key={idx}
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-xs text-slate-800 hover:text-orange-600 transition-colors shadow-2xs group"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold block truncate">{place.title}</span>
                          {place.snippet && (
                            <span className="text-[10px] text-slate-500 italic truncate block">
                              {place.snippet}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
