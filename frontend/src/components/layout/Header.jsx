import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Tag } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items, restaurantName } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white text-lg font-extrabold shadow-md group-hover:rotate-12 group-hover:scale-105 transition-transform">
            FH
          </span>
          <span className="text-gray-900 dark:text-white">
            Food<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-semibold hover:text-primary transition-colors flex items-center ${location.pathname === link.path ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full transition-colors text-gray-700 dark:text-gray-300"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {isCartOpen && cartCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border p-4 z-50"
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {restaurantName ? `From ${restaurantName}` : 'Your cart'}
                  </p>
                  <div className="max-h-56 overflow-y-auto space-y-3 text-sm">
                    {items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-primary font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        And {items.length - 4} more item(s)
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      Total{' '}
                      <span className="font-semibold text-primary">
                        ₹{cartTotal.toFixed(2)}
                      </span>
                    </p>
                    <Link
                      to="/cart"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View cart
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user && user.role !== 'restaurant_owner' && (
            <Link
              to="/orders"
              className={`text-sm font-semibold px-3 py-2 rounded-full ${
                location.pathname === '/orders'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              My Orders
            </Link>
          )}
          {user && user.role === 'restaurant_owner' && (
            <Link
              to="/owner"
              className="px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white font-semibold transition-colors text-sm"
            >
              Owner Dashboard
            </Link>
          )}
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-dark-hover text-gray-800 dark:text-gray-200 text-sm">
                <User size={18} className="text-primary" />
                <span>{user.role === 'restaurant_owner' ? 'Owner' : 'Customer'}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-dark-border text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition duration-300 font-semibold">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 dark:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium ${location.pathname === link.path ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100 dark:border-dark-border" />
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-gray-700 dark:text-gray-300 font-medium">
                <span>Cart</span>
                <div className="flex items-center gap-2">
                   {cartCount > 0 && (
                     <span className="bg-primary text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                       {cartCount > 9 ? '9+' : cartCount}
                     </span>
                   )}
                   <ShoppingBag size={20} />
                </div>
              </Link>
              {user && user.role === 'restaurant_owner' && (
                <Link
                  to="/owner"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2 rounded-lg font-semibold text-secondary"
                >
                  Owner Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-primary text-white text-center py-2 rounded-lg font-bold"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white text-center py-2 rounded-lg font-bold">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
