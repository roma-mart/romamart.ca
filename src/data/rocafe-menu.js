/**
 * RoCafe Menu Data
 * Comprehensive menu items with full metadata
 * 
 * Used by:
 * - App.jsx (homepage RoCafe section)
 * - pages/RoCafePage.jsx (full menu page)
 * 
 * @since December 4, 2025
 */

// Menu category constants
export const MENU_CATEGORIES = {
  HOT_COFFEE: 'hot-coffee',
  ICED_COFFEE: 'iced-coffee',
  TEA: 'tea',
  FRESH_JUICE: 'fresh-juice',
  SMOOTHIES: 'smoothies',
  FRAPPES: 'frappes',
  SPECIALTY: 'specialty',
  FOOD: 'food',
  SEASONAL: 'seasonal'
};

// Caffeine level configurations
export const CAFFEINE_LEVELS = {
  NONE: { label: 'Caffeine-Free', value: 0, color: '#6B7280' },
  LOW: { label: 'Low Caffeine', value: 1, color: '#10B981' },
  MEDIUM: { label: 'Medium Caffeine', value: 2, color: '#F59E0B' },
  HIGH: { label: 'High Caffeine', value: 3, color: '#EF4444' }
};

// Allergen configurations
export const ALLERGENS = {
  DAIRY: { label: 'Dairy', icon: '🥛' },
  NUTS: { label: 'Tree Nuts', icon: '🌰' },
  SOY: { label: 'Soy', icon: '🫘' },
  GLUTEN: { label: 'Gluten', icon: '🌾' },
  EGGS: { label: 'Eggs', icon: '🥚' }
};

// Dietary tag configurations
export const DIETARY_TAGS = {
  VEGAN: { label: 'Vegan', icon: '🌱', color: '#10B981' },
  VEGETARIAN: { label: 'Vegetarian', icon: '🥗', color: '#84CC16' },
  GLUTEN_FREE: { label: 'Gluten-Free', icon: '⚪', color: '#8B5CF6' },
  DAIRY_FREE: { label: 'Dairy-Free', icon: '🚫🥛', color: '#3B82F6' },
  HALAL: { label: 'Halal', icon: '☪️', color: '#059669' }
};

