import React from 'react';
import { Product } from '../types';
import { Icon } from './Icon';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemove: (productId: string) => void;
  onAddToCart: (p: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemove,
  onAddToCart
}) => {
  if (!isOpen) return null;

  // Compile all unique specification keys across all compared products
  const specKeys: string[] = Array.from(
    new Set(
      comparedProducts.flatMap((p) => Object.keys(p.specifications))
    )
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Backdrop closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Container */}
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-2 rounded-xl">
              <Icon name="ArrowLeftRight" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-none">Compare Products</h3>
              <span className="text-[10px] text-slate-400 mt-1 block">Analyze specifications, sizes, and pricing side-by-side</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Icon name="ArrowLeftRight" size={24} />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">No products selected to compare</h4>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
              Go to the Shop and click the double-arrow icon on any card to select for comparison.
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-colors"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-50 border border-slate-100 text-left text-xs font-bold uppercase text-slate-400 tracking-wider rounded-tl-2xl">
                    Features
                  </th>
                  {comparedProducts.map((p, idx) => (
                    <th 
                      key={p.id} 
                      className={`p-3 bg-slate-50 border border-slate-100 text-center relative ${idx === comparedProducts.length - 1 ? 'rounded-tr-2xl' : ''}`}
                    >
                      {/* Delete Shortcut */}
                      <button 
                        onClick={() => onRemove(p.id)}
                        className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="Remove from comparison"
                      >
                        <Icon name="X" size={14} />
                      </button>

                      <div className="flex flex-col items-center space-y-2 pt-2">
                        <img src={p.image} alt={p.name} className="h-16 w-16 object-cover rounded-xl bg-white border border-slate-100 shadow-sm" />
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-2 max-w-[150px] leading-snug">{p.name}</h4>
                        <span className="text-xs font-black text-emerald-600 font-mono">Rs. {p.price.toLocaleString()}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Brand */}
                <tr>
                  <td className="p-3 border border-slate-100 font-bold text-xs text-slate-500 uppercase bg-slate-50/50">
                    Brand
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border border-slate-100 text-center text-xs font-semibold text-slate-700">
                      {p.brand}
                    </td>
                  ))}
                </tr>

                {/* Size/Unit */}
                <tr>
                  <td className="p-3 border border-slate-100 font-bold text-xs text-slate-500 uppercase bg-slate-50/50">
                    Unit size
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border border-slate-100 text-center text-xs font-mono text-slate-600">
                      {p.unit}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-3 border border-slate-100 font-bold text-xs text-slate-500 uppercase bg-slate-50/50">
                    Rating
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border border-slate-100 text-center text-xs text-slate-700 font-bold">
                      <span className="flex items-center justify-center gap-1 text-amber-500">
                        <Icon name="Star" size={12} className="fill-amber-500" /> {p.rating}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr>
                  <td className="p-3 border border-slate-100 font-bold text-xs text-slate-500 uppercase bg-slate-50/50">
                    Stock Availability
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border border-slate-100 text-center text-xs font-semibold">
                      {p.stock > 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">In Stock</span>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 font-bold">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Custom Specs Rows */}
                {specKeys.map((key) => (
                  <tr key={key}>
                    <td className="p-3 border border-slate-100 font-bold text-xs text-slate-500 uppercase bg-slate-50/50">
                      {key}
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 border border-slate-100 text-center text-xs text-slate-600">
                        {p.specifications[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Quick Add To Cart Actions */}
                <tr className="bg-slate-50/30">
                  <td className="p-3 border border-slate-100 font-bold text-xs text-slate-400 uppercase">
                    Quick Action
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 border border-slate-100 text-center">
                      {p.stock > 0 ? (
                        <button
                          onClick={() => { onAddToCart(p); onClose(); }}
                          className="h-8 px-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors flex items-center justify-center mx-auto gap-1"
                        >
                          <Icon name="ShoppingCart" size={11} /> Add To Cart
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold italic">Not available</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default CompareModal;
