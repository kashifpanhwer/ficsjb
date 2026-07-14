import React, { useState } from 'react';
import { Product, Category, Order, StoreSettings, Coupon } from '../types';
import { Icon } from './Icon';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  coupons: Coupon[];
  onUpdateProducts: (p: Product[]) => void;
  onUpdateSettings: (s: StoreSettings) => void;
  onUpdateOrders: (o: Order[]) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  orders,
  settings,
  coupons,
  onUpdateProducts,
  onUpdateSettings,
  onUpdateOrders,
  onResetDefaults,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('shahmeer_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'backup'>('overview');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    description: '',
    category: 'atta-ghee-oil',
    price: 0,
    discountPrice: undefined,
    stock: 0,
    image: '',
    unit: '',
    brand: '',
    sku: '',
    barcode: '',
    rating: 4.5,
    specifications: {}
  });

  // Settings form states
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('shahmeer_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect Password! Authorized access only.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shahmeer_admin_auth');
  };

  // Status Colors Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  // Update order status
  const handleOrderStatusChange = (orderId: string, newStatus: any) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
  };

  // Product CRUD functions
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || !productForm.price) {
      alert('Please fill mandatory fields (Name, SKU, Price)');
      return;
    }

    if (isAddingProduct) {
      const newProduct: Product = {
        ...(productForm as Product),
        id: `prod-${Date.now()}`,
        rating: 4.5,
        specifications: productForm.specifications || {
          'Origin': 'Pakistan',
          'Storage Instruction': 'Store in dry place'
        }
      };
      onUpdateProducts([newProduct, ...products]);
      setIsAddingProduct(false);
    } else if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as Product : p);
      onUpdateProducts(updated);
      setEditingProduct(null);
    }

    // Reset Form
    setProductForm({
      id: '',
      name: '',
      description: '',
      category: 'atta-ghee-oil',
      price: 0,
      discountPrice: undefined,
      stock: 0,
      image: '',
      unit: '',
      brand: '',
      sku: '',
      barcode: '',
      rating: 4.5,
      specifications: {}
    });
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsAddingProduct(false);
  };

  const handleStartAdd = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductForm({
      id: '',
      name: '',
      description: '',
      category: 'atta-ghee-oil',
      price: 100,
      discountPrice: undefined,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      unit: '1 kg',
      brand: 'Local',
      sku: `SKU-NEW-${Math.floor(100 + Math.random() * 900)}`,
      barcode: `8964000${Math.floor(100000 + Math.random() * 900000)}`,
      rating: 4.5,
      specifications: {
        'Origin': 'Pakistan',
        'Storage Instruction': 'Store in dry place'
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    alert('Store configurations updated successfully!');
  };

  // Backup and Restore JSON functions
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      products,
      orders,
      settings,
      coupons,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shahmeer_shop_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && parsed.settings) {
          onUpdateProducts(parsed.products);
          onUpdateSettings(parsed.settings);
          if (parsed.orders) onUpdateOrders(parsed.orders);
          alert('Backup data successfully restored! Website re-synchronized.');
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse file. Ensure it is a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Calculate statistics
  const totalSales = orders.reduce((sum, o) => o.status === 'Delivered' || o.status === 'Confirmed' ? sum + o.grandTotal : sum, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Render Login state
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-200">
              <Icon name="LockKeyhole" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Admin Control Panel</h3>
            <p className="text-xs text-slate-400">Enter password to authenticate secure dashboard session</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Secure Password</label>
              <input
                type="password"
                placeholder="Enter password (default: admin)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm outline-none focus:border-emerald-500 transition-colors"
                autoFocus
              />
            </div>
            {authError && <p className="text-xs text-rose-500 font-bold">{authError}</p>}

            <button
              type="submit"
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
            >
              Sign In to Dashboard
            </button>
          </form>

          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto flex">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 text-white p-2 rounded-xl">
              <Icon name="LockKeyholeOpen" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm leading-none">Admin Station</h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-1">Status: Authorized</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${activeTab === 'overview' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon name="LayoutDashboard" size={15} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${activeTab === 'products' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon name="Package" size={15} /> Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${activeTab === 'orders' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon name="FileText" size={15} /> Orders ({orders.length})
              {activeOrdersCount > 0 && (
                <span className="bg-yellow-400 text-slate-900 font-black px-1.5 py-0.5 rounded text-[9px] ml-auto">
                  {activeOrdersCount} New
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${activeTab === 'settings' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon name="Settings" size={15} /> Store Settings
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${activeTab === 'backup' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              <Icon name="FileJson" size={15} /> Backup & Sync
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={onResetDefaults}
            className="w-full h-10 border border-slate-800 hover:bg-slate-800 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Icon name="RefreshCw" size={13} /> Factory Reset
          </button>
          <button
            onClick={handleLogout}
            className="w-full h-10 bg-slate-800 hover:bg-rose-900 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Icon name="LogOut" size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between">
        
        {/* Header toolbar */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'products' && 'Products Database'}
                {activeTab === 'orders' && 'WhatsApp Orders Feed'}
                {activeTab === 'settings' && 'Store Configuration'}
                {activeTab === 'backup' && 'Database Sync & JSON Control'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Authorized Store Manager Control panel for Imzaiz Panhwar village</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile back trigger */}
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-slate-100"
              >
                <Icon name="Store" size={14} /> View Storefront
              </button>
            </div>
          </div>

          {/* TAB CONTENT: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Total Sales */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Icon name="DollarSign" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Confirmed Sales</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">Rs. {totalSales.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-blue-50 text-blue-500 rounded-xl">
                    <Icon name="FileText" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Orders placed</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">{orders.length} orders</span>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-yellow-50 text-yellow-600 rounded-xl">
                    <Icon name="Clock" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Awaiting Delivery</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">{activeOrdersCount} pending</span>
                  </div>
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-rose-50 text-rose-500 rounded-xl">
                    <Icon name="Package" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Low Stock Alert</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">{lowStockProducts.length} items</span>
                  </div>
                </div>

              </div>

              {/* Graphic Stats Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Weekly Order Sales Graphic</h3>
                
                {/* SVG Visual Bar Chart */}
                <div className="h-64 flex items-end gap-4 pt-6 border-b border-slate-100 px-4">
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '20%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Mon</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '45%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Tue</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '30%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Wed</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '65%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Thu</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-500 rounded-t-lg shadow-sm" style={{ height: '85%' }} />
                    <span className="text-[10px] font-mono font-bold text-emerald-600">Fri</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '40%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Sat</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-12 bg-emerald-100 hover:bg-emerald-200 rounded-t-lg transition-all" style={{ height: '50%' }} />
                    <span className="text-[10px] font-mono text-slate-400">Sun</span>
                  </div>
                </div>
              </div>

              {/* Low stock table & Recent changes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1 - Low Stock */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="Package" size={16} className="text-rose-500 animate-pulse" /> Critical Low Stock Warning
                  </h3>
                  {lowStockProducts.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-100">All products have healthy inventory levels!</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {lowStockProducts.map(p => (
                        <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                          </div>
                          <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">{p.stock} remaining</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 2 - Quick Links */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Imzaiz Panhwar Store Agent</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You are logged in as the master manager of SHAHMEER SHOP in Sindh. Maintain strict control over products, stock replenishment, and order validation.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                    <button onClick={() => setActiveTab('products')} className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs text-center border border-slate-200/60 transition-colors">Manage Stock</button>
                    <button onClick={() => setActiveTab('orders')} className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs text-center border border-slate-200/60 transition-colors">Manage Orders</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-150">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Inventory ({products.length} listed)</span>
                {!isAddingProduct && !editingProduct && (
                  <button
                    onClick={handleStartAdd}
                    className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Icon name="Plus" size={14} /> Add New Product
                  </button>
                )}
              </div>

              {/* Add/Edit Product Form */}
              {(isAddingProduct || editingProduct) && (
                <form onSubmit={handleSaveProduct} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xl space-y-6">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">
                    {isAddingProduct ? '➕ Add New Grocery Product' : '📝 Edit Grocery Product'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none"
                          placeholder="e.g. National Chili Powder"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Category *</label>
                        <select
                          value={productForm.category || 'atta-ghee-oil'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none"
                        >
                          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Brand *</label>
                        <input
                          type="text"
                          required
                          value={productForm.brand || ''}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none"
                          placeholder="e.g. National Foods"
                        />
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Price (PKR) *</label>
                          <input
                            type="number"
                            required
                            value={productForm.price || 0}
                            onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Price</label>
                          <input
                            type="number"
                            value={productForm.discountPrice || ''}
                            onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Stock Level *</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock || 0}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Unit Size *</label>
                          <input
                            type="text"
                            required
                            value={productForm.unit || ''}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none"
                            placeholder="e.g. 500g, 1 Liter"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">SKU *</label>
                          <input
                            type="text"
                            required
                            value={productForm.sku || ''}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Barcode</label>
                          <input
                            type="text"
                            value={productForm.barcode || ''}
                            onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Image URL *</label>
                        <input
                          type="text"
                          required
                          value={productForm.image || ''}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Product Description</label>
                        <textarea
                          rows={3}
                          value={productForm.description || ''}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs outline-none resize-none"
                          placeholder="Describe the product details..."
                        />
                      </div>
                    </div>

                  </div>

                  {/* Form CTA Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 justify-end">
                    <button
                      type="button"
                      onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all"
                    >
                      Cancel Form
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow"
                    >
                      Save Product details
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table List */}
              <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                        <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Price (PKR)</th>
                        <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Status</th>
                        <th className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm" />
                              <div>
                                <span className="font-bold text-slate-800 block text-xs sm:text-sm">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">SKU: {p.sku} &bull; Unit: {p.unit}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-semibold uppercase text-slate-500">
                            {p.category.replace('-', ' ')}
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-800">
                            {p.discountPrice ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-400 line-through">Rs. {p.price}</span>
                                <span className="text-emerald-600 font-black">Rs. {p.discountPrice}</span>
                              </div>
                            ) : (
                              <span>Rs. {p.price}</span>
                            )}
                          </td>
                          <td className="p-4">
                            {p.stock <= 0 ? (
                              <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded-full uppercase">Sold out</span>
                            ) : p.stock <= 5 ? (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full uppercase">Low: {p.stock} left</span>
                            ) : (
                              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full uppercase">Healthy: {p.stock}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                                title="Edit Product"
                              >
                                <Icon name="Sliders" size={13} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-colors"
                                title="Delete Product"
                              >
                                <Icon name="Trash2" size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: ORDERS FEED */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-4 rounded-2xl border border-slate-150 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Recent WhatsApp Placed Orders ({orders.length} total)</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl py-16 text-center border border-slate-150">
                  <div className="h-16 w-16 bg-slate-50 text-slate-300 flex items-center justify-center rounded-full mx-auto mb-3">
                    <Icon name="FileText" size={24} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">No orders recorded yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Orders placed through the frontend checkout flow will accumulate here automatically.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      {/* Meta */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 font-mono text-sm">Order #{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          👤 Customer: <span className="text-slate-800 font-bold">{order.customerName}</span> ({order.phone}) &bull; <span className="font-mono text-[10px] text-slate-400">{order.date} at {order.time}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          📍 Village: <span className="text-slate-800 font-semibold">{order.village}</span>, Address: <span className="text-slate-700 font-light italic">"{order.address}"</span>
                        </p>
                      </div>

                      {/* Items summary */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-xs w-full text-xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">CART ITEMS ({order.items.length})</span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between truncate">
                            <span className="truncate pr-4 text-slate-600">{item.name} x{item.quantity}</span>
                            <span className="font-mono text-slate-800 font-semibold shrink-0">Rs. {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0 justify-center">
                        <span className="text-sm font-bold text-slate-800 font-mono">Total: <span className="text-emerald-600 text-base font-black">Rs. {order.grandTotal.toLocaleString()}</span></span>
                        
                        <div className="flex gap-2">
                          {/* Dropdown status update */}
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className="h-8 px-2.5 border border-slate-200 bg-slate-50 text-[11px] font-bold rounded-xl outline-none cursor-pointer"
                          >
                            <option value="Pending">Set Pending</option>
                            <option value="Confirmed">Set Confirmed</option>
                            <option value="Delivered">Set Delivered</option>
                            <option value="Cancelled">Set Cancelled</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB CONTENT: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-6 animate-fade-in">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">⚙️ Storefront Customization</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Store Title Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">WhatsApp Phone Support Hotline</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Opening Hours</label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Physical Store Address Landmark</label>
                    <textarea
                      rows={2}
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Store Meta Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.description}
                      onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm outline-none focus:bg-white resize-none"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow"
                >
                  Save Store Configurations
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: BACKUP */}
          {activeTab === 'backup' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              
              {/* Backup card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="Download" size={16} className="text-emerald-500" /> Export Database Backup (JSON)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Download a secure state dump containing all your products, current stock configurations, and placed customer orders into a single portable `.json` file. Perfect for manual archiving!
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  <Icon name="Download" size={14} /> Download JSON Backup
                </button>
              </div>

              {/* Restore card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="Upload" size={16} className="text-blue-500" /> Restore Database Backup (JSON)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Upload a previously exported `.json` database file to completely re-synchronize your product list, categories, and settings. Warning: This will overwrite any current changes.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-full h-11 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Icon name="Upload" size={14} /> Select JSON Backup File
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Credit */}
        <div className="text-center text-[10px] text-slate-400 font-medium pt-8 mt-12 border-t border-slate-200">
          Developed by Kashif &bull; Shahmeer Shop Admin Platform v1.0
        </div>

      </main>
    </div>
  );
};
export default AdminPanel;
