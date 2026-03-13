import React, { useEffect, useMemo, useState } from 'react';
import { Star, Clock, DollarSign, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/apiClient';

const RestaurantList = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  const fallbackFoodImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%25" height="100%25" fill="%231F2933"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui" font-size="20">Restaurant%20Image</text></svg>';

  const handleViewMenuClick = (id) => {
    if (!id) {
      return;
    }
    navigate(`/restaurants/${id}`);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await apiRequest('/api/restaurants');
        setRestaurants(data);
      } catch (e) {
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let list = restaurants;
    if (activeFilter !== 'All') {
      list = list.filter((r) => r.cuisine === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.city || '').toLowerCase().includes(q)
      );
    }
    if (showOnlyOpen) {
      list = list.filter((r) => r.open !== false);
    }
    if (maxPrice) {
      const limit = parseInt(maxPrice, 10);
      if (!Number.isNaN(limit)) {
        list = list.filter((r) => {
          const numeric = typeof r.minOrderValue === 'number'
            ? r.minOrderValue
            : parseInt(String(r.price || '').replace(/\D/g, ''), 10);
          return Number.isNaN(numeric) ? true : numeric <= limit;
        });
      }
    }
    const sorted = [...list];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'time') {
      sorted.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => {
        const pa = parseInt(String(a.price || '').replace(/\D/g, ''), 10) || 0;
        const pb = parseInt(String(b.price || '').replace(/\D/g, ''), 10) || 0;
        return pa - pb;
      });
    }
    return sorted;
  }, [restaurants, activeFilter, search, showOnlyOpen, maxPrice, sortBy]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Restaurants Near You</h1>
        {restaurants.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            No restaurants are live yet. Once an owner adds a restaurant, it will appear here.
          </p>
        )}
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white"
              placeholder="Search by restaurant or city"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <Filter size={14} />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyOpen}
                  onChange={(e) => setShowOnlyOpen(e.target.checked)}
                />
                <span>Open now</span>
              </label>
              <label className="flex items-center gap-1">
                <span>Max ₹</span>
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-2 py-1 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs"
                  placeholder="Any"
                />
              </label>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs md:text-sm px-3 py-2 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200"
            >
              <option value="rating">Top rated</option>
              <option value="time">Delivery time</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Indian', 'Chinese', 'Mexican', 'Italian', 'Japanese', 'Burger', 'Dessert', 'Healthy'].map((filter, idx) => (
             <button 
               key={idx}
               onClick={() => setActiveFilter(filter)}
               className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors duration-200 font-medium ${
                 activeFilter === filter 
                   ? 'bg-primary text-white shadow-md' 
                   : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover'
               }`}
             >
               {filter}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 group border border-transparent dark:border-dark-border"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img
                  src={item.coverImageUrl || item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackFoodImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-xs font-bold shadow-md dark:text-white">
                  {item.time}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                    <span className="text-green-700 dark:text-green-400 text-sm font-bold mr-1">{item.rating}</span>
                    <Star size={12} className="fill-current text-green-700 dark:text-green-400" />
                  </div>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span>{item.cuisine}</span>
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <DollarSign size={14} className="text-gray-400" />
                    <span>{item.price}</span>
                  </div>
                  <button
                    onClick={() => handleViewMenuClick(item.id)}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
