export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image: string;
  unit: string; // e.g. "1 kg", "500g", "1 liter", "Pack of 12"
  rating: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string; // ISO date string
  barcode: string;
  sku: string;
  brand: string;
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  description: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  village: string;
  city: string;
  postalCode: string;
  notes?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
}

export interface StoreSettings {
  storeName: string;
  logo: string; // text or url
  address: string;
  description: string;
  whatsappNumber: string;
  openingHours: string;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
}
