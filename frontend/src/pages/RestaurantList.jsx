import React, { useEffect, useState } from 'react';
import { Star, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RestaurantList = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [restaurants, setRestaurants] = useState([]);

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
        const response = await fetch('http://localhost:8080/api/restaurants');
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (e) {
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = activeFilter === 'All'
    ? restaurants
    : restaurants.filter(r => r.cuisine === activeFilter);

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Restaurants Near You</h1>
        {restaurants.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            No restaurants are live yet. Once an owner adds a restaurant, it will appear here.
          </p>
        )}
        
        {/* Filters */}
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
                  src={item.image}
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
