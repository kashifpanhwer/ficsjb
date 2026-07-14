import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Category } from '../types';

interface HeroProps {
  categories: Category[];
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: string) => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  bgColor: string;
  accentText: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Fresh Vegetables & Organic Produce',
    subtitle: 'Directly sourced from the lush farms of Sindh. Crispy, clean, and delivered fresh to your kitchen.',
    badge: '100% FARM FRESH',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
    bgColor: 'from-emerald-900/90 to-slate-900/95',
    accentText: 'text-emerald-400'
  },
  {
    id: 2,
    title: 'Premium Kitchen Ration & Ghee',
    subtitle: 'Sunridge Whole Wheat Atta, Dalda Ghee, Mughal Kernel Basmati, & Premium Tapal Chai leaves.',
    badge: 'MONTHLY KITCHEN STOCK',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    bgColor: 'from-amber-900/90 to-slate-900/95',
    accentText: 'text-amber-400'
  },
  {
    id: 3,
    title: 'Super-Fast Village WhatsApp Delivery',
    subtitle: 'No complex logins. Just select items, build your cart, and send order on WhatsApp to receive at your doorstep.',
    badge: 'DELIVERY IN IMZAIZ PANHWAR',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1000&auto=format&fit=crop&q=80',
    bgColor: 'from-emerald-950/90 to-slate-900/95',
    accentText: 'text-teal-400'
  }
];

export const Hero: React.FC<HeroProps> = ({
  categories,
  setSelectedCategory,
  setCurrentPage
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage('shop');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleShopNowClick = () => {
    setSelectedCategory('all');
    setCurrentPage('shop');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      {/* Slider Hero */}
      <div className="relative h-[480px] sm:h-[520px] md:h-[580px] w-full flex items-center">
        {/* Background Image with animated transition */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-slate-950/40 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} z-10`} />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-left space-y-6">
            
            {/* Animated Slide Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-emerald-300 uppercase font-mono">
                {HERO_SLIDES[currentSlide].badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight transition-all duration-500">
              {HERO_SLIDES[currentSlide].title.split('&')[0]} 
              {HERO_SLIDES[currentSlide].title.includes('&') && (
                <>
                  <span className={HERO_SLIDES[currentSlide].accentText}>
                    & {HERO_SLIDES[currentSlide].title.split('&')[1]}
                  </span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-light">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleShopNowClick}
                className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/50 transition-all duration-300 hover:scale-[1.02]"
              >
                Start Shopping Now
                <Icon name="ChevronRight" className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
              
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white font-semibold text-sm px-5 py-3.5 rounded-full transition-all duration-300"
              >
                <Icon name="Phone" size={15} /> WhatsApp Contact
              </button>
            </div>

          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-emerald-500' : 'w-2.5 bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories Quick Selection row */}
      <div className="bg-slate-900 border-t border-slate-800/80 py-8 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold tracking-widest text-emerald-400 uppercase font-mono mb-4">
            Browse Featured Kitchen Categories
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all">
                  <Icon name={category.icon} size={20} />
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white mt-3 text-center truncate w-full">
                  {category.name.split(' ')[0]}
                  {category.name.split(' ').slice(1).join(' ') && (
                    <span className="block font-normal text-slate-400 group-hover:text-emerald-400 text-[9px] mt-0.5">
                      {category.name.split(' ').slice(1).join(' ')}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
