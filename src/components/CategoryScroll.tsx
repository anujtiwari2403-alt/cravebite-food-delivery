import { ChevronRight } from 'lucide-react';
import { CATEGORIES, Category } from '../data/mockData';

interface CategoryScrollProps {
  onSelectCategory: (category: Category) => void;
  onViewAll: () => void;
  selectedCategoryId?: string;
}

export function CategoryScroll({
  onSelectCategory,
  onViewAll,
  selectedCategoryId,
}: CategoryScrollProps) {
  return (
    <section className="py-2 px-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What Are You Craving?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore handcrafted selections
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 group tracking-wide"
        >
          <span>VIEW ALL</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center group text-center shrink-0 w-20 focus:outline-hidden"
            >
              <div
                className={`w-20 h-20 rounded-2xl overflow-hidden p-0.5 transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-orange-500 shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white border border-slate-200/80 shadow-xs group-hover:border-orange-300 group-hover:shadow-sm'
                }`}
              >
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 mt-1.5 truncate w-full group-hover:text-orange-600 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {cat.itemsCount} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
