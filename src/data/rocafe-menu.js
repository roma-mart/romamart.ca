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
  NONE: { label: 'Caffeine-Free', value: 0, color: 'var(--color-text-muted)' },
  LOW: { label: 'Low Caffeine', value: 1, color: 'var(--color-success)' },
  MEDIUM: { label: 'Medium Caffeine', value: 2, color: 'var(--color-warning)' },
  HIGH: { label: 'High Caffeine', value: 3, color: 'var(--color-error)' }
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
  VEGAN: { label: 'Vegan', icon: '🌱', color: 'var(--color-success)' },
  VEGETARIAN: { label: 'Vegetarian', icon: '🥗', color: 'var(--color-success-light)' },
  GLUTEN_FREE: { label: 'Gluten-Free', icon: '⚪', color: 'var(--color-info)' },
  DAIRY_FREE: { label: 'Dairy-Free', icon: '🚫🥛', color: 'var(--color-primary-light)' },
  HALAL: { label: 'Halal', icon: '☪️', color: 'var(--color-success-dark)' }
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
      { name: 'Regular', price: 4.99, calories: 320 },
      { name: 'Large', price: 5.99, calories: 410 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.SPECIALTY,
    
    // Customization options with structured pricing
    customizations: [
      { 
        type: 'Ice Level', 
        required: true,
        multiple: false,
        quantity: false,
        options: [
          { name: 'Regular Ice', price: 0, default: true },
          { name: 'Less Ice', price: 0 },
          { name: 'No Ice', price: 0 }
        ]
      },
      { 
        type: 'Sugar Level', 
        required: true,
        multiple: false,
        quantity: false,
        options: [
          { name: '100%', price: 0, default: true },
          { name: '75%', price: 0 },
          { name: '50%', price: 0 },
          { name: '25%', price: 0 },
          { name: 'No Sugar', price: 0 }
        ]
      },
      { 
        type: 'Toppings', 
        required: false,
        multiple: true,
        quantity: false,
        options: [
          { name: 'Tapioca Pearls', price: 0, default: true },
          { name: 'Popping Boba', price: 1.00 },
          { name: 'Jelly', price: 0.75 },
          { name: 'Pudding', price: 1.00 }
        ]
      }
    ],
    allergens: ['dairy'],
    dietary: ['vegetarian'],
    prepTime: '3-5 min',
    temperature: ['iced'],
    caffeineLevel: 'medium',
    flavorProfile: ['sweet', 'creamy', 'chewy'],
    
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
      { name: 'Small', price: 2.00, calories: 5 },
      { name: 'Medium', price: 2.50, calories: 5 },
      { name: 'Large', price: 3.00, calories: 5 }
    ],
    defaultSize: 1,
    category: MENU_CATEGORIES.HOT_COFFEE,
    
    customizations: [
      { 
        type: 'Additions', 
        required: false,
        multiple: false,
        quantity: true,
        options: [
          { name: 'Cream', price: 0 },
          { name: 'Milk', price: 0 },
          { name: 'Sugar', price: 0 },
          { name: 'Sweetener', price: 0 }
        ]
      }
    ],
    allergens: [],
    dietary: ['vegan', 'gluten-free'],
    prepTime: '1 min',
    temperature: ['hot'],
    caffeineLevel: 'high',
    flavorProfile: ['bold', 'smooth', 'aromatic'],
    
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
      { name: 'Regular', price: 4.99, calories: 180 },
      { name: 'Large', price: 5.99, calories: 240 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.SPECIALTY,
    
    customizations: [
      { 
        type: 'Milk Choice', 
        required: true,
        multiple: false,
        quantity: false,
        options: [
          { name: 'Whole Milk', price: 0, default: true },
          { name: 'Oat Milk', price: 0.50 },
          { name: 'Almond Milk', price: 0.50 },
          { name: 'Soy Milk', price: 0.50 }
        ]
      },
      { 
        type: 'Sweetness', 
        required: true,
        multiple: false,
        quantity: false,
        options: [
          { name: 'Regular', price: 0, default: true },
          { name: 'Light', price: 0 },
          { name: 'None', price: 0 }
        ]
      },
      { 
        type: 'Temperature', 
        required: true,
        multiple: false,
        quantity: false,
        options: [
          { name: 'Hot', price: 0, default: true },
          { name: 'Iced', price: 0 }
        ]
      }
    ],
    allergens: ['dairy', 'may contain nuts (almond milk option)'],
    dietary: ['vegetarian', 'gluten-free'],
    dairyFreeOption: true,
    prepTime: '4-6 min',
    temperature: ['hot', 'iced'],
    caffeineLevel: 'medium',
    flavorProfile: ['earthy', 'creamy', 'umami'],
    
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
      { name: 'Regular', price: 5.50, calories: 210 },
      { name: 'Large', price: 6.50, calories: 280 }
    ],
    defaultSize: 0,
    category: MENU_CATEGORIES.FRESH_JUICE,
    
    customizations: [
      { 
        type: 'Add-ons', 
        required: false,
        multiple: true,
        quantity: false,
        options: [
          { name: 'Popping Boba', price: 1.00 },
          { name: 'Chia Seeds', price: 0.50 }
        ]
      }
    ],
    allergens: [],
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    dairyFreeOption: true,
    prepTime: '2-4 min',
    temperature: ['frozen'],
    caffeineLevel: 'none',
    flavorProfile: ['tropical', 'sweet', 'tangy'],
    
    locationStatus: 'Seasonal - Available Spring/Summer',
    isAvailable: true
  }
];

// Canadian Food Allergen Warning (based on in-store posted notice)
// Compliant with Health Canada's 14 priority allergens
export const ALLERGEN_WARNING = {
  title: 'Check your allergy before eating',
  subtitle: 'Food at this establishment may contain any of these 14 allergens.',
  allergens: [
    { name: 'Milk', icon: '🥛' },
    { name: 'Crustaceans', icon: '🦞' },
    { name: 'Eggs', icon: '🥚' },
    { name: 'Fish', icon: '🐟' },
    { name: 'Lupin', icon: '🫘' },
    { name: 'Celery', icon: '🥬' },
    { name: 'Soya', icon: '🫛' },
    { name: 'Cereals (inc. gluten)', icon: '🌾' },
    { name: 'Peanuts', icon: '🥜' },
    { name: 'Nuts', icon: '🌰' },
    { name: 'Sesame Seeds', icon: '🫘' },
    { name: 'Mustard', icon: '🟡' },
    { name: 'Molluscs', icon: '🦪' },
    { name: 'Sulphites', icon: '⚗️' }
  ],
  footer: 'PLEASE ASK A MEMBER OF STAFF BEFORE ORDERING. THANK YOU',
  disclaimer: 'Celery, cereals containing gluten (such as barley and oats), crustaceans (such as prawns, crabs, and lobsters), eggs, fish, lupin, milk, molluscs (such as mussels and oysters), mustard, peanuts, sesame, soybeans, sulphur dioxide and sulphites (at a concentration of more than ten parts per million) and tree nuts.'
};

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

// ============================================================
// HELPER FUNCTIONS MOVED TO utils/menuHelpers.js
// Import from there for: formatPrice, calculateItemPrice, getLowestPrice
// Centralized in utils/ per development ethos (utilities belong in utils/)
// ============================================================
