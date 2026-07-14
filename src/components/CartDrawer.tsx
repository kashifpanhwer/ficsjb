import React, { useState } from 'react';
import { Icon } from './Icon';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  activeCouponCode: string;
  couponDiscountValue: number;
  couponDiscountType: 'percentage' | 'fixed' | null;
  onApplyCoupon: (code: string) => boolean; // returns true if coupon applied
  onRemoveCoupon: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  activeCouponCode,
  couponDiscountValue,
  couponDiscountType,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  let discount = 0;
  if (couponDiscountType === 'percentage') {
    discount = (subtotal * couponDiscountValue) / 100;
  } else if (couponDiscountType === 'fixed') {
    discount = couponDiscountValue;
  }

  const deliveryCharges = subtotal > 1500 || subtotal === 0 ? 0 : 100; // Free delivery above Rs. 1500
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponSuccess(true);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code or minimum spend not met.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      {/* Backdrop trigger close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Cart Drawer Panel */}
      <div 
        id="cart-drawer-panel"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-2 rounded-xl">
              <Icon name="ShoppingCart" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-none">Your Shopping Cart</h3>
              <span className="text-[10px] font-medium text-slate-500 block mt-1">{cartItems.length} unique items selected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button 
                onClick={onClear}
                className="text-xs font-semibold text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title="Clear Cart"
              >
                <Icon name="Trash2" size={13} /> Clear
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Content Items Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-pulse">
                <Icon name="ShoppingCart" size={32} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-[250px] mx-auto mt-1">
                  Add premium Pakistani groceries and fresh farm produce to start ordering.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-all"
              >
                Continue Shopping &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {cartItems.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                const itemTotal = price * item.quantity;
                return (
                  <div 
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-150 rounded-2xl hover:border-emerald-500/10 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.product.unit} &bull; Rs. {price.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <button 
                          onClick={() => onDecrease(item.product.id)}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-xs"
                        >
                          <Icon name="Minus" size={11} />
                        </button>
                        <span className="font-bold text-xs text-slate-700 w-5 text-center font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => onIncrease(item.product.id)}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-xs"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Icon name="Plus" size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-bold text-xs text-slate-800 font-mono">Rs. {itemTotal.toLocaleString()}</span>
                      <button 
                        onClick={() => onRemove(item.product.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="Remove product"
                      >
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Billing Area */}
        {cartItems.length > 0 && (
          <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-100 space-y-4">
            
            {/* Coupon Application Row */}
            {!activeCouponCode ? (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="COUPON (e.g. RAMADAN50)"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                  className="flex-1 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-500 transition-colors uppercase font-mono tracking-wider"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="bg-emerald-100/60 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Icon name="Percent" size={12} className="text-emerald-600 animate-bounce" />
                  <span>Coupon Applied: <span className="font-mono bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 uppercase font-bold">{activeCouponCode}</span></span>
                </div>
                <button 
                  onClick={onRemoveCoupon}
                  className="text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors flex items-center gap-0.5"
                >
                  <Icon name="X" size={11} /> Remove
                </button>
              </div>
            )}
            {couponError && <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold">Coupon applied successfully!</p>}

            {/* Bill Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-700">Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount:</span>
                  <span className="font-mono font-bold">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Delivery Charges:
                  {subtotal > 1500 && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[8px] uppercase">Free</span>
                  )}
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {deliveryCharges === 0 ? 'Rs. 0' : `Rs. ${deliveryCharges}`}
                </span>
              </div>

              {subtotal > 0 && subtotal <= 1500 && (
                <p className="text-[9px] text-slate-400 italic text-right">Add Rs. {(1500 - subtotal).toLocaleString()} more for FREE delivery!</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-800 font-bold text-sm">
                <span>Grand Total:</span>
                <span className="font-mono font-black text-emerald-600 text-base">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] hover:shadow-emerald-200"
            >
              <Icon name="Phone" size={16} /> Proceed to WhatsApp Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
