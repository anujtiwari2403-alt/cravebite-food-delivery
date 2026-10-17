export interface Dish {
  id: string;
  name: string;
  category: 'Burgers' | 'Pizza' | 'Pasta' | 'Wraps' | 'Desserts' | 'Momos' | 'Indian';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isChefPick?: boolean;
  isUnder200?: boolean;
  description: string;
  image: string;
  prepTime: string;
  calories?: string;
  customizationOptions?: {
    addons: { id: string; name: string; price: number }[];
    spiciness?: ('Mild' | 'Medium' | 'Extra Spicy')[];
  };
}

export interface Category {
  id: string;
  name: string;
  itemsCount: number;
  image: string;
  slug: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedAddons?: string[];
  spiceLevel?: string;
  specialInstructions?: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  timeAgo: string;
  dishOrdered: string;
  rating: number;
  reviewText: string;
}

export interface Address {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  addressLine: string;
  city: string;
  landmark: string;
  isDefault: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'Burgers',
    itemsCount: 42,
    image: '/src/assets/images/hero_burger_1792231088401.jpg',
    slug: 'burgers'
  },
  {
    id: 'c2',
    name: 'Pizza',
    itemsCount: 38,
    image: '/src/assets/images/margherita_pizza_1792231088791.jpg',
    slug: 'pizza'
  },
  {
    id: 'c3',
    name: 'Pasta',
    itemsCount: 29,
    image: '/src/assets/images/alfredo_pasta_1792231089178.jpg',
    slug: 'pasta'
  },
  {
    id: 'c4',
    name: 'Wraps & Rolls',
    itemsCount: 34,
    image: '/src/assets/images/paneer_wrap_1792231089090.jpg',
    slug: 'wraps'
  },
  {
    id: 'c5',
    name: 'Desserts',
    itemsCount: 22,
    image: '/src/assets/images/lava_cake_1792231089951.jpg',
    slug: 'desserts'
  },
  {
    id: 'c6',
    name: 'Street Momos',
    itemsCount: 31,
    image: '/src/assets/images/veg_momos_1792231089749.jpg',
    slug: 'momos'
  }
];

