import { Star, CheckCircle2 } from 'lucide-react';
import { REVIEWS } from '../data/mockData';

export function FoodieReviews() {
  return (
    <section className="py-4 px-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          What Foodies Say
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100 flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
          <span>4.9/5</span>
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3.5">
        Real stories from satisfied cravings
      </p>

      <div className="space-y-3">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-all"
          >
            {/* User row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {review.name}
                    </span>
                    {review.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {review.timeAgo} · {review.dishOrdered}
                  </p>
                </div>
              </div>

              {/* 5 stars */}
              <div className="flex items-center gap-0.5 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
            </div>

            {/* Review text */}
            <p className="text-xs text-slate-600 italic leading-relaxed pl-1">
              {review.reviewText}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
