/**
 * Menu item fixtures for schema tests
 */

const menuItems = {
  singleSizeCents: {
    itemType: 'menu',
    id: 'item-espresso',
    name: 'Espresso',
    tagline: 'Rich and bold',
    description: 'Single or double shot of our signature espresso',
    categories: ['coffee', 'hot-drinks'],
    sizes: [{ name: 'Small', size: '8 oz', price: 249 }],
    allergens: ['dairy'],
    dietary: ['vegan', 'gluten-free'],
    featured: false
  },
  multiSizeCents: {
    itemType: 'menu',
    id: 'item-latte',
    name: 'Latte',
    description: 'Classic latte with steamed milk',
    categories: ['coffee'],
    sizes: [
      { name: 'Small', size: '12 oz', price: 249 },
      { name: 'Large', size: '16 oz', price: 349 }
    ],
    dietary: ['vegetarian'],
    allergens: ['dairy']
  },
  singleSizeDollars: {
    itemType: 'menu',
    id: 'item-sandwich',
    name: 'Turkey Sandwich',
    description: 'Freshly made sandwich',
    category: 'RoCafe Food',
    sizes: [{ name: 'One Size', price: 4.5 }],
    allergens: ['gluten'],
    dietary: []
  },
  missingName: {
    itemType: 'menu',
    id: 'item-missing-name',
    description: 'Missing name should return null',
    sizes: [{ name: 'Small', price: 199 }]
  },
  htmlDescription: {
    itemType: 'menu',
    id: 'item-html',
    name: 'Berry Smoothie',
    description: '<strong>Fresh</strong> berries blended',
    categories: ['smoothies'],
    sizes: [{ name: 'Regular', price: 599 }],
    image: null,
    dietary: ['dairy-free'],
    allergens: []
  }
};

export default menuItems;
