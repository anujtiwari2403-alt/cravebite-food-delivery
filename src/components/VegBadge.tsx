interface VegBadgeProps {
  isVeg: boolean;
  size?: 'sm' | 'md';
}

export function VegBadge({ isVeg, size = 'sm' }: VegBadgeProps) {
  const containerSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  if (isVeg) {
    return (
      <span
        aria-label="Vegetarian"
        className={`inline-flex items-center justify-center ${containerSize} rounded-[4px] border border-emerald-600 bg-white shadow-xs shrink-0`}
      >
        <span className={`${dotSize} rounded-full bg-emerald-600`} />
      </span>
    );
  }

  return (
    <span
      aria-label="Non-Vegetarian"
      className={`inline-flex items-center justify-center ${containerSize} rounded-[4px] border border-rose-600 bg-white shadow-xs shrink-0`}
    >
      <span className={`${dotSize} rounded-full bg-rose-600`} />
    </span>
  );
}
