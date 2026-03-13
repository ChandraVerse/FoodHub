import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { items, restaurantId, restaurantName, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);
  const { showError, showSuccess } = useToast();

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (!user) {
      showError('Please login to place your order.');
      navigate('/login');
      return;
    }
    if (items.length === 0 || !restaurantId) {
      showError('Your cart is empty.');
      return;
    }
    if (!email) {
      showError('Please enter your email to place the order.');
      return;
    }
    if (!name || !phone || !address) {
      showError('Please fill in your name, phone, and address.');
      return;
    }
    try {
      setPlacing(true);
      const body = {
        restaurantId,
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        deliveryAddress: address,
        deliveryInstructions: instructions,
        items: items.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message || 'Could not place order. Please try again.';
        showError(message);
        return;
      }
      const saved = await response.json().catch(() => null);
      clearCart();
      const orderId = saved && saved.id ? saved.id : null;
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`);
      } else {
        showSuccess('Order placed successfully.');
      }
    } catch (e) {
      showError('Could not connect to server. Please check your connection.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Your Cart</h1>
        {restaurantName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Restaurant: <span className="font-semibold">{restaurantName}</span>
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your cart is empty. Browse restaurants and add some items.
                </p>
              )}
              {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                    🍽
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-primary font-semibold">₹{item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 dark:bg-dark-hover rounded-lg">
                    <button
                      className="p-2 hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2 font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      className="p-2 hover:text-primary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email for order updates
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Your full name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Contact number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Street, area, city, pincode"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery instructions (optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="E.g. Ring the bell, leave at door"
                />
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-dark-border pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={placing || items.length === 0}
                onClick={handlePlaceOrder}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]"
              >
                {placing ? 'Placing order...' : 'Place order'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