export const DISHES: Dish[] = [
  {
    id: 'dish-1',
    name: 'Classic Cheese Burger',
    category: 'Burgers',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewsCount: '1.2k',
    isVeg: false,
    isBestseller: true,
    isChefPick: true,
    isUnder200: true,
    description: 'Double smash patty with melted sharp cheddar, caramelized onions, crisp lettuce & our top-secret house glaze on toasted brioche.',
    image: '/src/assets/images/hero_burger_1792231088401.jpg',
    prepTime: '8-12 min',
    calories: '540 kcal',
    customizationOptions: {
      addons: [
        { id: 'cheese', name: 'Extra Cheddar Slice', price: 35 },
        { id: 'bacon', name: 'Crispy Strips', price: 65 },
        { id: 'fries', name: 'Peri Peri Fries Combo', price: 89 },
        { id: 'dip', name: 'Smoked Garlic Mayo Dip', price: 29 }
      ],
      spiciness: ['Mild', 'Medium', 'Extra Spicy']
    }
  },
  {
    id: 'dish-2',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 249,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: '2.5k',
    isVeg: true,
    isBestseller: true,
    isChefPick: true,
    isUnder200: false,
    description: 'San Marzano tomato coulis, fresh buffalo mozzarella, fragrant basil leaves, extra virgin olive oil on hand-stretched wood-fired sourdough.',
    image: '/src/assets/images/margherita_pizza_1792231088791.jpg',
    prepTime: '12-15 min',
    calories: '680 kcal',
    customizationOptions: {
      addons: [
        { id: 'burst', name: 'Cheese Burst Crust', price: 79 },
        { id: 'olives', name: 'Black Olives & Jalapenos', price: 45 },
        { id: 'burrata', name: 'Truffle Burrata Core', price: 99 }
      ]
    }
  },
  {
    id: 'dish-3',
    name: 'Creamy Alfredo Pasta',
    category: 'Pasta',
    price: 229,
    originalPrice: 279,
    rating: 4.7,
    reviewsCount: '890',
    isVeg: true,
    isBestseller: true,
    isChefPick: false,
    isUnder200: false,
    description: 'Fettuccine tossed in rich garlic parmesan cream sauce, cracked Tellicherry black pepper, fresh parsley & golden herb croutons.',
    image: '/src/assets/images/alfredo_pasta_1792231089178.jpg',
    prepTime: '10-14 min',
    calories: '610 kcal',
    customizationOptions: {
      addons: [
        { id: 'mushroom', name: 'Sauteed Wild Mushrooms', price: 49 },
        { id: 'garlic-bread', name: 'Herb Garlic Bread (2 pcs)', price: 59 },
        { id: 'parm', name: 'Extra Aged Parmesan Shavings', price: 39 }
      ]
    }
  },
  {
    id: 'dish-4',
    name: 'Paneer Tikka Wrap',
    category: 'Wraps',
    price: 179,
    originalPrice: 219,
    rating: 4.9,
    reviewsCount: '1.8k',
    isVeg: true,
    isBestseller: true,
    isChefPick: true,
    isUnder200: true,
    description: 'Char-grilled spicy cottage cheese cubes, mint chutney, crispy bell peppers & marinated onions rolled in a flaky multi-grain paratha.',
    image: '/src/assets/images/paneer_wrap_1792231089090.jpg',
    prepTime: '8-10 min',
    calories: '420 kcal',
    customizationOptions: {
      addons: [
        { id: 'extra-paneer', name: 'Double Paneer Fill', price: 49 },
        { id: 'cheese-wrap', name: 'Melted Mozzarella Core', price: 35 },
        { id: 'chaat-dip', name: 'Tangy Imli Mint Chutney', price: 20 }
      ],
      spiciness: ['Mild', 'Medium', 'Extra Spicy']
    }
  },
  {
    id: 'dish-5',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 129,
    originalPrice: 169,
    rating: 4.9,
    reviewsCount: '3.1k',
    isVeg: true,
    isBestseller: true,
    isChefPick: false,
    isUnder200: true,
    description: 'Warm dark chocolate cake with a molten Belgian chocolate center, dusted with snowy sugar and served with chilled vanilla bean gelato.',
    image: '/src/assets/images/lava_cake_1792231089951.jpg',
    prepTime: '5-8 min',
    calories: '380 kcal',
    customizationOptions: {
      addons: [
        { id: 'icecream', name: 'Extra Vanilla Scoop', price: 45 },
        { id: 'fudge', name: 'Warm Hot Fudge Drizzle', price: 29 }
      ]
    }
  },
  {
    id: 'dish-6',
    name: 'Crispy Veg Momos',
    category: 'Momos',
    price: 149,
    originalPrice: 189,
    rating: 4.8,
    reviewsCount: '950',
    isVeg: true,
    isBestseller: false,
    isChefPick: false,
    isUnder200: true,
    description: 'Steamed & crisp-fried dumplings stuffed with savory garden veggies, water chestnuts, ginger-scallion blend and fiery red chili dip.',
    image: '/src/assets/images/veg_momos_1792231089749.jpg',
    prepTime: '7-11 min',
    calories: '310 kcal',
    customizationOptions: {
      addons: [
        { id: 'cheese-dip', name: 'Creamy Mayonnaise Dip', price: 25 },
        { id: 'schezwan', name: 'Fiery Himalayan Schezwan', price: 20 },
        { id: 'fried-onion', name: 'Crispy Garlic & Chives Topping', price: 15 }
      ],
      spiciness: ['Medium', 'Extra Spicy']
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timeAgo: 'Yesterday',
    dishOrdered: 'Ordered Paneer Wrap',
    rating: 5,
    reviewText: '"The Paneer Tikka Wrap is unmatched! Arrived piping hot in 22 mins with the flakiest paratha crust."'
  },
  {
    id: 'r2',
    name: 'Rahul Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timeAgo: '2 days ago',
    dishOrdered: 'Ordered Cheese Burger',
    rating: 5,
    reviewText: '"Best gourmet burger in town for ₹199. Packaging keeps everything crispy without any sogginess."'
  },
  {
    id: 'r3',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timeAgo: '3 days ago',
    dishOrdered: 'Ordered Lava Cake',
    rating: 5,
    reviewText: '"The Chocolate Lava Cake literally made my weekend. Warm molten core was pure bliss. 10/10!"'
  }
];

export const PROMISES = [
  {
    id: 'fresh',
    title: '100% Fresh',
    desc: 'Farm-sourced produce and certified quality meats daily.',
    icon: 'leaf',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100'
  },
  {
    id: 'speed',
    title: '28 Min Delivery',
    desc: 'Guaranteed hot delivery or get a meal voucher automatically.',
    icon: 'clock',
    bgColor: 'bg-orange-50/80',
    borderColor: 'border-orange-100',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-100'
  },
  {
    id: 'chef',
    title: 'Chef Crafted',
    desc: 'Artisanal recipes formulated by award-winning head chefs.',
    icon: 'utensils',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-100',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100'
  },
  {
    id: 'safety',
    title: 'Safe & Clean',
    desc: 'Tamper-evident seal packaging with contactless delivery.',
    icon: 'shield',
    bgColor: 'bg-indigo-50/80',
    borderColor: 'border-indigo-100',
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100'
  }
];

export const ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    addressLine: 'Flat 402, Sunshine Heights, 12th Main Road, Indiranagar',
    city: 'Bengaluru - 560038',
    landmark: 'Near Starbucks Coffee',
    isDefault: true
  },
  {
    id: 'addr-2',
    tag: 'Work',
    addressLine: 'WeWork Galaxy, 43 Residency Road, Shanthala Nagar',
    city: 'Bengaluru - 560025',
    landmark: 'Opposite Bangalore Club',
    isDefault: false
  }
];
