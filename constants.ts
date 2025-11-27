import { MenuItem } from './types';

export const CATEGORIES = [
  'Iced Coffee',
  'Hot Coffee',
  'Frappes',
  'Milk Tea',
  'Fruit Soda',
  'Meals',
  'Snacks',
  'Desserts'
] as const;

// Helper for repeated variants
const ICED_COFFEE_VARIANTS = [
  { name: 'Primera (8oz)', price: 49 },
  { name: 'Segonda (12oz)', price: 69 },
  { name: 'Tresiera (16oz)', price: 89 },
  { name: 'Quarta (22oz)', price: 109 },
];

const FRUIT_SODA_VARIANTS = [
  { name: 'Primera (8oz)', price: 29 },
  { name: 'Segonda (12oz)', price: 39 },
  { name: 'Tresiera (16oz)', price: 49 },
  { name: 'Quarta (22oz)', price: 59 },
];

const FRAPPE_VARIANTS = [
  { name: 'Small (12oz)', price: 109 },
  { name: 'Medium (16oz)', price: 135 },
  { name: 'Large (22oz)', price: 160 },
];

const MILK_TEA_VARIANTS = [
  { name: 'Small', price: 35 },
  { name: 'Regular', price: 50 },
  { name: 'Large', price: 70 },
];

