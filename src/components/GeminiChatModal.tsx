import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, MapPin, ExternalLink, Plus, RefreshCw, ChefHat, Check } from 'lucide-react';
import { DISHES, Dish } from '../data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  mapsLinks?: Array<{
    title: string;
    uri: string;
    snippet?: string;
  }>;
  mentionedDishes?: string[];
  timestamp: string;
  usedMapsGrounding?: boolean;
  modelUsed?: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
}

export function GeminiChatModal({
  isOpen,
  onClose,
  onAddToCart,
}: GeminiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        "Hello! I'm Chef Gemini, your CraveBite culinary concierge. Ask me for personalized dish pairings, dietary recommendations, or nearby cloud kitchen locations grounded with real Google Maps data!",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [forceMaps, setForceMaps] = useState(false);
  const [addedDishIds, setAddedDishIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📍 Nearby Kitchens', text: 'Find CraveBite kitchen hubs and top food places near Indiranagar, Bengaluru using Google Maps' },
    { label: '🥗 High-Protein Picks', text: 'Which dishes on your menu have high protein and under 550 calories?' },
    { label: '🍕 Pizza Pairings', text: 'What sides and dips pair best with the Margherita Pizza?' },
    { label: '⚡ Fastest Delivery', text: 'Which dishes can the kitchen prep in under 10 minutes?' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation payload for multi-turn history
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          model: selectedModel,
          useMaps: forceMaps,
          userLocation: {
            latitude: 12.9784,
            longitude: 77.6408, // Indiranagar, Bengaluru
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || "I've reviewed your request! Let me know if you need any other dish suggestions.",
        mapsLinks: data.mapsLinks || [],
        mentionedDishes: data.mentionedDishes || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usedMapsGrounding: data.usedMapsGrounding,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Chef Gemini is momentarily occupied: ${err.message || 'Please check your connection or API key.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDish = (dishId: string) => {
    const dish = DISHES.find((d) => d.id === dishId);
    if (dish) {
      onAddToCart(dish);
      setAddedDishIds((prev) => ({ ...prev, [dishId]: true }));
      setTimeout(() => {
        setAddedDishIds((prev) => ({ ...prev, [dishId]: false }));
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
              <ChefHat className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white">Chef Gemini</h3>
                <span className="text-[10px] font-bold bg-orange-500/90 text-white px-1.5 py-0.2 rounded-md">
                  AI Concierge
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Maps Grounded · Multi-Turn</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-msg',
                    role: 'model',
                    content: "History reset! How can I delight your tastebuds today?",
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model & Grounding Controls Bar */}
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="text-[11px] font-bold text-slate-800 bg-white border border-slate-200 rounded-lg py-1 px-2 focus:outline-hidden"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General & Maps)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
            </select>
          </div>

          <button
            onClick={() => setForceMaps(!forceMaps)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              forceMaps
                ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Enable Google Maps location tool"
          >
            <MapPin className="w-3 h-3 text-orange-500" />
            <span>Maps Grounding</span>
          </button>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-orange-500 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {/* Model header tag if grounding used */}
                  {!isUser && (msg.usedMapsGrounding || (msg.mapsLinks && msg.mapsLinks.length > 0)) && (
                    <div className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Google Maps Grounded</span>
                    </div>
                  )}

                  {/* Message prose */}
                  <div className="whitespace-pre-line font-sans">
                    {msg.content}
                  </div>

                  {/* Google Maps Grounding Links Card as required */}
                  {!isUser && msg.mapsLinks && msg.mapsLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Verified Google Maps Places:
                      </span>
                      <div className="space-y-1.5">
                        {msg.mapsLinks.map((place, idx) => (
                          <a
                            key={idx}
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-colors group"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-orange-600">
                              <span className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span className="truncate">{place.title}</span>
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 shrink-0" />
                            </div>
                            {place.snippet && (
                              <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                                "{place.snippet}"
                              </p>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mentioned Dishes 1-click Add to Cart */}
                  {!isUser && msg.mentionedDishes && msg.mentionedDishes.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.mentionedDishes.map((dishId) => {
                        const dish = DISHES.find((d) => d.id === dishId);
                        if (!dish) return null;
                        const isAdded = !!addedDishIds[dishId];

                        return (
                          <button
                            key={dishId}
                            onClick={() => handleAddDish(dishId)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-500 text-white'
                                : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Add {dish.name} (₹{dish.price})</span>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isUser ? 'text-orange-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs w-36 shadow-xs animate-pulse">
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
              <span>Chef thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.text)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-200/70"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Chef Gemini (dishes, keto, maps, pairings)..."
            className="flex-1 bg-slate-50 text-xs text-slate-800 p-2.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-orange-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
