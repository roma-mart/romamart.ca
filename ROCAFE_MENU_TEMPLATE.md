# 🍰 RoCafé Menu Template - Roma Mart

**Last Updated:** December 1, 2025  
**Purpose:** Easy copy-paste template for adding menu items to RoCafé

---

## 📋 How to Use This Template

1. **Take photos** using `MENU_PHOTOGRAPHY_GUIDE.md`
2. **Copy the template** for your item type (Hot Drink, Cold Drink, Pastry)
3. **Fill in the blanks** with your info
4. **Place photo** in `/public/images/rocafe/` with correct filename
5. **Add to `src/data/rocafe.js`** (we'll create this file together)
6. **Build & deploy** to see it live!

---

## ☕ HOT DRINKS TEMPLATE

### Template Code:
```javascript
{
  id: 'cappuccino',                                    // Unique ID (lowercase, no spaces)
  name: 'Cappuccino',                                  // Display name
  tagline: 'Classic espresso with steamed milk',       // Short description (basic view)
  description: 'Our signature cappuccino features a perfect balance of rich espresso, velvety steamed milk, and light foam. Made with premium arabica beans roasted fresh daily.', // Full description (detailed view)
  category: 'hot_drinks',                              // Category: 'hot_drinks' | 'cold_drinks' | 'pastries' | 'snacks' | 'heat_serve'
  image: '/romamart.ca/images/rocafe/cappuccino.jpg',  // Photo path (after you upload)
  badge: 'bestseller',                                 // Optional: 'bestseller' | 'new' | null
  sizes: [
    { name: 'Small', price: 3.49, volume: '8oz' },
    { name: 'Medium', price: 3.99, volume: '12oz' },
    { name: 'Large', price: 4.49, volume: '16oz' }
  ],
  defaultSize: 1,                                      // Index of default size (0=Small, 1=Medium, 2=Large)
  calories: 120,                                       // Optional: Calorie count
  ingredients: 'Espresso, steamed milk, foam',         // Optional: Ingredient list
  allergens: ['dairy'],                                // Optional: Allergen info
  available: true,                                     // Is it available now? true/false
},
```

### Fill-In-The-Blanks Example:
```javascript
{
  id: '___________',                                   // e.g., 'latte', 'espresso', 'americano'
  name: '___________',                                 // e.g., 'Latte', 'Espresso', 'Americano'
  tagline: '___________',                              // e.g., 'Smooth and creamy espresso drink'
  description: '___________',                          // Full description (2-3 sentences)
  category: 'hot_drinks',
  image: '/romamart.ca/images/rocafe/___________.jpg', // e.g., 'latte.jpg'
  badge: null,                                         // 'bestseller' or 'new' or null
  sizes: [
    { name: 'Small', price: ___, volume: '___' },      // e.g., 3.49, '8oz'
    { name: 'Medium', price: ___, volume: '___' },     // e.g., 3.99, '12oz'
    { name: 'Large', price: ___, volume: '___' }       // e.g., 4.49, '16oz'
  ],
  defaultSize: 1,
  calories: ___,                                       // Optional
  ingredients: '___________',                          // Optional
  allergens: ['dairy'],                                // Optional: ['dairy', 'nuts', 'gluten', 'soy']
  available: true,
},
```

---

## 🧊 COLD DRINKS TEMPLATE

### Template Code:
```javascript
{
  id: 'iced-latte',
  name: 'Iced Latte',
  tagline: 'Refreshing cold espresso with milk',
  description: 'Smooth espresso poured over ice and topped with cold milk. Perfect for a hot day. Available with dairy or oat milk.',
  category: 'cold_drinks',
  image: '/romamart.ca/images/rocafe/iced-latte.jpg',
  badge: 'new',                                        // Optional: 'bestseller' | 'new' | null
  sizes: [
    { name: 'Small', price: 3.99, volume: '12oz' },
    { name: 'Medium', price: 4.49, volume: '16oz' },
    { name: 'Large', price: 4.99, volume: '20oz' }
  ],
  defaultSize: 1,
  calories: 140,
  ingredients: 'Espresso, milk, ice',
  allergens: ['dairy'],                                // Can be removed if using oat milk
  available: true,
},
```

### Fill-In-The-Blanks Example:
```javascript
{
  id: '___________',                                   // e.g., 'iced-coffee', 'frappe', 'cold-brew'
  name: '___________',                                 // e.g., 'Iced Coffee', 'Frappe', 'Cold Brew'
  tagline: '___________',
  description: '___________',
  category: 'cold_drinks',
  image: '/romamart.ca/images/rocafe/___________.jpg',
  badge: null,
  sizes: [
    { name: 'Small', price: ___, volume: '___' },
    { name: 'Medium', price: ___, volume: '___' },
    { name: 'Large', price: ___, volume: '___' }
  ],
  defaultSize: 1,
  calories: ___,
  ingredients: '___________',
  allergens: [],                                       // ['dairy', 'nuts', 'gluten', 'soy'] or []
  available: true,
},
```

---

## 🥐 PASTRIES TEMPLATE

### Template Code:
```javascript
{
  id: 'blueberry-muffin',
  name: 'Blueberry Muffin',
  tagline: 'Fresh-baked with real blueberries',
  description: 'Our famous blueberry muffins are made fresh daily with plump blueberries and a tender crumb. Perfectly moist and not too sweet.',
  category: 'pastries',
  image: '/romamart.ca/images/rocafe/muffin-blueberry.jpg',
  badge: 'bestseller',
  sizes: [],                                           // Pastries typically don't have sizes
  defaultSize: 0,
  price: 2.99,                                         // Single price (no sizes)
  calories: 380,
  ingredients: 'Flour, blueberries, sugar, eggs, butter',
  allergens: ['gluten', 'dairy', 'eggs'],
  available: true,
},
```

### Fill-In-The-Blanks Example:
```javascript
{
  id: '___________',                                   // e.g., 'croissant', 'cookie-chocolate', 'danish'
  name: '___________',                                 // e.g., 'Croissant', 'Chocolate Cookie', 'Cherry Danish'
  tagline: '___________',
  description: '___________',
  category: 'pastries',
  image: '/romamart.ca/images/rocafe/___________.jpg',
  badge: null,
  sizes: [],
  defaultSize: 0,
  price: ___,                                          // e.g., 2.49, 2.99, 3.49
  calories: ___,
  ingredients: '___________',
  allergens: [],                                       // ['gluten', 'dairy', 'eggs', 'nuts'] or []
  available: true,
},
```

---

## 🍕 HEAT & SERVE TEMPLATE

### Template Code:
```javascript
{
  id: 'pizza-slice',
  name: 'Pizza Slice',
  tagline: 'Hot and ready in 2 minutes',
  description: 'Classic cheese or pepperoni pizza heated fresh for you. Made with quality ingredients and real mozzarella.',
  category: 'heat_serve',
  image: '/romamart.ca/images/rocafe/pizza-slice.jpg',
  badge: null,
  sizes: [],
  defaultSize: 0,
  price: 4.99,
  calories: 280,
  ingredients: 'Dough, tomato sauce, mozzarella, pepperoni',
  allergens: ['gluten', 'dairy'],
  available: true,
  prepTime: '2 minutes',                               // Optional: Prep time
},
```

---

## 🎯 QUICK REFERENCE

### Categories:
- `hot_drinks` - Cappuccino, Latte, Americano, Espresso, Hot Chocolate, Tea
- `cold_drinks` - Iced Coffee, Iced Latte, Frappe, Cold Brew, Smoothie, Juice
- `pastries` - Muffins, Croissants, Cookies, Danishes, Scones
- `snacks` - Chips, Chocolate, Gummies, Nuts, Protein Bars
- `heat_serve` - Pizza, Sandwiches, Wraps, Paninis (RoCafé exclusive)

### Badges:
- `bestseller` - Yellow badge, popular items
- `new` - Green badge, recently added
- `halal` - Green halal certified badge
- `comingSoon` - Yellow "Coming Soon" badge
- `null` - No badge

### Allergens:
- `dairy` - Contains milk products
- `gluten` - Contains wheat/gluten
- `eggs` - Contains eggs
- `nuts` - Contains nuts (specify which: peanuts, almonds, etc.)
- `soy` - Contains soy
- `shellfish` - Contains shellfish

### Image Naming Convention:
**Hot/Cold Drinks:**
- `cappuccino-small.jpg` (if you photograph each size)
- `cappuccino.jpg` (if one photo for all sizes)

**Pastries:**
- `muffin-blueberry.jpg`
- `croissant.jpg`
- `cookie-chocolate.jpg`

**Heat & Serve:**
- `pizza-slice.jpg`
- `sandwich-club.jpg`

---

## 📝 Complete Menu Template File

When you're ready, we'll create `src/data/rocafe.js` with this structure:

```javascript
/**
 * RoCafé Menu Data
 * 
 * Centralized menu management for RoCafé at Roma Mart
 * All items use the StandardizedItem component
 */

export const MENU_CATEGORIES = {
  HOT_DRINKS: 'hot_drinks',
  COLD_DRINKS: 'cold_drinks',
  PASTRIES: 'pastries',
  SNACKS: 'snacks',
  HEAT_SERVE: 'heat_serve'
};

export const ROCAFE_MENU = [
  // ===== HOT DRINKS =====
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    tagline: 'Classic espresso with steamed milk',
    description: 'Our signature cappuccino features a perfect balance of rich espresso, velvety steamed milk, and light foam. Made with premium arabica beans roasted fresh daily.',
    category: 'hot_drinks',
    image: '/romamart.ca/images/rocafe/cappuccino.jpg',
    badge: 'bestseller',
    sizes: [
      { name: 'Small', price: 3.49, volume: '8oz' },
      { name: 'Medium', price: 3.99, volume: '12oz' },
      { name: 'Large', price: 4.49, volume: '16oz' }
    ],
    defaultSize: 1,
    calories: 120,
    ingredients: 'Espresso, steamed milk, foam',
    allergens: ['dairy'],
    available: true,
  },
  
  // Add more hot drinks here...

  // ===== COLD DRINKS =====
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    tagline: 'Refreshing cold espresso with milk',
    description: 'Smooth espresso poured over ice and topped with cold milk. Perfect for a hot day.',
    category: 'cold_drinks',
    image: '/romamart.ca/images/rocafe/iced-latte.jpg',
    badge: 'new',
    sizes: [
      { name: 'Small', price: 3.99, volume: '12oz' },
      { name: 'Medium', price: 4.49, volume: '16oz' },
      { name: 'Large', price: 4.99, volume: '20oz' }
    ],
    defaultSize: 1,
    calories: 140,
    ingredients: 'Espresso, milk, ice',
    allergens: ['dairy'],
    available: true,
  },
  
  // Add more cold drinks here...

  // ===== PASTRIES =====
  {
    id: 'blueberry-muffin',
    name: 'Blueberry Muffin',
    tagline: 'Fresh-baked with real blueberries',
    description: 'Our famous blueberry muffins are made fresh daily with plump blueberries and a tender crumb.',
    category: 'pastries',
    image: '/romamart.ca/images/rocafe/muffin-blueberry.jpg',
    badge: 'bestseller',
    sizes: [],
    defaultSize: 0,
    price: 2.99,
    calories: 380,
    ingredients: 'Flour, blueberries, sugar, eggs, butter',
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
  },
  
  // Add more pastries here...
];

// Helper functions
export const getMenuByCategory = (category) => {
  return ROCAFE_MENU.filter(item => item.category === category);
};

export const getHotDrinks = () => getMenuByCategory(MENU_CATEGORIES.HOT_DRINKS);
export const getColdDrinks = () => getMenuByCategory(MENU_CATEGORIES.COLD_DRINKS);
export const getPastries = () => getMenuByCategory(MENU_CATEGORIES.PASTRIES);
export const getSnacks = () => getMenuByCategory(MENU_CATEGORIES.SNACKS);
export const getHeatServe = () => getMenuByCategory(MENU_CATEGORIES.HEAT_SERVE);

export const getMenuItemById = (id) => {
  return ROCAFE_MENU.find(item => item.id === id);
};

export const getAvailableItems = () => {
  return ROCAFE_MENU.filter(item => item.available);
};

export const getBestSellers = () => {
  return ROCAFE_MENU.filter(item => item.badge === 'bestseller');
};

export const getNewItems = () => {
  return ROCAFE_MENU.filter(item => item.badge === 'new');
};
```

---

## 💡 Pro Tips

1. **Start Small:** Add 3-5 items per category first, then expand
2. **Best Sellers First:** Prioritize your most popular items
3. **Consistent Pricing:** Round to .49 or .99 for psychological pricing
4. **Accurate Info:** Double-check prices, calories, allergens (legal requirement!)
5. **High-Quality Photos:** Use MENU_PHOTOGRAPHY_GUIDE.md for best results
6. **Update Regularly:** Mark seasonal items, rotate "NEW" badge quarterly

---

## ✅ Checklist for Each Item

- [ ] Photo taken (800x800px, <200KB)
- [ ] Photo optimized with TinyPNG
- [ ] Photo placed in `/public/images/rocafe/`
- [ ] Unique ID (lowercase, no spaces)
- [ ] Display name
- [ ] Tagline (1 sentence)
- [ ] Description (2-3 sentences)
- [ ] Category assigned
- [ ] Prices set (all sizes if applicable)
- [ ] Calories checked (optional but recommended)
- [ ] Allergens listed (CRITICAL for legal compliance)
- [ ] Badge chosen (if applicable)
- [ ] Available status set
- [ ] Added to `src/data/rocafe.js`
- [ ] Build & deploy tested

---

## 🚀 Next Steps

1. **Take photos tomorrow** using MENU_PHOTOGRAPHY_GUIDE.md
2. **Fill out this template** for each item (10-15 items recommended)
3. **Send me the completed data** - I'll create `src/data/rocafe.js`
4. **I'll update RoCafePage.jsx** to use the new menu system
5. **Build, test, and deploy** together
6. **Review on live site** before domain switchover

---

**Ready to fill this out? After you take photos, just copy-paste the template and fill in the blanks!** 📝