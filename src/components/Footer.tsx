import React, { useState } from 'react';
import { Icon } from './Icon';
import { StoreSettings, Category } from '../types';

interface FooterProps {
  settings: StoreSettings;
  categories: Category[];
  setCurrentPage: (page: string) => void;
  setSelectedCategory: (category: string) => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  setCurrentPage,
  setSelectedCategory,
  onAdminClick
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper Part - Newsletter & Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-emerald-500">🌿</span> Shahmeer Fresh Club
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Subscribe to get notified about fresh vegetable arrivals, flash sales, and exclusive coupons for Village Imzaiz Panhwar & Mirpurkhas.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 pr-32 rounded-full bg-slate-800 text-white text-sm outline-none border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold tracking-wide transition-all uppercase"
              >
                {subscribed ? 'Subscribed!' : 'Join Now'}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                <Icon name="CheckCircle" size={12} /> Congratulations! You have joined the Fresh Club.
              </p>
            )}
          </div>
        </div>

        {/* Middle Part - Grid links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          
          {/* Column 1 - About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                <Icon name="Store" size={18} />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">{settings.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 transition-all duration-300"
                title="Order on WhatsApp"
              >
                <Icon name="Phone" size={16} />
              </a>
              <span className="text-xs text-slate-400">Order Hotline: <span className="text-white font-mono">{settings.whatsappNumber}</span></span>
            </div>
          </div>

          {/* Column 2 - Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="hover:text-emerald-400 hover:underline transition-all text-left"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="text-emerald-400 hover:underline hover:text-emerald-300 font-medium text-left"
                >
                  View All Categories &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Information</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-emerald-400 transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-emerald-400 transition-colors text-left">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('privacy')} className="hover:text-emerald-400 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('terms')} className="hover:text-emerald-400 transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Store Location Map <Icon name="ExternalLink" size={10} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Store</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex gap-2.5">
                <Icon name="MapPin" className="text-emerald-400 shrink-0" size={14} />
                <span className="leading-relaxed text-slate-400">
                  {settings.address}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="Clock" className="text-emerald-400 shrink-0" size={14} />
                <span className="text-slate-400">
                  {settings.openingHours}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="Shield" className="text-emerald-400 shrink-0" size={14} />
                <span className="text-slate-400">
                  100% Cash On Delivery or WhatsApp Bill Settlement
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Part - Copyright & Secret Admin Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-800/80 text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>{settings.footerText}</span>
            {/* Subtle dot to trigger admin panel secret url */}
            <button 
              onClick={onAdminClick}
              className="h-2 w-2 rounded-full bg-slate-800 hover:bg-emerald-500/40 transition-colors focus:outline-none"
              title="Admin Portal"
            ></button>
          </div>
        </div>

      </div>
    </footer>
  );
};
