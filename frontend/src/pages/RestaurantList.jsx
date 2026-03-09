import React, { useState } from 'react';
import { Star, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const RestaurantList = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const restaurants = [
    {
      id: 1,
      name: 'Bella Italia',
      cuisine: 'Italian',
      rating: 4.8,
      time: '20-30 min',
      price: '$20 for two',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 2,
      name: 'Bombay Darbar',
      cuisine: 'Indian',
      rating: 4.7,
      time: '25-35 min',
      price: '$18 for two',
      image: 'https://images.unsplash.com/photo-1604908176997-1251884b08a2?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 3,
      name: 'Dragon Wok',
      cuisine: 'Chinese',
      rating: 4.6,
      time: '30-40 min',
      price: '$22 for two',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 4,
      name: 'Casa Mexicana',
      cuisine: 'Mexican',
      rating: 4.5,
      time: '20-30 min',
      price: '$19 for two',
      image: 'https://images.unsplash.com/photo-1601924582971-dfdf0f3f357f?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 5,
      name: 'Osaka Sushi Bar',
      cuisine: 'Japanese',
      rating: 4.9,
      time: '35-45 min',
      price: '$35 for two',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 6,
      name: 'Burger Hub',
      cuisine: 'Burger',
      rating: 4.3,
      time: '15-25 min',
      price: '$16 for two',
      image: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 7,
      name: 'Sweet Treats',
      cuisine: 'Dessert',
      rating: 4.7,
      time: '10-20 min',
      price: '$14 for two',
      image: 'https://images.unsplash.com/photo-1542826438-bd32f43b01c5?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 8,
      name: 'Veggie Bowl Co.',
      cuisine: 'Healthy',
      rating: 4.4,
      time: '20-30 min',
      price: '$17 for two',
      image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const fallbackFoodImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%25" height="100%25" fill="%231F2933"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui" font-size="20">Restaurant%20Image</text></svg>';

  const handleViewMenuClick = () => {
    if (typeof window !== 'undefined') {
      window.alert('Please login as a customer to view the menu.');
    }
  };

  const filteredRestaurants = activeFilter === 'All' 
    ? restaurants 
    : restaurants.filter(r => r.cuisine === activeFilter);

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Restaurants Near You</h1>
        
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
                    onClick={handleViewMenuClick}
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
