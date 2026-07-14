import React from 'react';
import { Product } from '../types';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onCompare: (p: Product) => void;
  isCompared: boolean;
  onQuickView: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onCompare,
  isCompared,
  onQuickView
}) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const originalPrice = product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const savings = hasDiscount ? originalPrice - currentPrice : 0;
  const savingsPercent = hasDiscount ? Math.round((savings / originalPrice) * 100) : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-300 overflow-hidden"
    >
      {/* Badges Column */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="bg-rose-500 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            SAVE {savingsPercent}%
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-amber-500 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Icon name="Zap" size={10} className="fill-white" /> FLASH SALE
          </span>
        )}
        {product.isNew && (
          <span className="bg-emerald-500 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            NEW
          </span>
        )}
      </div>

      {/* Floating Action Circle Buttons */}
      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist(product)}
          className={`h-9 w-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-105 ${isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Icon name="Heart" size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
        </button>

        {/* Compare Button */}
        <button
          onClick={() => onCompare(product)}
          className={`h-9 w-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-105 ${isCompared ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}
          title={isCompared ? 'Compare product' : 'Compare product'}
        >
          <Icon name="ArrowLeftRight" size={14} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="h-9 w-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all hover:scale-105"
          title="Product Details"
        >
          <Icon name="Eye" size={14} />
        </button>
      </div>

      {/* Product Image Area */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative pt-[100%] bg-slate-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500 tracking-wider bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wide uppercase">{product.brand}</span>
            {product.stock > 0 && product.stock <= 5 ? (
              <span className="text-amber-600 font-bold">Only {product.stock} left</span>
            ) : product.stock > 5 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
              </span>
            ) : null}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[38px]"
          >
            {product.name}
          </h3>

          {/* Unit Description & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px]">
              {product.unit}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500">
              <Icon name="Star" size={12} className="fill-amber-500" />
              <span className="font-bold text-[11px] text-slate-700">{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add Button row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through font-mono">
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-base font-black text-slate-800 font-mono">
              Rs. {currentPrice.toLocaleString()}
            </span>
          </div>

          {/* Add To Cart or Out Of Stock */}
          {product.stock > 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="h-9 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-100 hover:border-emerald-500 font-bold text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              <Icon name="Plus" size={13} />
              <span>Add</span>
            </button>
          ) : (
            <button
              disabled
              className="h-9 px-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200 cursor-not-allowed"
            >
              No Stock
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default ProductCard;
