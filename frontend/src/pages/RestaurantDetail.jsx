import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [restaurantRes, menuRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/restaurants/${id}`),
          fetch(`http://localhost:8080/api/restaurants/${id}/menu`),
          fetch(`http://localhost:8080/api/restaurants/${id}/reviews`)
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
        if (reviewsRes.ok) {
          const reviewsBody = await reviewsRes.json().catch(() => null);
          if (reviewsBody && Array.isArray(reviewsBody.reviews)) {
            setReviews(reviewsBody.reviews);
            if (typeof reviewsBody.averageRating === 'number') {
              setAverageRating(reviewsBody.averageRating);
            }
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

  const groupedMenu = menu.reduce((acc, item) => {
    const key = item.category || 'Others';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const recommended = menu.slice(0, 3);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!user || !user.token) {
      if (typeof window !== 'undefined') {
        window.alert('Please login as a customer to leave a review.');
      }
      navigate('/login');
      return;
    }
    try {
      setSubmittingReview(true);
      const body = {
        rating: Number(ratingInput),
        comment: commentInput
      };
      const response = await fetch(`http://localhost:8080/api/restaurants/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error();
      }
      const saved = await response.json();
      setReviews((prev) => [saved, ...prev]);
      const all = [saved, ...reviews];
      const avg =
        all.length > 0
          ? all.reduce((sum, r) => sum + (r.rating || 0), 0) / all.length
          : null;
      setAverageRating(avg);
      setRatingInput(5);
      setCommentInput('');
    } catch {
      if (typeof window !== 'undefined') {
        window.alert('Could not submit review. Please try again.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

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
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-3">
              {restaurant.pincode && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {restaurant.pincode}
                </span>
              )}
              {restaurant.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} /> {restaurant.phone}
                </span>
              )}
              {restaurant.openingHours && (
                <span className="inline-flex items-center gap-1">
                  ⏰ {restaurant.openingHours}
                </span>
              )}
              {restaurant.minOrderValue && (
                <span className="inline-flex items-center gap-1">
                  Min order ₹{restaurant.minOrderValue}
                </span>
              )}
              {restaurant.deliveryFee && (
                <span className="inline-flex items-center gap-1">
                  Delivery fee ₹{restaurant.deliveryFee}
                </span>
              )}
              {restaurant.pureVeg && (
                <span className="inline-flex items-center gap-1">
                  🥗 Pure veg
                </span>
              )}
            </div>
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

        {recommended.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Recommended
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recommended.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddToCart(item)}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  {item.name} • ₹{item.price}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
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
              </div>
            </div>
          ))}
          {menu.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No menu items available yet.
            </p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Reviews
            </h2>
            {averageRating != null && (
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                Average rating:{' '}
                <span className="font-semibold">
                  {averageRating.toFixed(1)} / 5
                </span>
              </p>
            )}
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this restaurant.
              </p>
            )}
            <div className="space-y-3 mt-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-dark-card rounded-xl border border-light-border/80 dark:border-dark-border p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.customerEmail || 'Customer'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                      <Star size={12} className="fill-current" /> {review.rating}/5
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Write a review
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} / 5
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comment (optional)
                </label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Share your experience"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60"
              >
                {submittingReview ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
