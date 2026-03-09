import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/restaurants');
  };

  const heroImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      alt: 'Gourmet pizza with basil and cheese',
      label: 'Neapolitan Pizza'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      alt: 'Stacked juicy burgers with fries',
      label: 'Smash Burger'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      alt: 'Assorted Asian dishes on a table',
      label: 'Asian Feast'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=80',
      alt: 'Spicy Indian curry with naan',
      label: 'Indian Thali'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=800&q=80',
      alt: 'Healthy salad bowl with veggies',
      label: 'Healthy Bowl'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?auto=format&fit=crop&w=800&q=80',
      alt: 'Gourmet burger with sauces',
      label: 'Loaded Burger'
    }
  ];

  const trendingDishes = [
    {
      id: 1,
      name: 'Truffle Margherita',
      tag: 'Italian',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Double Cheese Burger',
      tag: 'American',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Sushi Platter',
      tag: 'Japanese',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Spicy Ramen Bowl',
      tag: 'Japanese',
      image: 'https://images.unsplash.com/photo-1604908176997-1251884b08a2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Paneer Butter Masala',
      tag: 'Indian',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Kung Pao Chicken',
      tag: 'Chinese',
      image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      name: 'Chicken Tacos',
      tag: 'Mexican',
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const fallbackFoodImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%25" height="100%25" fill="%23FF6B6B"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="system-ui" font-size="24">Food%20Image</text></svg>';

  const cuisines = [
    {
      id: 1,
      name: 'Indian',
      badge: 'Spicy curries',
      emoji: '🍛',
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Chinese',
      badge: 'Street-style noodles',
      emoji: '🥡',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Mexican',
      badge: 'Tacos and burritos',
      emoji: '🌮',
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Italian',
      badge: 'Pasta and pizza',
      emoji: '🍝',
      image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Japanese',
      badge: 'Sushi and ramen',
      emoji: '🍣',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Burgers',
      badge: 'Gourmet stacks',
      emoji: '🍔',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      name: 'Desserts',
      badge: 'Cakes and ice cream',
      emoji: '🍰',
      image: 'https://images.unsplash.com/photo-1517244866741-cc129009c8f9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      name: 'Healthy Bowls',
      badge: 'Salads and bowls',
      emoji: '🥗',
      image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff40,_transparent_55%)]" />
        <div className="absolute -bottom-24 -left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
        <div className="absolute -top-24 -right-10 w-72 h-72 bg-black/20 blur-3xl rounded-full" />

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-xs font-semibold mb-4 border border-white/10"
            >
              <span className="text-sm">🔥</span>
              Trending in your city now
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              Delicious Food <br /> Delivered To You
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl mb-8 text-white/90 max-w-xl mx-auto md:mx-0"
            >
              Browse handpicked restaurants and track your order with real-time updates and live couriers.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto md:mx-0 bg-white/95 dark:bg-dark-card rounded-full p-2 flex shadow-2xl backdrop-blur"
            >
              <div className="flex items-center pl-4 md:pl-6 text-gray-400">
                <MapPin size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your delivery location..." 
                className="flex-grow px-4 py-3 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 text-sm md:text-base"
              />
              <button 
                onClick={handleSearch}
                className="bg-gray-900 dark:bg-primary text-white px-5 md:px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-red-500 transition duration-300 flex items-center gap-2 mr-1"
              >
                <Search size={18} />
                <span className="hidden md:inline">Find Food</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-white/80"
            >
              <div className="flex -space-x-3">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-sm text-gray-800 border border-white/40">
                  🍕
                </div>
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-sm text-gray-800 border border-white/40">
                  🍣
                </div>
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-sm text-gray-800 border border-white/40">
                  🍔
                </div>
              </div>
              <p className="sm:ml-2">
                Trusted by <span className="font-semibold">1,200+</span> restaurants and <span className="font-semibold">50k+</span> food lovers.
              </p>
            </motion.div>
          </div>

          <div className="relative h-80 md:h-[420px]">
            <div className="absolute inset-0 bg-black/10 rounded-[2.5rem] blur-3xl" />
            <div className="relative h-full grid grid-cols-2 gap-4 md:gap-6">
              {heroImages.slice(0, 4).map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: 1, 
                    y: index % 2 === 0 ? [0, -12, 0] : [0, 12, 0] 
                  }}
                  transition={{ 
                    duration: 0.9, 
                    delay: 0.3 + index * 0.15,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    repeatDelay: 1.2,
                    ease: 'easeInOut'
                  }}
                  className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900/40 backdrop-blur-md"
                >
                  <div className="h-full w-full overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackFoodImage;
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold">{image.label}</p>
                    <p className="text-[10px] md:text-xs text-white/70">From top-rated local restaurants</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-dark-bg border-b border-light-border/60 dark:border-dark-border/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Trending now</h2>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Fresh picks from your favorite places</span>
          </div>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...trendingDishes, ...trendingDishes].map((dish, index) => (
                <div
                  key={`${dish.id}-${index}`}
                  className="min-w-[220px] md:min-w-[260px] bg-white dark:bg-dark-card rounded-2xl shadow-md overflow-hidden border border-light-border/60 dark:border-dark-border/80"
                >
                  <div className="h-36 md:h-40 w-full overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackFoodImage;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{dish.tag}</p>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{dish.name}</h3>
                    </div>
                    <span className="text-lg md:text-xl">🔥</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-dark-bg transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Popular Cuisines</h2>
              <p className="text-gray-500 dark:text-gray-400">Explore the best food around you</p>
            </div>
            <Link to="/restaurants" className="text-primary font-semibold hover:underline hidden md:block">See All</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cuisines.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/restaurants')}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-light-border/60 dark:border-dark-border/80 bg-white dark:bg-dark-card"
              >
                <div className="relative h-28 md:h-32 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackFoodImage;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm md:text-base font-semibold text-white">{item.name}</span>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between text-xs md:text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.badge}</span>
                  <span className="text-primary font-semibold">View</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Promotional Section */}
      <section className="py-20 bg-gray-100 dark:bg-[#1f1f1f]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
               {/* Placeholder for App Image */}
               <div className="bg-gray-300 dark:bg-gray-700 rounded-3xl h-96 w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  App Preview Image
               </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Get the full experience on the mobile app
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Order on the go, track your delivery in real-time, and get exclusive mobile-only offers.
              </p>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition">
                  {/* Apple Icon */}
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-bold leading-none">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition">
                  {/* Play Store Icon */}
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
