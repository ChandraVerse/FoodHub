import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const cartItems = [
    { id: 1, name: 'Margherita Pizza', price: 12.99, quantity: 2, image: '🍕' },
    { id: 2, name: 'Chicken Burger', price: 8.99, quantity: 1, image: '🍔' },
    { id: 3, name: 'Cola', price: 1.99, quantity: 3, image: '🥤' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = (event) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.alert('Please login as a customer to order food.');
    }
  };

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-primary font-semibold">${item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 dark:bg-dark-hover rounded-lg">
                    <button className="p-2 hover:text-primary"><Minus size={16} /></button>
                    <span className="px-2 font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button className="p-2 hover:text-primary"><Plus size={16} /></button>
                  </div>
                  <button className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors">
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
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-dark-border pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout"
                onClick={handleProceedToCheckout}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
