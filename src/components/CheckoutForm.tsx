import React, { useState } from 'react';
import { Icon } from './Icon';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  activeCouponCode: string;
  whatsappNumber: string;
  onOrderCompleted: (orderObj: any) => void;
  onBackToCart: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  subtotal,
  discount,
  activeCouponCode,
  whatsappNumber,
  onOrderCompleted,
  onBackToCart
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    village: 'Imzaiz Panhwar',
    city: 'Mirpurkhas',
    postalCode: '69000',
    notes: '',
    deliveryType: 'delivery' // 'delivery' | 'pickup'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Please fill all mandatory fields (Name, Phone, and Address).');
      return;
    }

    setLoading(true);

    const deliveryCharges = formData.deliveryType === 'pickup' || subtotal > 1500 ? 0 : 100;
    const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);
    const orderNumber = `SS-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const orderTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // 1. Build beautiful text message for WhatsApp
    let orderListText = '';
    cartItems.forEach((item, index) => {
      const price = item.product.discountPrice || item.product.price;
      const total = price * item.quantity;
      orderListText += `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x Rs. ${price.toLocaleString()} = Rs. ${total.toLocaleString()}\n`;
    });

    const messageText = `*====================================*
*          SHAHMEER SHOP             *
*====================================*
*Order Number:* #${orderNumber}
*Date:* ${orderDate} at ${orderTime}
*Delivery Type:* ${formData.deliveryType === 'delivery' ? 'Home Delivery (Cash on Delivery)' : 'Self-Store Pickup'}

*CUSTOMER INFO:*
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📍 *Village:* ${formData.village}
🌆 *City:* ${formData.city}
🏠 *Full Address:* ${formData.address}
📬 *Postal Code:* ${formData.postalCode}

*ORDERED ITEMS:*
${orderListText}
*BILL SUMMARY:*
Subtotal: Rs. ${subtotal.toLocaleString()}
${discount > 0 ? `Coupon Discount: Rs. ${discount.toLocaleString()} (${activeCouponCode})` : ''}
Delivery Charges: Rs. ${deliveryCharges}
--------------------------------------
*Grand Total:* *Rs. ${grandTotal.toLocaleString()}*

${formData.notes ? `*ADDITIONAL NOTES:*\n"${formData.notes}"` : ''}

_Order placed via Shahmeer Web App_
_Developed by Kashif_
*====================================*`;

    // 2. Open WhatsApp link in new tab
    const cleanNumber = whatsappNumber.replace('+', '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
    
    // Save order payload for localStorage simulation
    const orderObj = {
      id: orderNumber,
      orderNumber,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      village: formData.village,
      city: formData.city,
      postalCode: formData.postalCode,
      notes: formData.notes,
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
        unit: item.product.unit
      })),
      subtotal,
      discount,
      grandTotal,
      date: orderDate,
      time: orderTime,
      status: 'Pending'
    };

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onOrderCompleted(orderObj);
      setLoading(false);
    }, 800);
  };

  const deliveryCharges = formData.deliveryType === 'pickup' || subtotal > 1500 ? 0 : 100;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      
      {/* Title */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToCart}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors mr-2"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Complete WhatsApp Order</h2>
            <p className="text-xs text-slate-400 mt-1">Cash on Delivery &bull; Sent directly to local store agent</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase">
          <Icon name="Phone" size={12} className="animate-pulse" /> WhatsApp Checkout Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Column 1 - Billing Form Details (3 spans) */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-5">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
              <Icon name="User" size={16} className="text-emerald-500" /> Customer Delivery Information
            </h3>

            {/* Row 1 - Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sajid Panhwar"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">WhatsApp Phone Number <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 03192616627"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 2 - Delivery Type & Village */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Delivery Method</label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="delivery">Cash on Delivery (To Village)</option>
                  <option value="pickup">Self-Store Pickup (Zero Fee)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Village <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Village Imzaiz Panhwar"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 3 - City & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mirpurkhas"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="69000"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 4 - Full Delivery Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Street Address / Landmark <span className="text-rose-500">*</span></label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Write exact house details, near landmark or street name in Imzaiz village"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Row 5 - Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Additional Delivery Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Please bring delivery before 2 PM, or keep items in plastic bags"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>

          </div>

          {/* Quick Notice */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3 text-xs text-emerald-800 leading-relaxed">
            <Icon name="Info" className="shrink-0 text-emerald-600" size={16} />
            <div>
              <span className="font-bold">What happens next?</span> Clicking the "Send WhatsApp Order" button will prepare a beautifully detailed receipt summary and open WhatsApp chat. Simply click send in WhatsApp to submit your cart list. Safe, secure, and hassle-free.
            </div>
          </div>
        </form>

        {/* Column 2 - Order Summary Card (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 sticky top-24 space-y-5">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-50 pb-3">
              Order Summary
            </h3>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex items-center gap-3 text-xs justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-700 truncate leading-none">{item.product.name}</h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">{item.quantity} x {item.product.unit}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800 shrink-0">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-700">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Code:</span>
                  <span className="font-mono">- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-mono font-bold text-slate-700">
                  {deliveryCharges === 0 ? 'Rs. 0 (Free)' : `Rs. ${deliveryCharges}`}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-150 text-slate-800 font-black text-sm">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-600 text-lg">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Complete Button Trigger */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:bg-emerald-300"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icon name="RefreshCw" size={15} className="animate-spin" /> Preparing Receipt...
                </span>
              ) : (
                <>
                  <Icon name="Phone" size={16} /> Place WhatsApp Order
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default CheckoutForm;
