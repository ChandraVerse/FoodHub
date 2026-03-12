import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          fetch(`http://localhost:8080/api/restaurants/${id}`),
          fetch(`http://localhost:8080/api/restaurants/${id}/menu`)
        ]);

        if (!restaurantRes.ok) {
          throw new Error('Restaurant not found');
        }
        const restaurantBody = await restaurantRes.json();
        setRestaurant(restaurantBody);

        if (menuRes.ok) {
          const menuBody = await menuRes.json().catch(() => []);
          if (Array.isArray(menuBody)) {
            setMenu(menuBody);
          }
        }
      } catch (e) {
        setError('Could not load restaurant menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddToCart = (item) => {
    if (!restaurant || !item) return;
    addItem(
      { id: restaurant.id || restaurant._id || id, name: restaurant.name },
      { id: item.id, name: item.name, price: item.price },
      1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading menu...
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
        <p className="mb-4">{error || 'Restaurant not found.'}</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Back to restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4 hover:text-primary"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {restaurant.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {restaurant.cuisine} • {restaurant.city} {restaurant.time ? `• ${restaurant.time}` : ''}
            </p>
            {restaurant.price && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {restaurant.price}
              </p>
            )}
            {restaurant.address && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {restaurant.address}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {restaurant.rating && (
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <span className="text-green-700 dark:text-green-400 font-bold mr-1">
                  {restaurant.rating}
                </span>
                <Star size={14} className="fill-current text-green-700 dark:text-green-400" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {item.category}
                </p>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-primary font-semibold text-base">
                  ₹{item.price}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
                >
                  Add to cart
                </button>
              </div>
            </motion.div>
          ))}
          {menu.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No menu items available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;

