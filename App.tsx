import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingBag, ChevronRight, Star, Plus, Minus, Trash2, X, ChefHat, Coffee, IceCream, Utensils, Zap, CupSoda, Sandwich, Soup, Lock, ShieldCheck, LogOut, LayoutDashboard, Clock, Users, UserPlus, UserMinus, UserCheck, Settings, Save, UserX, KeyRound, Banknote, Timer, CheckCircle, Printer, UtensilsCrossed, Package, Image as ImageIcon, Edit3, FileSpreadsheet, BarChart3, Download } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from './constants';
import { MenuItem, Category, CartItem, Variant, Order, AttendanceRecord, StaffMember, OrderType } from './types';
import { GeminiAssistant } from './components/GeminiAssistant';

const App = () => {
  // -- Menu State --
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<Category>('Iced Coffee');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // -- Order Details State --
  const [orderType, setOrderType] = useState<OrderType>('Dine In');

  // -- Admin State --
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('1234'); // Default PIN
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // -- Staff Attendance State --
  const [adminView, setAdminView] = useState<'dashboard' | 'kitchen' | 'attendance' | 'settings' | 'reports'>('dashboard');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [staffNameInput, setStaffNameInput] = useState(''); // For Attendance Check-in

  // -- Reports State --
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // -- Settings State --
  const [settingsTab, setSettingsTab] = useState<'staff' | 'menu' | 'privacy'>('staff');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: '1', name: 'Juan Dela Cruz', hourlyRate: 60, role: 'Staff', joinedDate: new Date() },
    { id: '2', name: 'Maria Santos', hourlyRate: 75, role: 'Manager', joinedDate: new Date() }
  ]);
  
  // Menu Editing State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');

  // New Staff Form
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRate, setNewStaffRate] = useState('');
  
  // Change PIN Form
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState({ type: '', text: '' });

  // -- Derived State --
  const filteredItems = menuItems.filter(item => item.category === activeCategory);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // -- Handlers --

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    // Auto select first variant if exists, else null
    if (item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const addToCart = () => {
    if (!selectedItem) return;

    let price = selectedItem.basePrice || 0;
    let variantName = '';

    if (selectedItem.variants && selectedVariant) {
      price = selectedVariant.price;
      variantName = selectedVariant.name;
    }

    const newItem: CartItem = {
      ...selectedItem,
      cartId: Math.random().toString(36).substr(2, 9),
      selectedVariant: selectedVariant || undefined,
      quantity,
      totalPrice: price * quantity
    };

    setCart(prev => [...prev, newItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const printReceipt = (order: Order) => {
    // Open a hidden window/iframe or just a popup to print
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const receiptHtml = `
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; max-width: 300px; margin: 0 auto; padding: 10px; }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .title { font-size: 16px; font-weight: bold; }
            .subtitle { font-size: 10px; }
            .order-type { font-size: 16px; font-weight: bold; text-align: center; margin: 5px 0; border: 2px solid #000; padding: 5px; }
            .order-info { margin-bottom: 10px; font-weight: bold; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; text-align: right; font-size: 14px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
            .cut-line { text-align: center; margin: 30px 0; border-bottom: 1px dashed #000; height: 10px; }
            .copy-label { text-align: center; font-weight: bold; margin-bottom: 5px; background: #eee; }
          </style>
        </head>
        <body>
          
          <!-- CUSTOMER COPY -->
          <div class="receipt">
            <div class="copy-label">CUSTOMER COPY</div>
            <div class="header">
              <div class="title">HAPPY HEARTS</div>
              <div class="subtitle">Coffee & Prints</div>
              <div class="subtitle">123 Main St, City Proper</div>
            </div>
            
            <div class="order-type">
              ${order.orderType.toUpperCase()}
            </div>

            <div class="order-info">
              <div>Order: #${order.orderNumber}</div>
              <div>Date: ${order.timestamp.toLocaleDateString()} ${order.timestamp.toLocaleTimeString()}</div>
            </div>
            <div class="items">
              ${order.items.map(item => `
                <div class="item">
                  <span>${item.quantity}x ${item.name} <br/> <small>${item.selectedVariant?.name || ''}</small></span>
                  <span>P${item.totalPrice}</span>
                </div>
              `).join('')}
            </div>
            <div class="total">
              TOTAL: P${order.totalAmount}
            </div>
            <div class="footer">Thank you for ordering!<br/>Please wait for your number.</div>
          </div>

          <div class="cut-line"> - - - - - CUT HERE - - - - - </div>

          <!-- KITCHEN/COUNTER COPY -->
          <div class="receipt">
            <div class="copy-label">COUNTER / KITCHEN COPY</div>
            <div class="header">
              <div class="title">HAPPY HEARTS</div>
              <div class="subtitle">INTERNAL TICKET</div>
            </div>

            <div class="order-type">
              ${order.orderType.toUpperCase()}
            </div>

            <div class="order-info">
              <div style="font-size: 18px">Order: #${order.orderNumber}</div>
              <div>Date: ${order.timestamp.toLocaleDateString()} ${order.timestamp.toLocaleTimeString()}</div>
            </div>
            <div class="items">
              ${order.items.map(item => `
                <div class="item">
                  <span style="font-size: 14px; font-weight: bold;">${item.quantity}x ${item.name}</span>
                  <span>P${item.totalPrice}</span>
                </div>
                ${item.selectedVariant ? `<div style="font-size: 12px; margin-bottom: 5px;">Option: ${item.selectedVariant.name}</div>` : ''}
              `).join('')}
            </div>
            <div class="total">
              TOTAL: P${order.totalAmount}
            </div>
          </div>

        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Create new order record
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: `ORD-${(orders.length + 1).toString().padStart(4, '0')}`,
      items: [...cart],
      totalAmount: cartTotal,
      timestamp: new Date(),
      status: 'Pending',
      orderType: orderType,
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setShowOrderSuccess(true);
    
    // Automatically print receipt
    printReceipt(newOrder);
    
    setTimeout(() => {
      setCart([]);
      setOrderType('Dine In');
      setShowOrderSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const updateOrderStatus = (orderId: string, status: 'Pending' | 'Completed' | 'Cancelled') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // -- Admin Handlers --
  const handleAdminLogin = () => {
    if (pinInput === adminPin) {
      setIsSecurityOpen(false);
      setIsAdminOpen(true);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      setPinInput(prev => prev + digit);
      setPinError(false);
    }
  };

  const handlePinBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleAttendance = (type: 'In' | 'Out') => {
    if (!staffNameInput.trim()) return;
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      staffName: staffNameInput.trim(),
      type,
      timestamp: new Date()
    };
    setAttendance(prev => [newRecord, ...prev]);
    setStaffNameInput('');
  };

  // -- Report Handlers --
  const getFilteredOrders = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      
      switch (reportPeriod) {
        case 'daily':
          return orderDate >= startOfDay;
        case 'weekly':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - 7);
          return orderDate >= startOfWeek;
        case 'monthly':
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const handleExportExcel = () => {
    const filteredOrders = getFilteredOrders();
    if (filteredOrders.length === 0) return;

    // Create CSV header
    const headers = ['Order ID', 'Date', 'Time', 'Type', 'Items', 'Total Amount', 'Status'];
    
    // Create CSV rows
    const rows = filteredOrders.map(order => {
      const itemsString = order.items.map(i => `${i.quantity}x ${i.name}`).join('; ');
      return [
        order.orderNumber,
        order.timestamp.toLocaleDateString(),
        order.timestamp.toLocaleTimeString(),
        order.orderType,
        `"${itemsString}"`, // Quote items to handle commas
        order.totalAmount,
        order.status
      ].join(',');
    });

    // Combine header and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create a Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -- Settings Handlers --
  const handleAddStaff = () => {
    if (!newStaffName.trim() || !newStaffRate) return;
    
    const newStaff: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStaffName.trim(),
      hourlyRate: parseFloat(newStaffRate),
      role: 'Staff',
      joinedDate: new Date()
    };
    
    setStaffMembers(prev => [...prev, newStaff]);
    setNewStaffName('');
    setNewStaffRate('');
  };

  const handleDeleteStaff = (id: string) => {
    setStaffMembers(prev => prev.filter(s => s.id !== id));
  };

  const handleChangePin = () => {
    setPinChangeMessage({ type: '', text: '' });
    
    if (currentPinInput !== adminPin) {
      setPinChangeMessage({ type: 'error', text: 'Current PIN is incorrect.' });
      return;
    }
    
    if (newPinInput.length !== 4) {
      setPinChangeMessage({ type: 'error', text: 'New PIN must be 4 digits.' });
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeMessage({ type: 'error', text: 'New PINs do not match.' });
      return;
    }

    setAdminPin(newPinInput);
    setPinChangeMessage({ type: 'success', text: 'PIN successfully updated!' });
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
  };

  const handleEditImage = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditImageUrl(item.imageUrl || '');
  };

  const handleSaveImage = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, imageUrl: editImageUrl } : item
    ));
    setEditingItemId(null);
    setEditImageUrl('');
  };

  // -- Render Helpers --

  const formatPrice = (amount: number) => `₱${amount}`;

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Iced Coffee': return <Coffee />;
      case 'Hot Coffee': return <Coffee className="text-orange-700" />;
      case 'Frappes': return <IceCream />;
      case 'Milk Tea': return <CupSoda />;
      case 'Fruit Soda': return <Zap />;
      case 'Meals': return <Utensils />;
      case 'Snacks': return <Sandwich />;
      case 'Desserts': return <Star />;
      default: return <Coffee />;
    }
  };

  const getItemColor = (cat: Category) => {
    switch (cat) {
      case 'Iced Coffee': return 'bg-amber-100 text-amber-800';
      case 'Hot Coffee': return 'bg-orange-100 text-orange-800';
      case 'Frappes': return 'bg-pink-100 text-pink-800';
      case 'Milk Tea': return 'bg-teal-100 text-teal-800';
      case 'Fruit Soda': return 'bg-purple-100 text-purple-800';
      case 'Meals': return 'bg-red-100 text-red-800';
      case 'Snacks': return 'bg-yellow-100 text-yellow-800';
      case 'Desserts': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Report filtered data
  const filteredOrders = getFilteredOrders();
  const reportTotalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-800">
      
      {/* --- Header --- */}
      <header className="h-20 bg-white shadow-sm px-6 flex items-center justify-between flex-shrink-0 z-20 relative">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white font-display font-bold text-2xl shadow-md">
             H
           </div>
           <div>
             <h1 className="font-display font-bold text-2xl text-brand-brown leading-none">Happy Hearts</h1>
             <p className="text-xs text-brand-orange font-bold tracking-wider">COFFEE & PRINTS</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsSecurityOpen(true)}
             className="p-4 bg-gray-100 hover:bg-brand-brown hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 group"
             title="Admin Access"
          >
            <Lock size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase hidden md:inline">Admin</span>
          </button>

          <button 
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
             <ChefHat size={20} />
             <span className="font-bold text-sm">Ask AI Barista</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-brand-brown text-white p-3 rounded-xl hover:bg-brand-brown/90 transition-colors px-6 flex items-center gap-3"
          >
            <ShoppingBag size={24} />
            <span className="font-bold hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Categories */}
        <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest px-4 mb-4 mt-2">Menu</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand-orange text-white shadow-md shadow-orange-200' 
                    : 'text-gray-600 hover:bg-orange-50 hover:text-brand-orange'
                }`}
              >
                <div className={`p-1 rounded-full ${activeCategory === cat ? 'bg-white/20' : ''}`}>
                  {React.cloneElement(getCategoryIcon(cat), { size: 18 })}
                </div>
                <span className="font-semibold flex-1">{cat}</span>
                {activeCategory === cat && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Category Nav (Top) */}
        <div className="md:hidden flex overflow-x-auto bg-white border-b p-2 gap-2 flex-shrink-0 absolute w-full z-10 top-20">
          {CATEGORIES.map(cat => (
            <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                 activeCategory === cat ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600'
               }`}
            >
              {React.cloneElement(getCategoryIcon(cat), { size: 14 })}
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <section className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 pt-16 md:pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className={`p-2 rounded-lg ${getItemColor(activeCategory).split(' ')[0]}`}>
                {React.cloneElement(getCategoryIcon(activeCategory), { className: getItemColor(activeCategory).split(' ')[1] })}
              </div>
              <h2 className="font-display font-bold text-3xl text-brand-brown">{activeCategory}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => openItemModal(item)}
                  className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-brand-orange/20 flex flex-col h-full"
                >
                  <div className={`h-32 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden ${getItemColor(item.category)}`}>
                     {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover z-10" />
                     ) : (
                       <>
                         {/* Decorative circle */}
                         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full"></div>
                         <div className="absolute top-2 left-2 w-12 h-12 bg-white/10 rounded-full"></div>
                         
                         <div className="z-10 transform group-hover:scale-110 transition-transform duration-300">
                            {React.cloneElement(getCategoryIcon(item.category), { size: 48 })}
                         </div>
                       </>
                     )}

                    {item.isBestSeller && (
                      <div className="absolute top-2 left-2 bg-brand-yellow text-brand-brown text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 z-20">
                        <Star size={10} fill="currentColor" /> Best Seller
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 leading-tight mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{item.description || `${item.category} made with love.`}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="font-bold text-xl text-brand-orange">
                      {item.variants ? formatPrice(item.variants[0].price) : formatPrice(item.basePrice || 0)}
                      {item.variants && <span className="text-xs text-gray-400 font-normal ml-1">+</span>}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <Plus size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* --- Product Modal --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className={`p-8 text-center relative ${getItemColor(selectedItem.category)}`}>
               <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors text-current z-20"
                >
                  <X size={20} />
               </button>

               {selectedItem.imageUrl ? (
                 <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                    <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                 </div>
               ) : (
                 <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    {React.cloneElement(getCategoryIcon(selectedItem.category), { size: 40 })}
                 </div>
               )}

               <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1 block">{selectedItem.category}</span>
               <h2 className="font-display font-bold text-3xl">{selectedItem.name}</h2>
            </div>
            
            <div className="flex-1 p-6 flex flex-col overflow-y-auto">
              <p className="text-gray-500 mb-6 text-center">{selectedItem.description || `Freshly prepared ${selectedItem.name} just for you.`}</p>

              {/* Variants / Sizes */}
              {selectedItem.variants && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Select Size / Option</label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedItem.variants.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedVariant?.name === v.name 
                            ? 'border-brand-orange bg-orange-50 text-brand-orange' 
                            : 'border-gray-100 hover:border-brand-orange/50 text-gray-600'
                        }`}
                      >
                        <span className="font-semibold">{v.name}</span>
                        <span className="font-bold">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4 bg-gray-100 rounded-full p-1">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-600"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-600"
                      >
                        <Plus size={18} />
                      </button>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-gray-500">Total Price</p>
                     <p className="text-3xl font-display font-bold text-brand-brown">
                       {formatPrice(((selectedVariant?.price || selectedItem.basePrice || 0) * quantity))}
                     </p>
                   </div>
                </div>

                <button 
                  onClick={addToCart}
                  className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 hover:bg-brand-red hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Cart Drawer --- */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-brown text-white">
            <h2 className="font-display font-bold text-2xl flex items-center gap-2">
              <ShoppingBag className="text-brand-yellow" /> Your Order
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {/* Dining Option Toggle */}
             <div className="bg-gray-100 p-1 rounded-xl flex">
                <button 
                   onClick={() => setOrderType('Dine In')}
                   className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${orderType === 'Dine In' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-500 hover:text-gray-700'}`}
                >
                   <UtensilsCrossed size={18} /> Dine In
                </button>
                <button 
                   onClick={() => setOrderType('Take Out')}
                   className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${orderType === 'Take Out' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-500 hover:text-gray-700'}`}
                >
                   <Package size={18} /> Take Out
                </button>
             </div>

             <div className="h-px bg-gray-100 my-2"></div>

            {cart.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-400 py-12">
                 <ShoppingBag size={64} className="mb-4 opacity-20" />
                 <p>Your cart is empty.</p>
                 <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-orange font-bold hover:underline">Start Ordering</button>
               </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${getItemColor(item.category)}`}>
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                           React.cloneElement(getCategoryIcon(item.category), { size: 24 })
                        )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                      {item.selectedVariant && (
                        <p className="text-sm text-gray-500 mb-2">{item.selectedVariant.name}</p>
                      )}
                      <div className="flex justify-between items-end mt-2">
                          <span className="text-sm font-semibold bg-white border px-2 py-1 rounded-md">x{item.quantity}</span>
                          <span className="font-bold text-brand-orange">{formatPrice(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
             <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-4 border-t border-dashed">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
             </div>
             
             <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-brand-brown text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
             >
               Place Order
             </button>
          </div>
        </div>
      </div>

      {/* --- Security PIN Modal --- */}
      {isSecurityOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-brand-brown p-4 flex justify-between items-center text-white">
               <h3 className="font-bold flex items-center gap-2">
                 <ShieldCheck size={20} className="text-brand-yellow" /> Security Check
               </h3>
               <button onClick={() => { setIsSecurityOpen(false); setPinInput(''); setPinError(false); }} className="hover:bg-white/20 p-1 rounded-full">
                 <X size={20} />
               </button>
            </div>
            <div className="p-6">
              <div className="mb-6 text-center">
                 <p className="text-gray-500 mb-4">Enter Admin PIN</p>
                 <div className="flex justify-center gap-2 mb-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`w-4 h-4 rounded-full border border-gray-300 ${pinInput.length > i ? 'bg-brand-brown' : 'bg-white'}`} />
                    ))}
                 </div>
                 {pinError && <p className="text-red-500 text-xs font-bold animate-pulse">Incorrect PIN</p>}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                 {[1,2,3,4,5,6,7,8,9].map(num => (
                   <button 
                     key={num} 
                     onClick={() => handlePinDigit(num.toString())}
                     className="h-14 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-2xl text-gray-700 shadow-sm border border-gray-100 active:bg-gray-200 transition-colors"
                   >
                     {num}
                   </button>
                 ))}
                 <div />
                 <button 
                    onClick={() => handlePinDigit('0')}
                    className="h-14 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-2xl text-gray-700 shadow-sm border border-gray-100 active:bg-gray-200 transition-colors"
                 >
                   0
                 </button>
                 <button 
                    onClick={handlePinBackspace}
                    className="h-14 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm border border-gray-100 active:bg-gray-200 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              <button 
                onClick={handleAdminLogin}
                className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-brand-red transition-all"
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Admin Dashboard --- */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-100 flex flex-col">
           {/* Admin Header */}
           <div className="bg-brand-brown text-white h-16 flex items-center justify-between px-6 shadow-md shrink-0">
              <div className="flex items-center gap-3">
                 <LayoutDashboard className="text-brand-yellow" />
                 <h2 className="font-display font-bold text-xl">Admin Dashboard</h2>
              </div>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-semibold">Exit</span>
              </button>
           </div>
           
           {/* Navigation Tabs */}
           <div className="bg-white shadow-sm px-6 flex items-center gap-6 border-b border-gray-200 shrink-0 overflow-x-auto">
              <button 
                onClick={() => setAdminView('dashboard')}
                className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${adminView === 'dashboard' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button 
                onClick={() => setAdminView('kitchen')}
                className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${adminView === 'kitchen' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <ChefHat size={18} /> Kitchen View
              </button>
              <button 
                onClick={() => setAdminView('attendance')}
                className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${adminView === 'attendance' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Users size={18} /> Staff Attendance
              </button>
              <button 
                onClick={() => setAdminView('reports')}
                className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${adminView === 'reports' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <FileSpreadsheet size={18} /> Sales Reports
              </button>
              <button 
                onClick={() => setAdminView('settings')}
                className={`py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${adminView === 'settings' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Settings size={18} /> Settings
              </button>
           </div>

           {/* Admin Content */}
           <div className="flex-1 overflow-auto p-6 md:p-8">
              <div className="max-w-6xl mx-auto space-y-8">
                 
                 {/* Dashboard View */}
                 {adminView === 'dashboard' && (
                   <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                            </div>
                          </div>
                          
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Total Sales</p>
                                <p className="text-2xl font-bold text-gray-800">{formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}</p>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-semibold">Session Started</p>
                                <p className="text-sm font-bold text-gray-800">Just now</p>
                            </div>
                          </div>
                      </div>

                      {/* Recent Orders Table */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Live Updates</span>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                  <th className="px-6 py-4">Order ID</th>
                                  <th className="px-6 py-4">Type</th>
                                  <th className="px-6 py-4">Items</th>
                                  <th className="px-6 py-4 text-right">Total</th>
                                  <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {orders.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                      No orders yet.
                                    </td>
                                  </tr>
                                ) : (
                                  orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50">
                                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        #{order.orderNumber}
                                        <div className="text-xs text-gray-400">{order.timestamp.toLocaleTimeString()}</div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${order.orderType === 'Dine In' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                          {order.orderType}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="space-y-1">
                                          {order.items.map((item, idx) => (
                                            <div key={idx} className="text-sm font-medium text-gray-800">
                                              {item.quantity}x {item.name} <span className="text-gray-400 text-xs">({item.selectedVariant ? item.selectedVariant.name : 'Regular'})</span>
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-right font-bold text-gray-800">{formatPrice(order.totalAmount)}</td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                      </div>
                   </>
                 )}

                 {/* Kitchen View */}
                 {adminView === 'kitchen' && (
                    <div className="h-full">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                             <ChefHat className="text-brand-orange" /> Kitchen Orders
                          </h3>
                          <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-bold">
                             {orders.filter(o => o.status === 'Pending').length} Pending
                          </span>
                       </div>
                       
                       {orders.filter(o => o.status === 'Pending').length === 0 ? (
                           <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                               <Coffee size={64} className="mx-auto text-gray-300 mb-4" />
                               <h3 className="text-xl font-bold text-gray-400">All orders are complete!</h3>
                               <p className="text-gray-400">Waiting for new customers...</p>
                           </div>
                       ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                               {orders
                                 .filter(o => o.status === 'Pending')
                                 .sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
                                 .map((order) => (
                                   <div key={order.id} className="bg-white rounded-xl shadow-md border-l-4 border-brand-orange overflow-hidden flex flex-col">
                                       <div className="p-4 border-b border-gray-100 bg-orange-50/50 flex justify-between items-center">
                                           <div>
                                               <span className="block text-xs font-bold text-brand-orange uppercase">Order Number</span>
                                               <span className="text-2xl font-display font-bold text-gray-800">#{order.orderNumber}</span>
                                           </div>
                                           <div className="text-right">
                                              <span className={`block text-xs font-bold uppercase mb-1 ${order.orderType === 'Dine In' ? 'text-blue-600' : 'text-orange-600'}`}>
                                                 {order.orderType}
                                              </span>
                                           </div>
                                       </div>
                                       <div className="p-4 flex-1">
                                           <ul className="space-y-4">
                                               {order.items.map((item, idx) => (
                                                   <li key={idx} className="flex items-start gap-3">
                                                       <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-lg text-brand-brown">
                                                           {item.quantity}
                                                       </span>
                                                       <div>
                                                           <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                                                           {item.selectedVariant && (
                                                               <p className="text-sm text-gray-500">{item.selectedVariant.name}</p>
                                                           )}
                                                       </div>
                                                   </li>
                                               ))}
                                           </ul>
                                       </div>
                                       <div className="p-4 bg-gray-50 border-t border-gray-100">
                                           <div className="flex gap-2 mb-3">
                                              <button 
                                                onClick={() => printReceipt(order)}
                                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
                                              >
                                                <Printer size={16} /> Print
                                              </button>
                                           </div>
                                           <button 
                                              onClick={() => updateOrderStatus(order.id, 'Completed')}
                                              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                           >
                                               <CheckCircle size={20} /> Mark Ready
                                           </button>
                                       </div>
                                   </div>
                               ))
                               }
                           </div>
                       )}
                    </div>
                 )}

                 {/* Reports View */}
                 {adminView === 'reports' && (
                    <div className="space-y-6">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                             <BarChart3 className="text-brand-orange" /> Sales Reports
                          </h3>
                          
                          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                             {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                                <button
                                   key={period}
                                   onClick={() => setReportPeriod(period)}
                                   className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${reportPeriod === period ? 'bg-brand-brown text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                   {period}
                                </button>
                             ))}
                          </div>
                       </div>

                       {/* Summary Cards */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                             <p className="text-gray-500 text-sm font-semibold mb-2">Total Revenue ({reportPeriod})</p>
                             <p className="text-3xl font-bold text-brand-brown">{formatPrice(reportTotalSales)}</p>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                             <p className="text-gray-500 text-sm font-semibold mb-2">Total Orders</p>
                             <p className="text-3xl font-bold text-gray-800">{filteredOrders.length}</p>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                              <button 
                                onClick={handleExportExcel}
                                disabled={filteredOrders.length === 0}
                                className="flex flex-col items-center gap-2 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                 <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                    <Download size={24} />
                                 </div>
                                 <span className="font-bold text-sm">Download Excel</span>
                              </button>
                          </div>
                       </div>

                       {/* Preview Table */}
                       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          <div className="p-6 border-b border-gray-100">
                            <h4 className="font-bold text-gray-800">Report Preview</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                  <th className="px-6 py-4">Date & Time</th>
                                  <th className="px-6 py-4">Order #</th>
                                  <th className="px-6 py-4">Type</th>
                                  <th className="px-6 py-4 text-right">Amount</th>
                                  <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {filteredOrders.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                      No data found for this period.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50">
                                      <td className="px-6 py-4 text-sm text-gray-600">
                                        {order.timestamp.toLocaleDateString()} <span className="text-gray-400">{order.timestamp.toLocaleTimeString()}</span>
                                      </td>
                                      <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700">{order.orderNumber}</td>
                                      <td className="px-6 py-4 text-sm">{order.orderType}</td>
                                      <td className="px-6 py-4 text-right font-bold text-gray-800">{formatPrice(order.totalAmount)}</td>
                                      <td className="px-6 py-4 text-center text-sm">{order.status}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Staff Attendance View */}
                 {adminView === 'attendance' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Control Card */}
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center">
                               <UserCheck size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Staff Check-in/out</h3>
                         </div>
                         
                         <div className="space-y-6">
                           <div>
                             <label className="block text-sm font-semibold text-gray-600 mb-2">Staff Name</label>
                             <input 
                               type="text" 
                               value={staffNameInput}
                               onChange={(e) => setStaffNameInput(e.target.value)}
                               className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-brand-orange bg-gray-50 text-lg"
                               placeholder="Enter your name..."
                             />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                             <button 
                               onClick={() => handleAttendance('In')}
                               disabled={!staffNameInput.trim()}
                               className="flex flex-col items-center justify-center gap-2 bg-green-500 text-white py-6 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-green-200 active:scale-95"
                             >
                               <UserPlus size={24} /> 
                               <span>Clock In</span>
                             </button>
                             <button 
                               onClick={() => handleAttendance('Out')}
                               disabled={!staffNameInput.trim()}
                               className="flex flex-col items-center justify-center gap-2 bg-red-500 text-white py-6 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-200 active:scale-95"
                             >
                               <UserMinus size={24} /> 
                               <span>Clock Out</span>
                             </button>
                           </div>
                         </div>
                       </div>

                       {/* History Card */}
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Today's Logs</h3>
                            <span className="text-xs text-brand-brown bg-brand-cream px-3 py-1 rounded-full font-bold">
                               {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                             {attendance.length === 0 ? (
                               <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                 <Users size={48} className="mb-3 opacity-20" />
                                 <p className="text-sm">No records for today.</p>
                               </div>
                             ) : (
                               attendance.map(record => (
                                 <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                                   <div className="flex items-center gap-4">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.type === 'In' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                       {record.type === 'In' ? <UserPlus size={18} /> : <UserMinus size={18} />}
                                     </div>
                                     <div>
                                       <p className="font-bold text-gray-800 text-lg">{record.staffName}</p>
                                       <p className={`text-xs font-bold ${record.type === 'In' ? 'text-green-600' : 'text-red-500'}`}>
                                          {record.type === 'In' ? 'Clocked In' : 'Clocked Out'}
                                       </p>
                                     </div>
                                   </div>
                                   <div className="text-right">
                                      <span className="font-mono text-gray-600 font-semibold block">
                                        {record.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Time</span>
                                   </div>
                                 </div>
                               ))
                             )}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Settings View */}
                 {adminView === 'settings' && (
                    <div className="flex flex-col md:flex-row gap-6 h-full">
                       {/* Sidebar for Settings */}
                       <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 h-fit">
                          <button 
                            onClick={() => setSettingsTab('staff')}
                            className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition-all ${
                               settingsTab === 'staff' 
                               ? 'border-brand-orange bg-orange-50 text-brand-orange font-bold' 
                               : 'border-transparent text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                             <Banknote size={20} /> Staff & Payroll
                          </button>
                          <button 
                            onClick={() => setSettingsTab('menu')}
                            className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition-all ${
                               settingsTab === 'menu' 
                               ? 'border-brand-orange bg-orange-50 text-brand-orange font-bold' 
                               : 'border-transparent text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                             <ImageIcon size={20} /> Menu Images
                          </button>
                          <button 
                            onClick={() => setSettingsTab('privacy')}
                            className={`w-full text-left px-6 py-4 flex items-center gap-3 border-l-4 transition-all ${
                               settingsTab === 'privacy' 
                               ? 'border-brand-orange bg-orange-50 text-brand-orange font-bold' 
                               : 'border-transparent text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                             <KeyRound size={20} /> Security & Privacy
                          </button>
                       </div>
                       
                       {/* Settings Content */}
                       <div className="flex-1">
                          
                          {/* Staff Management */}
                          {settingsTab === 'staff' && (
                             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8">
                                   <div>
                                      <h3 className="font-bold text-xl text-gray-800">Staff Management</h3>
                                      <p className="text-gray-500 text-sm">Manage employees and edit payroll rates.</p>
                                   </div>
                                   <div className="bg-brand-cream text-brand-brown px-4 py-2 rounded-lg font-mono text-sm font-bold">
                                      {staffMembers.length} Active Staff
                                   </div>
                                </div>

                                {/* Add Staff Form */}
                                <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                                   <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                      <Plus size={16} className="text-brand-orange" /> Add New Staff
                                   </h4>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                      <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                                         <input 
                                            type="text" 
                                            value={newStaffName}
                                            onChange={(e) => setNewStaffName(e.target.value)}
                                            placeholder="e.g. Juan Cruz"
                                            className="w-full border border-gray-200 rounded-lg p-3 focus:border-brand-orange focus:outline-none bg-white"
                                         />
                                      </div>
                                      <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Hourly Rate (₱)</label>
                                         <input 
                                            type="number" 
                                            value={newStaffRate}
                                            onChange={(e) => setNewStaffRate(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full border border-gray-200 rounded-lg p-3 focus:border-brand-orange focus:outline-none bg-white"
                                         />
                                      </div>
                                      <button 
                                         onClick={handleAddStaff}
                                         disabled={!newStaffName || !newStaffRate}
                                         className="bg-brand-brown text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                      >
                                         <Save size={18} /> Save Staff
                                      </button>
                                   </div>
                                </div>

                                {/* Staff List Table */}
                                <div className="overflow-x-auto">
                                   <table className="w-full text-left">
                                      <thead>
                                         <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="py-3 font-semibold">Staff Name</th>
                                            <th className="py-3 font-semibold">Role</th>
                                            <th className="py-3 font-semibold">Hourly Rate</th>
                                            <th className="py-3 font-semibold text-right">Actions</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-50">
                                         {staffMembers.map(staff => (
                                            <tr key={staff.id} className="group hover:bg-gray-50">
                                               <td className="py-4 font-bold text-gray-700">{staff.name}</td>
                                               <td className="py-4">
                                                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-bold">
                                                     {staff.role}
                                                  </span>
                                               </td>
                                               <td className="py-4 font-mono text-gray-600">{formatPrice(staff.hourlyRate)}/hr</td>
                                               <td className="py-4 text-right">
                                                  <button 
                                                    onClick={() => handleDeleteStaff(staff.id)}
                                                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                  >
                                                     <Trash2 size={18} />
                                                  </button>
                                               </td>
                                            </tr>
                                         ))}
                                      </tbody>
                                   </table>
                                </div>
                             </div>
                          )}

                          {/* Menu Image Management */}
                          {settingsTab === 'menu' && (
                             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8">
                                   <div>
                                      <h3 className="font-bold text-xl text-gray-800">Menu Image Management</h3>
                                      <p className="text-gray-500 text-sm">Add or update images for menu items.</p>
                                   </div>
                                </div>

                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                   <table className="w-full text-left">
                                      <thead className="sticky top-0 bg-white z-10">
                                         <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="py-3 font-semibold w-20">Preview</th>
                                            <th className="py-3 font-semibold">Item Name</th>
                                            <th className="py-3 font-semibold">Category</th>
                                            <th className="py-3 font-semibold">Image URL</th>
                                            <th className="py-3 font-semibold text-right">Action</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-50">
                                         {menuItems.map(item => (
                                            <tr key={item.id} className="group hover:bg-gray-50">
                                               <td className="py-3">
                                                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                                     {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                     ) : (
                                                        React.cloneElement(getCategoryIcon(item.category), { size: 16, className: 'text-gray-400' })
                                                     )}
                                                  </div>
                                               </td>
                                               <td className="py-3 font-bold text-gray-700">{item.name}</td>
                                               <td className="py-3 text-sm text-gray-500">{item.category}</td>
                                               <td className="py-3">
                                                  {editingItemId === item.id ? (
                                                     <input 
                                                        type="text" 
                                                        value={editImageUrl}
                                                        onChange={(e) => setEditImageUrl(e.target.value)}
                                                        className="w-full border border-brand-orange rounded-md px-3 py-2 text-sm focus:outline-none"
                                                        placeholder="https://..."
                                                        autoFocus
                                                     />
                                                  ) : (
                                                     <span className="text-xs text-gray-400 truncate max-w-[200px] block" title={item.imageUrl}>
                                                        {item.imageUrl || 'No image set'}
                                                     </span>
                                                  )}
                                               </td>
                                               <td className="py-3 text-right">
                                                  {editingItemId === item.id ? (
                                                     <div className="flex justify-end gap-2">
                                                        <button 
                                                           onClick={() => setEditingItemId(null)}
                                                           className="p-2 text-gray-400 hover:text-gray-600"
                                                        >
                                                           <X size={18} />
                                                        </button>
                                                        <button 
                                                           onClick={() => handleSaveImage(item.id)}
                                                           className="p-2 bg-brand-orange text-white rounded-lg hover:bg-brand-red"
                                                        >
                                                           <Save size={18} />
                                                        </button>
                                                     </div>
                                                  ) : (
                                                     <button 
                                                        onClick={() => handleEditImage(item)}
                                                        className="p-2 text-brand-orange hover:bg-orange-50 rounded-lg transition-colors"
                                                     >
                                                        <Edit3 size={18} />
                                                     </button>
                                                  )}
                                               </td>
                                            </tr>
                                         ))}
                                      </tbody>
                                   </table>
                                </div>
                             </div>
                          )}

                          {/* Privacy Settings */}
                          {settingsTab === 'privacy' && (
                             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-xl">
                                <h3 className="font-bold text-xl text-gray-800 mb-2">Security Settings</h3>
                                <p className="text-gray-500 text-sm mb-8">Update your Admin Dashboard access PIN.</p>
                                
                                <div className="space-y-4">
                                   <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-2">Current PIN</label>
                                      <input 
                                         type="password" 
                                         maxLength={4}
                                         value={currentPinInput}
                                         onChange={(e) => setCurrentPinInput(e.target.value)}
                                         className="w-full border border-gray-200 rounded-xl p-4 text-center tracking-[1em] text-xl font-bold focus:border-brand-orange focus:outline-none"
                                         placeholder="••••"
                                      />
                                   </div>
                                   
                                   <div className="pt-4 border-t border-gray-100">
                                      <label className="block text-sm font-bold text-gray-700 mb-2">New PIN</label>
                                      <input 
                                         type="password" 
                                         maxLength={4}
                                         value={newPinInput}
                                         onChange={(e) => setNewPinInput(e.target.value)}
                                         className="w-full border border-gray-200 rounded-xl p-4 text-center tracking-[1em] text-xl font-bold focus:border-brand-orange focus:outline-none"
                                         placeholder="••••"
                                      />
                                   </div>

                                   <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New PIN</label>
                                      <input 
                                         type="password" 
                                         maxLength={4}
                                         value={confirmPinInput}
                                         onChange={(e) => setConfirmPinInput(e.target.value)}
                                         className="w-full border border-gray-200 rounded-xl p-4 text-center tracking-[1em] text-xl font-bold focus:border-brand-orange focus:outline-none"
                                         placeholder="••••"
                                      />
                                   </div>

                                   {pinChangeMessage.text && (
                                      <div className={`p-3 rounded-lg text-sm text-center font-bold ${pinChangeMessage.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                         {pinChangeMessage.text}
                                      </div>
                                   )}

                                   <button 
                                      onClick={handleChangePin}
                                      className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-red transition-all mt-4"
                                   >
                                      Update PIN
                                   </button>
                                </div>
                             </div>
                          )}

                       </div>
                    </div>
                 )}

              </div>
           </div>
        </div>
      )}

      {/* --- AI Assistant Modal --- */}
      {isAiOpen && (
        <GeminiAssistant 
          onClose={() => setIsAiOpen(false)} 
          onRecommend={(item) => {
            setIsAiOpen(false);
            openItemModal(item);
          }}
        />
      )}

      {/* --- Order Success Overlay --- */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-orange text-white">
          <div className="text-center animate-bounce">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange shadow-xl">
               <Star size={48} fill="currentColor" />
            </div>
            <h2 className="font-display font-bold text-5xl mb-2">Order Placed!</h2>
            <p className="text-xl opacity-90">Please wait for your queue number.</p>
          </div>
        </div>
      )}

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);