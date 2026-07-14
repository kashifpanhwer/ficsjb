import { Product, Category, Coupon, StoreSettings, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-veg',
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    icon: 'Apple',
    description: 'Fresh organic farm produce'
  },
  {
    id: 'cat-oil',
    name: 'Atta, Ghee & Oil',
    slug: 'atta-ghee-oil',
    icon: 'Droplet',
    description: 'Daily kitchen essentials, wheat, and cooking oils'
  },
  {
    id: 'cat-rice',
    name: 'Rice, Pulses & Spices',
    slug: 'rice-pulses-spices',
    icon: 'Grain', // will resolve to custom/alternative
    description: 'Premium grains, lentils, and authentic Pakistani spices'
  },
  {
    id: 'cat-tea',
    name: 'Tea & Beverages',
    slug: 'tea-beverages',
    icon: 'Coffee',
    description: 'Chai leaf packs, juices, and cold drinks'
  },
  {
    id: 'cat-dairy',
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    icon: 'Egg',
    description: 'Milk, butter, fresh eggs, and cheese'
  },
  {
    id: 'cat-snacks',
    name: 'Snacks & Sweets',
    slug: 'snacks-sweets',
    icon: 'Cookie',
    description: 'Biscuits, Pakistani nimcos, and sweets'
  },
  {
    id: 'cat-personal',
    name: 'Personal Care & Soap',
    slug: 'personal-care-soap',
    icon: 'Smile',
    description: 'Shampoo, soaps, toothpastes, and more'
  },
  {
    id: 'cat-household',
    name: 'Household & Cleaning',
    slug: 'household-cleaning',
    icon: 'Sparkles',
    description: 'Washing powders, dishwashing bars, and cleaners'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-atta',
    name: 'Sunridge Chakki Atta (10kg)',
    description: '100% whole wheat flour, stone-ground to preserve nutrients. Perfect for soft, fluffy, and nutritious rotis.',
    category: 'atta-ghee-oil',
    price: 1450,
    discountPrice: 1380,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    unit: '10 kg Pack',
    rating: 4.8,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123451',
    sku: 'SKU-ATTA-01',
    brand: 'Sunridge',
    specifications: {
      'Ingredients': '100% Whole Wheat',
      'Origin': 'Pakistan',
      'Storage Instruction': 'Store in a dry, cool place'
    }
  },
  {
    id: 'prod-ghee',
    name: 'Dalda Banaspati Ghee (1kg Polybag)',
    description: 'Enriched with Vitamin A and D. Brings the authentic aromatic taste to your Pakistani traditional dishes.',
    category: 'atta-ghee-oil',
    price: 520,
    discountPrice: 495,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg Polybag',
    rating: 4.7,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    isTrending: false,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    barcode: '8964000123452',
    sku: 'SKU-GHEE-01',
    brand: 'Dalda',
    specifications: {
      'Type': 'Banaspati',
      'Fat content': '99.9%',
      'Vitamin A': 'Yes',
      'Vitamin D': 'Yes'
    }
  },
  {
    id: 'prod-basmati',
    name: 'Mughal Super Kernel Basmati Rice (5kg)',
    description: 'Extra-long grain aromatic basmati rice. Famous for its delicate aroma, fluffy texture, and exceptional sweet taste.',
    category: 'rice-pulses-spices',
    price: 1950,
    discountPrice: 1850,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    unit: '5 kg bag',
    rating: 4.9,
    isFeatured: true,
    isPopular: false,
    isNew: true,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123453',
    sku: 'SKU-RICE-01',
    brand: 'Mughal',
    specifications: {
      'Grain Length': 'Extra Long',
      'Aroma': 'High',
      'Aged': 'Yes, minimum 1 year'
    }
  },
  {
    id: 'prod-tapal',
    name: 'Tapal Danedar Tea (450g)',
    description: 'Pakistan\'s favorite tea blend. Crafted from premium high-grown Kenyan tea leaves for a strong, bright cup of chai.',
    category: 'tea-beverages',
    price: 680,
    discountPrice: 640,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    unit: '450g Box',
    rating: 4.9,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123454',
    sku: 'SKU-TEA-01',
    brand: 'Tapal',
    specifications: {
      'Type': 'Black Tea (Danedar)',
      'Blend Origin': 'Kenya & Rwanda',
      'Caffeine': 'High'
    }
  },
  {
    id: 'prod-sugar',
    name: 'Premium White Sugar (1kg)',
    description: 'Double refined, sparkling white sugar crystals. Sourced from high-quality sugarcane in Sindh.',
    category: 'atta-ghee-oil',
    price: 155,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg Pack',
    rating: 4.5,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123455',
    sku: 'SKU-SUGAR-01',
    brand: 'Local Sugar Mill',
    specifications: {
      'Form': 'Crystal',
      'Source': 'Sugarcane',
      'Refining': 'Double refined'
    }
  },
  {
    id: 'prod-daal-chana',
    name: 'Premium Daal Chana (Gram Lentil) 1kg',
    description: 'High-quality, bold chana daal. Cleaned, sorted, and packed hygienically. Rich in protein and dietary fiber.',
    category: 'rice-pulses-spices',
    price: 360,
    discountPrice: 340,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1515942901906-6ca05ebe367d?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg Pack',
    rating: 4.6,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123456',
    sku: 'SKU-DAAL-01',
    brand: 'Organic Fields',
    specifications: {
      'Sieve Size': 'Bold 7mm',
      'Moisture': 'Below 10%',
      'Admixture': 'None'
    }
  },
  {
    id: 'prod-shan-biryani',
    name: 'Shan Bombay Biryani Masala (50g)',
    description: 'Perfect blend of authentic ground spices for a rich, spicy Bombay style biryani. The ultimate taste maker.',
    category: 'rice-pulses-spices',
    price: 130,
    discountPrice: 120,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
    unit: '50g Pack',
    rating: 4.8,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    isTrending: false,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    barcode: '8964000123457',
    sku: 'SKU-SPICE-01',
    brand: 'Shan',
    specifications: {
      'Flavour Profile': 'Spicy & Tangy',
      'Servings': '6-8 Persons',
      'Preservatives': 'No artificial colors'
    }
  },
  {
    id: 'prod-onion',
    name: 'Fresh Red Onions (Pyaaz)',
    description: 'Freshly harvested, premium crispy red onions from the farms of Mirpurkhas. Handpicked for quality.',
    category: 'fruits-vegetables',
    price: 180,
    discountPrice: 160,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1618243868663-140dec15797c?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    rating: 4.6,
    isFeatured: true,
    isPopular: false,
    isNew: false,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123458',
    sku: 'SKU-VEG-ONION',
    brand: 'Sindh Farms',
    specifications: {
      'Freshness': 'Guaranteed fresh',
      'Grading': 'Medium to Large',
      'Origin': 'Mirpurkhas, Sindh'
    }
  },
  {
    id: 'prod-potato',
    name: 'Fresh Potatoes (Aloo)',
    description: 'Soil-grown, fresh potatoes. High-quality starch, ideal for frying, baking, or general curries.',
    category: 'fruits-vegetables',
    price: 90,
    discountPrice: 80,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg',
    rating: 4.5,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123459',
    sku: 'SKU-VEG-POTATO',
    brand: 'Sindh Farms',
    specifications: {
      'Type': 'Red Soil Potato',
      'Quality': 'A-Grade'
    }
  },
  {
    id: 'prod-roohafza',
    name: 'Hamdard Rooh Afza Syrup (800ml)',
    description: 'The sweet herbal syrup that defines Pakistani summers. Made from pure distillates of flowers and fruits.',
    category: 'tea-beverages',
    price: 450,
    discountPrice: 420,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    unit: '800ml Bottle',
    rating: 4.8,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123460',
    sku: 'SKU-BEV-ROOH',
    brand: 'Hamdard',
    specifications: {
      'Volume': '800 ml',
      'Flavour': 'Herbal Sweet Rose',
      'Packaging': 'Glass Bottle'
    }
  },
  {
    id: 'prod-milkpak',
    name: 'Nestle Milkpak (1 Liter)',
    description: 'UHT processed pure milk. Gives your morning tea and dessert the richest taste and safety guaranteed.',
    category: 'dairy-eggs',
    price: 295,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    unit: '1 Liter Brick',
    rating: 4.7,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123461',
    sku: 'SKU-DAIRY-MILK',
    brand: 'Nestle',
    specifications: {
      'Processing': 'UHT Treated',
      'Fat content': '3.5%',
      'Shelf life': '6 months unopened'
    }
  },
  {
    id: 'prod-nimco',
    name: 'Soley Premium Mix Nimco (250g)',
    description: 'Hygienic and crunchy mixture nimco. Prepared in high-grade vegetable oil with premium cashew nuts, peanuts, and sev.',
    category: 'snacks-sweets',
    price: 220,
    discountPrice: 190,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    unit: '250g Pack',
    rating: 4.6,
    isFeatured: false,
    isPopular: false,
    isNew: true,
    isTrending: true,
    isFlashSale: false,
    barcode: '8964000123462',
    sku: 'SKU-SNACK-NIMCO',
    brand: 'Soley',
    specifications: {
      'Flavor': 'Spicy salty savory',
      'Oil Used': 'Canola Oil'
    }
  },
  {
    id: 'prod-prince',
    name: 'LU Prince Biscuits Half Roll (Pack of 6)',
    description: 'Crispy biscuits with a delicious chocolate cream filling. The favorite snack of kids and chocolate lovers.',
    category: 'snacks-sweets',
    price: 180,
    stock: 110,
    image: 'https://images.unsplash.com/photo-1558961309-dbdf71799f5a?w=600&auto=format&fit=crop&q=80',
    unit: 'Pack of 6',
    rating: 4.7,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123463',
    sku: 'SKU-LU-PRINCE',
    brand: 'LU',
    specifications: {
      'Flavor': 'Chocolate',
      'Count': '6 individual packs'
    }
  },
  {
    id: 'prod-surfexcel',
    name: 'Surf Excel Easy Wash (1kg)',
    description: 'Remove tough stains in just 1 wash. Combining the power of lemon and bleach-agents for ultimate brightness.',
    category: 'household-cleaning',
    price: 580,
    discountPrice: 530,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a1?w=600&auto=format&fit=crop&q=80',
    unit: '1 kg Pack',
    rating: 4.8,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    isTrending: false,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    barcode: '8964000123464',
    sku: 'SKU-SURF-01',
    brand: 'Unilever',
    specifications: {
      'Type': 'Washing Powder',
      'Machine safe': 'Top load and Hand wash'
    }
  },
  {
    id: 'prod-lifebuoy',
    name: 'Lifebuoy Total Soap Red (135g)',
    description: 'Offers 100% better skin protection from germs. Formulated with Active Silver+ formula for deep cleaning.',
    category: 'personal-care-soap',
    price: 120,
    stock: 140,
    image: 'https://images.unsplash.com/photo-1607006342411-91f11c039a1a?w=600&auto=format&fit=crop&q=80',
    unit: '135g Bar',
    rating: 4.6,
    isFeatured: false,
    isPopular: false,
    isNew: false,
    isTrending: false,
    isFlashSale: false,
    barcode: '8964000123465',
    sku: 'SKU-SOAP-LIFE',
    brand: 'Lifebuoy',
    specifications: {
      'Weight': '135 grams',
      'Variant': 'Total 10 Protection'
    }
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'RAMADAN50',
    discountType: 'fixed',
    value: 50,
    minSpend: 500
  },
  {
    code: 'SHAHMEER10',
    discountType: 'percentage',
    value: 10,
    minSpend: 1000
  },
  {
    code: 'KASHIFSPECIAL',
    discountType: 'percentage',
    value: 15,
    minSpend: 2000
  }
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SHAHMEER SHOP',
  logo: 'SHAHMEER SHOP',
  address: 'Village Imzaiz Panhwar, Mirpurkhas, Sindh, Pakistan',
  description: 'Your premier local Kiryana & grocery store bringing fresh vegetables, kitchen ration, tea, and daily household items right to your doorstep via WhatsApp orders.',
  whatsappNumber: '+923192616627',
  openingHours: '08:00 AM - 10:00 PM (Monday - Sunday)',
  footerText: 'Developed by Kashif',
  primaryColor: '#10b981', // Emerald 500
  secondaryColor: '#059669', // Emerald 600
  seoTitle: 'Shahmeer Shop - Local Premium Grocery & Kiryana Store',
  seoKeywords: 'Shahmeer Shop, Grocery Mirpurkhas, Kiryana Sindh Pakistan, Village Imzaiz Panhwar store, Buy ration on WhatsApp, Kashif developer',
  seoDescription: 'Shahmeer Shop offers high-quality fresh fruits, vegetables, oils, flours, tea and grocery goods delivered to Mirpurkhas and Imzaiz Panhwar village via quick WhatsApp orders.'
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sajid Panhwar',
    rating: 5,
    comment: 'Sub say behtareen grocery store hai. Rates bilkul munasib hain aur dukan se her cheez asli aur fresh milti hai!',
    date: '2026-07-10'
  },
  {
    id: 'rev-2',
    name: 'Dr. Imran Ali',
    rating: 5,
    comment: 'WhatsApp order service is incredibly fast. Sent list, got reply with total and received home delivery in village within 1 hour.',
    date: '2026-07-12'
  },
  {
    id: 'rev-3',
    name: 'Kashif Ali',
    rating: 4.8,
    comment: 'Outstanding shopping experience. The web app is very smooth and easy to use on mobile.',
    date: '2026-07-13'
  }
];
