import React, { useState } from 'react';
import { Product } from '../types';
import { Icon } from './Icon';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  isWishlisted: boolean;
  relatedProducts: Product[];
  whatsappNumber: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  relatedProducts,
  whatsappNumber
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)' });
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const originalPrice = product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const totalCost = currentPrice * qty;
  const savings = hasDiscount ? originalPrice - currentPrice : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  const handleSendWhatsAppQuickOrder = () => {
    const cleanNumber = whatsappNumber.replace('+', '');
    const messageText = `Assalam-o-Alaikum Shahmeer Shop! 🌿\n\nI want to place a quick order for this product from your website:\n\n*Product:* ${product.name}\n*Unit:* ${product.unit}\n*SKU:* ${product.sku}\n*Quantity:* ${qty}\n*Price per Unit:* Rs. ${currentPrice.toLocaleString()}\n*Total Amount:* Rs. ${totalCost.toLocaleString()}\n\nPlease deliver this to my address. Thank you!`;
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
        >
          <Icon name="X" size={20} />
        </button>

        {/* Product Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Column 1 - Interactive Zoom Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden cursor-crosshair border border-slate-100"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.image}
                alt={product.name}
                style={zoomStyle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-75 ease-out"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/40 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm pointer-events-none uppercase">
                <Icon name="Search" size={10} /> Hover to zoom
              </div>
            </div>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                SKU: {product.sku}
              </span>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                Barcode: {product.barcode}
              </span>
            </div>
          </div>

          {/* Column 2 - Product Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                <span>{product.category.replace('-', ' ')}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Icon name="Star" size={14} className="fill-amber-500" />
                  <span className="font-black text-slate-700">{product.rating} (Verified rating)</span>
                </div>
              </div>

              {/* Title & Brand */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-400 font-medium">Brand: <span className="text-slate-700 font-semibold">{product.brand}</span></p>
              </div>

              {/* Pricing details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Unit price ({product.unit})</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-800 font-mono">
                      Rs. {currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold font-mono text-xs px-3 py-1.5 rounded-full">
                    Save Rs. {savings.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    In Stock ({product.stock} items remaining)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase">
                    Out of Stock
                  </span>
                )}
              </div>

            </div>

            {/* Quantity Selector & Action row */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              
              {product.stock > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-700">Select Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 px-3 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="px-4 font-bold text-sm font-mono text-slate-800">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="p-2 px-3 text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.stock > 0 ? (
                  <>
                    {/* Add to Cart */}
                    <button
                      onClick={() => {
                        for (let i = 0; i < qty; i++) {
                          onAddToCart(product);
                        }
                        onClose();
                      }}
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      <Icon name="ShoppingCart" size={16} /> Add to Cart
                    </button>

                    {/* Direct WhatsApp Order */}
                    <button
                      onClick={handleSendWhatsAppQuickOrder}
                      className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border border-emerald-400"
                    >
                      <Icon name="Phone" size={16} /> Buy on WhatsApp
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="col-span-2 w-full h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-sm"
                  >
                    Out of Stock - Send WhatsApp message to enquire
                  </button>
                )}
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => onAddToWishlist(product)}
                className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'}`}
              >
                <Icon name="Heart" size={14} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Tab Layout for detailed descriptions, specifications, reviews */}
        <div className="border-t border-slate-100">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex-1 py-4 text-center font-bold text-sm border-b-2 transition-colors ${activeTab === 'desc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-4 text-center font-bold text-sm border-b-2 transition-colors ${activeTab === 'specs' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-center font-bold text-sm border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Customer Reviews
            </button>
          </div>

          <div className="p-6 sm:p-8 text-sm text-slate-600 leading-relaxed min-h-[150px]">
            {activeTab === 'desc' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-500 mt-4">
                  <li>Premium premium grade {product.name} ready for kitchen use.</li>
                  <li>Sourced under strict food standards from verified local partners.</li>
                  <li>Freshly packed to preserve high nutrient density and optimal flavor.</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-3 text-xs sm:text-sm">
                    <span className="font-bold text-slate-500 col-span-1">{key}</span>
                    <span className="text-slate-800 col-span-2 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-slate-800">4.8</div>
                  <div className="flex flex-col">
                    <div className="flex text-amber-500"><Icon name="Star" size={13} className="fill-amber-500" /><Icon name="Star" size={13} className="fill-amber-500" /><Icon name="Star" size={13} className="fill-amber-500" /><Icon name="Star" size={13} className="fill-amber-500" /><Icon name="Star" size={13} className="fill-amber-500" /></div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Based on local buyers</span>
                  </div>
                </div>
                <div className="space-y-3 divide-y divide-slate-100 pt-3">
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">Sajid Panhwar</span>
                      <span className="text-slate-400">Verified Buyer</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">"Rates are very reasonable. Sunridge atta and ghee was high quality and packed properly."</p>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">Asif Ali</span>
                      <span className="text-slate-400">Verified Buyer</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">"The red onions and potatoes were very fresh. Excellent service in Imzaiz village."</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products carousel section */}
        {relatedProducts.length > 0 && (
          <div className="bg-slate-50 p-6 sm:p-8 rounded-b-3xl border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Related Products You Might Need
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((relProduct) => (
                <div 
                  key={relProduct.id}
                  onClick={() => {
                    // Quick viewed related
                    setQty(1);
                    setActiveTab('desc');
                    // Simple hacky way to switch modal product
                    product.id = relProduct.id;
                    Object.assign(product, relProduct);
                  }}
                  className="bg-white p-3 rounded-2xl border border-slate-150 hover:border-emerald-500/20 shadow-sm hover:shadow transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group"
                >
                  <div className="relative pt-[100%] rounded-xl overflow-hidden bg-slate-50 mb-2">
                    <img src={relProduct.image} alt={relProduct.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">{relProduct.name}</h5>
                    <span className="text-xs font-black text-slate-700 font-mono block mt-1">Rs. {relProduct.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default ProductDetailModal;