// Full menu items array
export const ROCAFE_FULL_MENU = [
  {
    id: 'signature-bubble-tea',
    name: 'Signature Bubble Tea',
    tagline: 'Our most popular boba tea with chewy tapioca pearls',
    description: 'Premium black tea infused with house-made brown sugar syrup, topped with fresh tapioca pearls. A customer favorite that perfectly balances sweetness and texture.',
    image: null, // Placeholder for future menu photography
    badge: 'bestseller',
    sizes: [
      { name: 'Regular', price: 4.99 },
      { name: 'Large', price: 5.99 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.SPECIALTY,
    
    // Customization options
    customizations: [
      { type: 'Ice Level', options: ['Regular Ice', 'Less Ice', 'No Ice'] },
      { type: 'Sugar Level', options: ['100%', '75%', '50%', '25%', 'No Sugar'] },
      { type: 'Toppings', options: ['Tapioca Pearls (included)', 'Popping Boba (+$1)', 'Jelly (+$0.75)', 'Pudding (+$1)'] }
    ],
    allergens: ['dairy'],
    dietary: ['vegetarian'],
    prepTime: '3-5 min',
    temperature: ['iced'],
    caffeineLevel: 'medium',
    flavorProfile: ['sweet', 'creamy', 'chewy'],
    
    // Nutritional info (per regular size)
    calories: '320',
    nutrition: {
      calories: 320,
      protein: 2,
      carbs: 68,
      fat: 5,
      sugar: 55,
      caffeine: 45 // mg
    },
    
    locationStatus: 'Available at all RoCafé locations',
    isAvailable: true
  },
  {
    id: 'fresh-brewed-coffee',
    name: 'Fresh Brewed Coffee',
    tagline: 'Classic drip coffee, brewed fresh every hour',
    description: 'Premium Arabica beans from ethically-sourced farms, medium roast. Bold yet smooth with notes of chocolate and caramel.',
    image: null,
    badge: null,
    sizes: [
      { name: 'Small', price: 2.00 },
      { name: 'Medium', price: 2.50 },
      { name: 'Large', price: 3.00 }
    ],
    defaultSize: 1,
    category: MENU_CATEGORIES.HOT_COFFEE,
    
    customizations: [
      { type: 'Additions', options: ['Black (no additions)', 'Cream', 'Milk', 'Sugar', 'Sweetener'] }
    ],
    allergens: [],
    dietary: ['vegan', 'gluten-free'],
    prepTime: '1 min',
    temperature: ['hot'],
    caffeineLevel: 'high',
    flavorProfile: ['bold', 'smooth', 'aromatic'],
    
    calories: '5',
    nutrition: {
      calories: 5,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
      caffeine: 95 // mg
    },
    
    locationStatus: 'Available 6 AM - 10 PM',
    isAvailable: true
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    tagline: 'Premium ceremonial-grade matcha with steamed milk',
    description: 'Authentic Japanese matcha powder whisked to perfection and combined with your choice of milk. Earthy, creamy, and energizing.',
    image: null,
    badge: 'new',
    sizes: [
      { name: 'Regular', price: 4.99 },
      { name: 'Large', price: 5.99 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.SPECIALTY,
    
    customizations: [
      { type: 'Milk Choice', options: ['Whole Milk', 'Oat Milk (+$0.50)', 'Almond Milk (+$0.50)', 'Soy Milk (+$0.50)'] },
      { type: 'Sweetness', options: ['Regular', 'Light', 'None'] },
      { type: 'Temperature', options: ['Hot', 'Iced'] }
    ],
    allergens: ['dairy', 'may contain nuts (almond milk option)'],
    dietary: ['vegetarian', 'gluten-free'],
    dairyFreeOption: true,
    prepTime: '4-6 min',
    temperature: ['hot', 'iced'],
    caffeineLevel: 'medium',
    flavorProfile: ['earthy', 'creamy', 'umami'],
    
    calories: '180',
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 24,
      fat: 6,
      sugar: 20,
      caffeine: 70 // mg
    },
    
    locationStatus: 'Available at all RoCafé locations',
    isAvailable: true
  },
  {
    id: 'mango-fruit-slush',
    name: 'Mango Fruit Slush',
    tagline: 'Refreshing tropical blend with real fruit',
    description: 'Fresh mango puree blended with ice and a hint of lime. Naturally sweet, dairy-free, and perfect for hot summer days.',
    image: null,
    badge: null,
    sizes: [
      { name: 'Regular', price: 5.50 },
      { name: 'Large', price: 6.50 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.FRESH_JUICE,
    
    customizations: [
      { type: 'Add-ons', options: ['None', 'Popping Boba (+$1)', 'Chia Seeds (+$0.50)'] }
    ],
    allergens: [],
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    dairyFreeOption: true,
    prepTime: '2-4 min',
    temperature: ['frozen'],
    caffeineLevel: 'none',
    flavorProfile: ['tropical', 'sweet', 'tangy'],
    
    calories: '210',
    nutrition: {
      calories: 210,
      protein: 1,
      carbs: 52,
      fat: 0,
      sugar: 45,
      caffeine: 0
    },
    
    locationStatus: 'Seasonal - Available Spring/Summer',
    isAvailable: true
  }
];

// Featured items for homepage (4 items currently displayed)
export const ROCAFE_FEATURED = ROCAFE_FULL_MENU.filter(item => 
  ['signature-bubble-tea', 'fresh-brewed-coffee', 'matcha-latte', 'mango-fruit-slush'].includes(item.id)
);

// Helper function to get items by category
export const getItemsByCategory = (categoryId) => {
  return ROCAFE_FULL_MENU.filter(item => item.category === categoryId);
};

// Helper function to get featured items (bestseller or new badges)
export const getFeaturedItems = () => {
  return ROCAFE_FULL_MENU.filter(item => item.badge === 'bestseller' || item.badge === 'new');
};

// Helper function to format price
export const formatPrice = (price) => {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
};
