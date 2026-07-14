import React, { useState } from 'react';
import { Icon } from './Icon';
import { StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onOpenCompare: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  onLogoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentPage,
  setCurrentPage,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  onOpenCart,
  onOpenTrackOrder,
  onOpenCompare,
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
  onLogoClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentPage !== 'shop') {
      setCurrentPage('shop');
    }
  };

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    if (page === 'shop') {
      setSelectedCategory('all');
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-emerald-50 bg-white/90 backdrop-blur-md transition-all duration-300">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center py-1 px-4 text-xs font-medium tracking-wide flex items-center justify-between">
        <div className="mx-auto flex items-center gap-2">
          <Icon name="Megaphone" size={12} className="animate-bounce" />
          <span>Alhamdulillah! High Quality Grocery & Fresh Vegetables in Mirpurkhas. Order on WhatsApp!</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
          <span className="flex items-center gap-1"><Icon name="Clock" size={11} /> {settings.openingHours.split('(')[0]}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div 
            id="navbar-logo"
            onClick={onLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-emerald-500 to-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-200 transition-all group-hover:scale-105">
              <Icon name="Store" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-none">
                {settings.storeName}
              </h1>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold uppercase tracking-wider block mt-0.5">
                Kiryana & Fresh Veg
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search sugar, wheat, tapal tea, fresh onions..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 outline-none placeholder:text-slate-400"
            />
            <Icon name="Search" className="absolute left-3.5 top-3 text-slate-400" size={15} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigateToPage('home')}
              className={`hover:text-emerald-600 transition-colors py-2 ${currentPage === 'home' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => navigateToPage('shop')}
              className={`hover:text-emerald-600 transition-colors py-2 ${currentPage === 'shop' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Shop
            </button>
            <button
              onClick={() => navigateToPage('about')}
              className={`hover:text-emerald-600 transition-colors py-2 ${currentPage === 'about' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => navigateToPage('contact')}
              className={`hover:text-emerald-600 transition-colors py-2 ${currentPage === 'contact' ? 'text-emerald-600 border-b-2 border-emerald-500' : ''}`}
            >
              Contact
            </button>
            <button
              onClick={onOpenTrackOrder}
              className="hover:text-emerald-600 transition-colors py-2 flex items-center gap-1"
            >
              <Icon name="FileText" size={14} />
              Track Order
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name={showSearchMobile ? "X" : "Search"} size={18} />
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
              title="Compare Products"
            >
              <Icon name="ArrowLeftRight" size={18} />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigateToPage('wishlist')}
              className="relative p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50/50 rounded-full transition-all"
              title="Wishlist"
            >
              <Icon name="Heart" size={18} className={currentPage === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white px-3 py-2 rounded-full hover:shadow-lg hover:shadow-emerald-100 transition-all scale-95 sm:scale-100"
            >
              <div className="relative">
                <Icon name="ShoppingCart" size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-black text-slate-800 ring-1 ring-emerald-500">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name={mobileMenuOpen ? "X" : "Sliders"} size={20} />
            </button>
          </div>

        </div>

        {/* Mobile Search Expandable */}
        {showSearchMobile && (
          <div className="md:hidden pb-3 pt-1 px-1 relative">
            <input
              type="text"
              placeholder="Search grocery items..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 transition-all outline-none"
            />
            <Icon name="Search" className="absolute left-4 top-4.5 text-slate-400" size={15} />
          </div>
        )}
      </div>

      {/* Mobile Sidebar Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white p-6 shadow-xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                    <Icon name="Store" size={18} />
                  </div>
                  <span className="font-bold text-slate-800">{settings.storeName}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Icon name="X" size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigateToPage('home')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPage === 'home' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon name="Home" size={16} /> Home
                </button>
                <button
                  onClick={() => navigateToPage('shop')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPage === 'shop' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon name="Store" size={16} /> Shop Products
                </button>
                <button
                  onClick={() => navigateToPage('wishlist')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPage === 'wishlist' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon name="Heart" size={16} /> Wishlist
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenTrackOrder(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left"
                >
                  <Icon name="FileText" size={16} /> Track Order
                </button>
                <button
                  onClick={() => navigateToPage('about')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPage === 'about' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon name="Info" size={16} /> About Shahmeer Shop
                </button>
                <button
                  onClick={() => navigateToPage('contact')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPage === 'contact' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon name="Phone" size={16} /> Contact Us
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} className="text-emerald-600" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-emerald-600" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="pt-2 text-center text-[11px] border-t border-slate-50">
                Developed by Kashif
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
