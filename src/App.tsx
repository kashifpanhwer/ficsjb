import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutForm } from './components/CheckoutForm';
import { CompareModal } from './components/CompareModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminPanel } from './components/AdminPanel';
import { Icon } from './components/Icon';

import { Product, Category, Order, StoreSettings, Coupon, Review } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  DEFAULT_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from './data/products';

export default function App() {
  // --- Persistent States (LocalStorage) ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shahmeer_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('shahmeer_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shahmeer_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('shahmeer_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shahmeer_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Dynamic App States ---
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sorting & Filtering in Shop page
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(2000); // max price boundary
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Compare List state (max 3)
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // Modals visibility toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Coupons / Promo Code State
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Flash Sale Timer state (Simulating dynamic countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  // Contact form messages (stored in state for Admin)
  const [contactMessages, setContactMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('shahmeer_contact_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Sync States with LocalStorage ---
  useEffect(() => {
    localStorage.setItem('shahmeer_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shahmeer_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('shahmeer_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shahmeer_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shahmeer_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Check URL routing query on load (e.g., ?page=admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page === 'admin') {
      setIsAdminOpen(true);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // reset loop
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Cart Actions ---
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Sorry, you reached the maximum stock available for this product.');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleDecreaseQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleIncreaseQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (item.quantity >= item.product.stock) {
            alert('Cannot add more. Stock limit reached.');
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // --- Wishlist Actions ---
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // --- Compare Actions ---
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 products at a time.');
        return prev;
      }
      return [...prev, product];
    });
    setIsCompareOpen(true);
  };

  // --- Coupon Logic ---
  const handleApplyCoupon = (code: string): boolean => {
    const coupon = INITIAL_COUPONS.find((c) => c.code === code);
    if (!coupon) return false;

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    if (subtotal < coupon.minSpend) return false;

    setAppliedCoupon(coupon);
    return true;
  };

  // --- Checkout / Order Completion ---
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    handleClearCart();
    setCurrentPage('home');
    alert(`Mubarak! Your Order #${newOrder.orderNumber} is placed successfully and compiled for WhatsApp. Keep this ID to track your order status!`);
  };

  // --- Contact form handling ---
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const messageObj = {
      id: Date.now(),
      name: data.get('name'),
      email: data.get('email'),
      message: data.get('message'),
      date: new Date().toLocaleDateString()
    };
    const updatedLogs = [messageObj, ...contactMessages];
    setContactMessages(updatedLogs);
    localStorage.setItem('shahmeer_contact_logs', JSON.stringify(updatedLogs));
    alert('Thank you for contacting Shahmeer Shop! Our Mirpurkhas branch manager will reply to your enquiry via email or WhatsApp soon.');
    e.currentTarget.reset();
  };

  // Reset factory configurations
  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to restore the initial store data and delete all customized logs?')) {
      localStorage.removeItem('shahmeer_products');
      localStorage.removeItem('shahmeer_settings');
      localStorage.removeItem('shahmeer_orders');
      localStorage.removeItem('shahmeer_cart');
      localStorage.removeItem('shahmeer_wishlist');
      localStorage.removeItem('shahmeer_contact_logs');
      
      setProducts(INITIAL_PRODUCTS);
      setSettings(DEFAULT_SETTINGS);
      setOrders([]);
      setCartItems([]);
      setWishlist([]);
      setContactMessages([]);
      alert('Shahmeer Shop re-synchronized to initial factory default state.');
      window.location.reload();
    }
  };

  // --- Dynamic Search & Filter Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // 2. Category selection
      const matchesCategory =
        selectedCategory === 'all' ? true : product.category === selectedCategory;

      // 3. Price limit
      const price = product.discountPrice || product.price;
      const matchesPrice = price <= priceRange;

      // 4. Brand limit
      const matchesBrand =
        selectedBrand === 'all' ? true : product.brand.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedBrand]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => {
        const pA = a.discountPrice || a.price;
        const pB = b.discountPrice || b.price;
        return pA - pB;
      });
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => {
        const pA = a.discountPrice || a.price;
        const pB = b.discountPrice || b.price;
        return pB - pA;
      });
    } else if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      return list.sort((a, b) => {
        const discA = a.discountPrice ? a.price - a.discountPrice : 0;
        const discB = b.discountPrice ? b.price - b.discountPrice : 0;
        return discB - discA;
      });
    }
    return list; // featured/default
  }, [filteredProducts, sortBy]);

  // Unique brands compile
  const uniqueBrands = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map((p) => p.brand)))];
  }, [products]);

  // Cart Totals calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  // Related products helper
  const getRelatedProducts = (product: Product) => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  };

  // Get order helper for tracking stepper
  const getSavedOrder = (orderNumber: string): Order | null => {
    const found = orders.find((o) => o.orderNumber === orderNumber);
    return found || null;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* 1. Header & Navigation Bar */}
      <Navbar
        settings={settings}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        compareCount={comparedProducts.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        onLogoClick={() => {
          // Double safeguard to let users open the admin control center
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Routing Area */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Hero Banner Carousel */}
            <Hero
              categories={INITIAL_CATEGORIES}
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
            />

            {/* Flash Sale Banner (Interactive Countdown) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-slate-900 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-xl shadow-emerald-100">
                <div className="absolute top-0 right-0 h-full w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300 via-emerald-200 to-emerald-900 pointer-events-none" />
                
                <div className="space-y-4 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-slate-950 text-xs font-black tracking-widest uppercase">
                    <Icon name="Zap" size={12} className="fill-slate-950" /> Hot Flash Sale
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Premium Banaspati Ghee & Kitchen Ration on Sale
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
                    Hurry up! Save up to Rs. 150 on essential flours, tea packs, organic spices, and village farm onions. Fast doorstep transport.
                  </p>
                </div>

                {/* Countdown Timer Visual */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-yellow-300">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-200 mt-1.5 uppercase tracking-wider font-mono">Hours</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-300 mb-6 font-mono">:</span>
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-yellow-300">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-200 mt-1.5 uppercase tracking-wider font-mono">Mins</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-300 mb-6 font-mono">:</span>
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-yellow-300 animate-pulse">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-200 mt-1.5 uppercase tracking-wider font-mono">Secs</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSortBy('discount');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-[1.03] shrink-0 active:scale-95 uppercase tracking-wide"
                >
                  View Discounts
                </button>
              </div>
            </section>

            {/* Featured / Popular Products Grid (Home page) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="text-emerald-500">🔥</span> Popular Kitchen Products
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Our absolute best sellers in Village Imzaiz and Mirpurkhas</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage('shop');
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-xs sm:text-sm flex items-center gap-1 group"
                >
                  Show All Products <Icon name="ChevronRight" size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {products
                  .filter((p) => p.isFeatured || p.isPopular)
                  .slice(0, 10)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === product.id)}
                      onCompare={handleToggleCompare}
                      isCompared={comparedProducts.some((c) => c.id === product.id)}
                      onQuickView={setActiveQuickViewProduct}
                    />
                  ))}
              </div>
            </section>

            {/* Organic Fresh Banner Callout */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="space-y-4 max-w-lg">
                  <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-widest font-mono">100% Secure WhatsApp Orders</h4>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">Need urgent help? Share your grocery list on WhatsApp</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Don't want to click through checkout? Just tap the button to chat with Kashif or Shahmeer Shop managers directly. Send raw text lists, hand-written slips, or voice messages.
                  </p>
                </div>
                <a
                  href="https://wa.me/923192616627"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-950"
                >
                  <Icon name="Phone" size={16} /> Fast WhatsApp Ordering
                </a>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">What Local Villagers Say</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Read authentic reviews from customers in Imzaiz Panhwar village & Mirpurkhas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_REVIEWS.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon key={i} name="Star" size={13} className="fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">"{review.comment}"</p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      <span>{review.name}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentPage === 'shop' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Shop Sidebar Filters (1 span) */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-150 space-y-6 sticky top-24 shadow-sm">
                  
                  {/* Category Title */}
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Icon name="Filter" size={14} className="text-emerald-500" /> Filter Categories
                    </h3>
                  </div>

                  {/* Category buttons list */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      All Kitchen Ration
                    </button>
                    {INITIAL_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${selectedCategory === category.slug ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <Icon name={category.icon} size={14} />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Price filter slider */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
                      <span>Max Budget</span>
                      <span className="font-mono text-emerald-600">Rs. {priceRange.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={50}
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Brand Selector */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 bg-slate-50 rounded-xl outline-none text-xs font-bold"
                    >
                      <option value="all">All Brands</option>
                      {uniqueBrands.filter((b) => b !== 'all').map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* Shop Products Grid View (3 spans) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Upper filtering toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-bold text-slate-500 uppercase">
                  <span>Found {sortedProducts.length} Premium Grocery Items</span>
                  
                  <div className="flex items-center gap-2">
                    <span>Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 px-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer text-slate-700"
                    >
                      <option value="featured">Featured Picks</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="discount">Biggest Savings</option>
                    </select>
                  </div>
                </div>

                {/* Grid */}
                {sortedProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl py-20 text-center border border-slate-150">
                    <div className="h-16 w-16 bg-slate-50 text-slate-300 flex items-center justify-center rounded-full mx-auto mb-3">
                      <Icon name="Search" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">No grocery items found</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try resetting your category filters, search query, or budget slide price limits.</p>
                    <button 
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setPriceRange(2000); setSelectedBrand('all'); }}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w.id === product.id)}
                        onCompare={handleToggleCompare}
                        isCompared={comparedProducts.some((c) => c.id === product.id)}
                        onQuickView={setActiveQuickViewProduct}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {currentPage === 'wishlist' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Your Saved Wishlist</h2>
              <p className="text-xs text-slate-400 mt-1">Keep track of your favorite vegetables and ration stocks</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-3xl py-20 text-center border border-slate-150 max-w-md mx-auto">
                <div className="h-16 w-16 bg-rose-50 text-rose-400 flex items-center justify-center rounded-full mx-auto mb-3 animate-pulse">
                  <Icon name="Heart" size={24} className="fill-rose-100" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Your Wishlist is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Click the heart icon on any product across the shop to save it here.</p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="mt-4 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-all"
                >
                  Start Exploring Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5">
                {wishlist.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleToggleWishlist}
                    isWishlisted={true}
                    onCompare={handleToggleCompare}
                    isCompared={comparedProducts.some((c) => c.id === product.id)}
                    onQuickView={setActiveQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'checkout' && (
          <CheckoutForm
            cartItems={cartItems}
            subtotal={cartTotal}
            discount={appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.value) / 100 : appliedCoupon.value) : 0}
            activeCouponCode={appliedCoupon ? appliedCoupon.code : ''}
            whatsappNumber={settings.whatsappNumber}
            onOrderCompleted={handleOrderCompleted}
            onBackToCart={() => {
              setCurrentPage('shop');
              setIsCartOpen(true);
            }}
          />
        )}

        {currentPage === 'about' && (
          <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-emerald-600 text-xs font-bold tracking-widest uppercase font-mono">ESTABLISHED LOCAL BRAND</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">About SHAHMEER SHOP</h2>
              <p className="text-xs text-slate-400">Village Imzaiz Panhwar, Mirpurkhas, Sindh, Pakistan</p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm leading-relaxed text-sm text-slate-600 space-y-4">
              <p>
                Welcome to <strong>Shahmeer Shop</strong>, your ultimate premium local grocery and Kiryana destination in Sindh. We are deeply committed to supplying clean whole wheat flours, fresh soil-grown potatoes and red crispy onions, aromatic Mughal Basmati rice varieties, and Kenyan-sourced rich Tapal Chai leaves.
              </p>
              <p>
                As a local Pakistan retail store based in <strong>Village Imzaiz Panhwar (Mirpurkhas)</strong>, we understand that convenience matters most. This is why we have pioneered our <strong>WhatsApp ordering system</strong>. You can simply build your digital cart here, tap to open WhatsApp, and securely send your list to receive swift delivery at your village doorstep. No advanced accounts or electronic cards needed!
              </p>
              <h4 className="font-bold text-slate-800 pt-2 text-base">Developed by Kashif</h4>
              <p>
                This application represents a modern full-stack effort custom-built by Kashif to empower rural and localized grocery buyers with instantaneous pricing, coupon discounts, comparisons, and active order tracking. Thank you for choosing us!
              </p>
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Info (2 spans) */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Contact Us</h2>
                  <p className="text-xs text-slate-400 mt-1">Get fast support from our Mirpurkhas branch</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 flex gap-3 text-xs shadow-sm">
                    <Icon name="MapPin" size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">Our Address</span>
                      <span className="text-slate-500 leading-normal block mt-1">{settings.address}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-150 flex gap-3 text-xs shadow-sm">
                    <Icon name="Phone" size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">WhatsApp Helpline</span>
                      <span className="text-slate-500 block mt-1 font-mono">{settings.whatsappNumber}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-150 flex gap-3 text-xs shadow-sm">
                    <Icon name="Clock" size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">Store Hours</span>
                      <span className="text-slate-500 block mt-1">{settings.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form (3 spans) */}
              <div className="md:col-span-3">
                <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Send us a direct message</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sajid Panhwar"
                      className="w-full h-10 px-3.5 border border-slate-200 bg-slate-50 rounded-xl outline-none text-xs focus:bg-white focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Your Email / Phone</label>
                    <input
                      type="text"
                      name="email"
                      required
                      placeholder="e.g. 03192616627"
                      className="w-full h-10 px-3.5 border border-slate-200 bg-slate-50 rounded-xl outline-none text-xs focus:bg-white focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Your Message</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Ask about product availability, village delivery times, or wholesale rates..."
                      className="w-full p-3.5 border border-slate-200 bg-slate-50 rounded-xl outline-none text-xs focus:bg-white focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Submit Enquiry Form
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {currentPage === 'privacy' && (
          <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Privacy Policy</h2>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm leading-relaxed text-xs sm:text-sm text-slate-600 space-y-4">
              <p>Your privacy is strictly guarded. Shahmeer Shop operates 100% locally:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not share your name, phone number, address, or delivery village with third-party advertising companies.</li>
                <li>Your personal checkout info is encoded solely in your browser's local cache memory (LocalStorage) for persistent shopping cart access and status tracking.</li>
                <li>WhatsApp messages are protected by WhatsApp's native end-to-end encryption.</li>
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'terms' && (
          <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Terms & Conditions</h2>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm leading-relaxed text-xs sm:text-sm text-slate-600 space-y-4">
              <p>Please read these guidelines carefully before placing orders:</p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>All checkout rates are billed in Pakistani Rupees (PKR).</li>
                <li>Home deliveries inside Village Imzaiz Panhwar are settled via Cash on Delivery (COD) only, or prior WhatsApp bank settlement if discussed.</li>
                <li>Pricing may fluctuate slightly based on vegetable market wholesale prices in Mirpurkhas.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer */}
      <Footer
        settings={settings}
        categories={INITIAL_CATEGORIES}
        setCurrentPage={setCurrentPage}
        setSelectedCategory={setSelectedCategory}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* --- SIDE SHEETS / DRAWER OVERLAYS --- */}

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onIncrease={handleIncreaseQuantity}
        onDecrease={handleDecreaseQuantity}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        activeCouponCode={appliedCoupon ? appliedCoupon.code : ''}
        couponDiscountValue={appliedCoupon ? appliedCoupon.value : 0}
        couponDiscountType={appliedCoupon ? appliedCoupon.discountType : null}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={() => setAppliedCoupon(null)}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentPage('checkout');
        }}
      />

      {/* Product Detailed quick view modal */}
      <ProductDetailModal
        product={activeQuickViewProduct}
        onClose={() => setActiveQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleToggleWishlist}
        isWishlisted={activeQuickViewProduct ? wishlist.some((w) => w.id === activeQuickViewProduct.id) : false}
        relatedProducts={activeQuickViewProduct ? getRelatedProducts(activeQuickViewProduct) : []}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Compare Modal overlay */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={handleAddToCart}
      />

      {/* Order Tracking Modal overlay */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        getSavedOrder={getSavedOrder}
      />

      {/* Secret Password-Protected Admin Panel overlay */}
      {isAdminOpen && (
        <AdminPanel
          products={products}
          categories={INITIAL_CATEGORIES}
          orders={orders}
          settings={settings}
          coupons={INITIAL_COUPONS}
          onUpdateProducts={setProducts}
          onUpdateSettings={setSettings}
          onUpdateOrders={setOrders}
          onResetDefaults={handleResetDefaults}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}
