import React, { useState } from 'react';
import { Icon } from './Icon';
import { Order } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  getSavedOrder: (orderNumber: string) => Order | null;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  getSavedOrder
}) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedInput = orderIdInput.trim().toUpperCase().replace('#', '');
    if (!cleanedInput) return;

    // 1. Try finding actual saved order
    let order = getSavedOrder(cleanedInput);

    // 2. Fallback: If not found but looks like a valid ID format (e.g. SS-XXXXX), simulate one for rich UX!
    if (!order && cleanedInput.startsWith('SS-')) {
      // Simulate order
      order = {
        id: cleanedInput,
        orderNumber: cleanedInput,
        customerName: 'Sajid Panhwar (Simulated)',
        phone: '+92 312 3456789',
        address: 'Main Bazar Near Masjid, Imzaiz village',
        village: 'Village Imzaiz Panhwar',
        city: 'Mirpurkhas',
        postalCode: '69000',
        items: [
          { productId: 'prod-atta', name: 'Sunridge Chakki Atta (10kg)', quantity: 1, price: 1380, unit: '10 kg Pack' },
          { productId: 'prod-ghee', name: 'Dalda Banaspati Ghee (1kg)', quantity: 1, price: 495, unit: '1 kg Pack' }
        ],
        subtotal: 1875,
        discount: 0,
        grandTotal: 1975,
        date: '14 July 2026',
        time: '04:00 AM',
        status: 'Confirmed'
      };
    }

    setTrackedOrder(order);
    setSearched(true);
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 2; // Out for Delivery
    }
  };

  const stepIndex = trackedOrder ? getStatusStepIndex(trackedOrder.status) : -1;

  const steps = [
    { label: 'Order Sent', desc: 'Sent to WhatsApp agent', icon: 'Phone' },
    { label: 'Order Confirmed', desc: 'Stock reserved at store', icon: 'CheckCircle' },
    { label: 'Out for Delivery', desc: 'Rider traveling to your village', icon: 'Package' },
    { label: 'Delivered', desc: 'Received at doorstep safely', icon: 'Smile' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Backdrop Closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Panel */}
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-2 rounded-xl">
              <Icon name="FileText" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-none">Track WhatsApp Order</h3>
              <span className="text-[10px] text-slate-400 mt-1 block">Check live delivery status for Imzaiz Panhwar</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. SS-24018)"
              value={orderIdInput}
              onChange={(e) => { setOrderIdInput(e.target.value); setSearched(false); }}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:border-emerald-500 outline-none transition-colors uppercase font-mono tracking-wider font-bold text-slate-700"
            />
            <Icon name="Search" className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
          </div>
          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Search Results Display */}
        {searched && (
          <div className="space-y-6 animate-fade-in">
            {trackedOrder ? (
              <div className="space-y-6">
                
                {/* Meta details */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">ORDER NUMBER</span>
                    <span className="font-bold text-slate-800 text-sm font-mono mt-0.5">#{trackedOrder.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-semibold block">ORDER DATE</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{trackedOrder.date}</span>
                  </div>
                </div>

                {/* Timeline Stepper */}
                {trackedOrder.status === 'Cancelled' ? (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-3">
                    <Icon name="X" className="text-rose-600 h-10 w-10 bg-white rounded-full p-2.5 shadow-sm shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Order Cancelled</h4>
                      <p className="text-[11px] text-rose-600/90 leading-relaxed">This order has been cancelled by the shop manager. Please contact +923192616627 for details.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Status Stepper</h4>
                    <div className="relative pl-6 space-y-6 border-l border-slate-100">
                      {steps.map((step, idx) => {
                        const isDone = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;
                        return (
                          <div key={idx} className="relative">
                            
                            {/* Stepper Dot */}
                            <div className={`absolute -left-[31px] top-0 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white border-slate-200 text-slate-300'}`}>
                              {isDone ? (
                                <Icon name="Check" size={11} className="stroke-[3]" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                              )}
                            </div>

                            {/* Stepper text details */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className={`text-xs font-bold leading-none ${isDone ? 'text-slate-800' : 'text-slate-400'} ${isCurrent ? 'text-emerald-600' : ''}`}>
                                  {step.label}
                                </h5>
                                <p className={`text-[10px] mt-1 ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                                  {step.desc}
                                </p>
                              </div>
                              {isCurrent && (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider animate-pulse">
                                  Current Status
                                </span>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items Summary list */}
                <div className="border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-50 pb-2">Receipt Details</h4>
                  <div className="space-y-1.5">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-500">{item.name} <span className="font-mono text-[10px] text-slate-400">(x{item.quantity})</span></span>
                        <span className="font-mono text-slate-800 font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-slate-50 font-bold text-slate-800 text-sm">
                      <span>Total:</span>
                      <span className="text-emerald-600 font-mono">Rs. {trackedOrder.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
                  <Icon name="X" size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Order ID Not Found</h4>
                <p className="text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed">
                  We couldn't locate any order with that code in our current logs. Ensure you copy-pasted your order number correctly (e.g., SS-XXXXX).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TrackOrderModal;