const DESSERT_VARIANTS = [
  { name: 'Small', price: 40 },
  { name: 'Regular', price: 55 },
  { name: 'Large', price: 85 },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- Iced Coffee ---
  {
    id: 'ic-caramel-macch',
    name: 'Caramel Macchiato',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-mocha-latte',
    name: 'Mocha Latte',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-vanilla-latte',
    name: 'Vanilla Latte',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-cappuccino-latte',
    name: 'Cappuccino Latte',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-vietnamese',
    name: 'Vietnamese Coffee',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-dirty-matcha',
    name: 'Dirty Matcha',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-spanish-latte',
    name: 'Spanish Latte',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },
  {
    id: 'ic-oreo-cream',
    name: 'Oreo Cream Latte',
    category: 'Iced Coffee',
    variants: ICED_COFFEE_VARIANTS
  },

  // --- Hot Coffee ---
  {
    id: 'hc-americano',
    name: 'Hot Americano',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-latte',
    name: 'Hot Latte',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-cappuccino',
    name: 'Hot Cappuccino',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-caramel-latte',
    name: 'Caramel Latte',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-mocha-latte',
    name: 'Mocha Latte',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-spanish-latte',
    name: 'Spanish Latte',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-matcha-latte',
    name: 'Matcha Latte',
    category: 'Hot Coffee',
    basePrice: 49,
  },
  {
    id: 'hc-hot-choco',
    name: 'Hot Chocolate',
    category: 'Hot Coffee',
    basePrice: 49,
  },

  // --- Frappes ---
  {
    id: 'fr-signature',
    name: 'Happy Hearts Signature',
    category: 'Frappes',
    isBestSeller: true,
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-caramel',
    name: 'Caramel Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-cookies',
    name: 'Cookies & Cream',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-strawberry',
    name: 'Strawberry Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-mocha',
    name: 'Mocha Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-matcha',
    name: 'Matcha Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-vanilla',
    name: 'Vanilla Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },
  {
    id: 'fr-choco',
    name: 'Choco Frappe',
    category: 'Frappes',
    variants: FRAPPE_VARIANTS
  },

  // --- Milk Tea ---
  {
    id: 'mt-chocolate',
    name: 'Chocolate Milk Tea',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-matcha',
    name: 'Matcha Milk Tea',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-salted-caramel',
    name: 'Salted Caramel',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-cookies',
    name: 'Cookies n\' Cream',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-okinawa',
    name: 'Okinawa',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-thai',
    name: 'Thai Milk Tea',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },
  {
    id: 'mt-honeydew',
    name: 'Honey Dew',
    category: 'Milk Tea',
    variants: MILK_TEA_VARIANTS
  },

  // --- Fruit Soda ---
  {
    id: 'fs-rootbeer',
    name: 'Rootbeer',
    category: 'Fruit Soda',
    variants: FRUIT_SODA_VARIANTS
  },
  {
    id: 'fs-strawberry',
    name: 'Strawberry Soda',
    category: 'Fruit Soda',
    variants: FRUIT_SODA_VARIANTS
  },
  {
    id: 'fs-apple-green',
    name: 'Apple Green',
    category: 'Fruit Soda',
    variants: FRUIT_SODA_VARIANTS
  },
  {
    id: 'fs-bubble-gum',
    name: 'Bubble Gum',
    category: 'Fruit Soda',
    variants: FRUIT_SODA_VARIANTS
  },
  {
    id: 'fs-blueberry',
    name: 'Blueberry',
    category: 'Fruit Soda',
    variants: FRUIT_SODA_VARIANTS
  },

  // --- Meals (Rice Meals / Noodles / Porridge) ---
  {
    id: 'ml-lugaw',
    name: 'Lugaw',
    category: 'Meals',
    isBestSeller: true,
    variants: [
      { name: 'Plain', price: 25 },
      { name: 'With Egg', price: 35 },
      { name: 'Small', price: 15 },
    ]
  },
  {
    id: 'ml-sopas',
    name: 'Sopas',
    category: 'Meals',
    isBestSeller: true,
    variants: [
      { name: 'Plain', price: 25 },
      { name: 'With Egg', price: 35 },
      { name: 'Small', price: 15 },
    ]
  },
  {
    id: 'ml-ramen',
    name: 'Happy Ramen',
    category: 'Meals',
    description: 'Overload sa Sarap',
    variants: [
      { name: 'Regular', price: 65 },
      { name: 'Overload', price: 85 },
    ]
  },
  {
    id: 'ml-pancit',
    name: 'Pancit Canton',
    category: 'Meals',
    variants: [
      { name: 'Plain', price: 30 },
      { name: 'With Egg', price: 45 },
      { name: 'With Hotdog', price: 55 },
    ]
  },

  // --- Snacks ---
  {
    id: 'sn-hotdog',
    name: 'Hotdog',
    category: 'Snacks',
    variants: [
      { name: 'Regular', price: 35 },
      { name: 'Classic', price: 45 },
      { name: 'Cheesy Overload', price: 55 },
      { name: 'Hungarian Big', price: 69 },
    ]
  },
  {
    id: 'sn-nachos',
    name: 'Nachos',
    category: 'Snacks',
    isBestSeller: true,
    variants: [
      { name: 'Solo (Cheesy & Veg)', price: 55 },
      { name: 'Double (w/ Meat)', price: 85 },
      { name: 'Overload', price: 130 },
    ]
  },
  {
    id: 'sn-burger',
    name: 'Burger',
    category: 'Snacks',
    variants: [
      { name: 'Regular', price: 35 },
      { name: 'Cheese Burger', price: 40 },
      { name: 'Ham & Cheese', price: 65 },
    ]
  },
  {
    id: 'sn-sandwich',
    name: 'Sandwiches',
    category: 'Snacks',
    variants: [
      { name: 'Ham & Cheese', price: 45 },
      { name: 'Tuna Sandwich', price: 55 },
    ]
  },
  {
    id: 'sn-clubhouse',
    name: 'Happy Clubhouse',
    category: 'Snacks',
    description: 'Cheese Sandwich & Fries',
    variants: [
      { name: 'Sandwich & Fries', price: 140 },
      { name: 'w/ 3 Ice Tea', price: 170 },
      { name: 'w/ Large Fries (6pcs)', price: 180 },
    ]
  },
  {
    id: 'sn-fries',
    name: 'French Fries',
    category: 'Snacks',
    variants: [
      { name: 'Small', price: 25 },
      { name: 'Medium', price: 35 },
      { name: 'Large', price: 50 },
    ]
  },
  {
    id: 'sn-fries-overload',
    name: 'Fries Overload',
    category: 'Snacks',
    variants: [
      { name: 'Cheesy Fries', price: 65 },
      { name: 'Cheesy w/ Ham', price: 75 },
      { name: 'Cheesy w/ Hotdog', price: 95 },
    ]
  },

  // --- Desserts ---
  {
    id: 'ds-halo-halo',
    name: 'Halo-Halo Overload',
    category: 'Desserts',
    isBestSeller: true,
    variants: DESSERT_VARIANTS
  },
  {
    id: 'ds-mais',
    name: 'Mais Con Yelo',
    category: 'Desserts',
    variants: DESSERT_VARIANTS
  },
  {
    id: 'ds-saging',
    name: 'Saging Con Yelo',
    category: 'Desserts',
    variants: DESSERT_VARIANTS
  },
  {
    id: 'ds-manga',
    name: 'Manga Con Yelo',
    category: 'Desserts',
    variants: DESSERT_VARIANTS
  },
  {
    id: 'ds-mango-graham',
    name: 'Mango Graham',
    category: 'Desserts',
    variants: [
      { name: 'Small', price: 55 },
      { name: 'Medium', price: 80 },
      { name: 'Large', price: 120 },
    ]
  }
];