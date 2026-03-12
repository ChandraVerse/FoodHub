import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Tag } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
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
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full transition-colors text-gray-700 dark:text-gray-300">
            <ShoppingBag size={24} />
            <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </Link>
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
                   <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
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
