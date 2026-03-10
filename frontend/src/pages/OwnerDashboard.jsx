import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, ClipboardList, Utensils, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner = user && user.role === 'restaurant_owner';

  const stats = useMemo(
    () => [
      { label: 'Active Restaurants', value: 2, icon: Store, color: 'from-primary/10 to-primary/5' },
      { label: 'Menu Items', value: 18, icon: Utensils, color: 'from-secondary/10 to-secondary/5' },
      { label: 'Orders Today', value: 12, icon: ClipboardList, color: 'from-emerald-100/40 to-emerald-50/40' },
      { label: 'Monthly Revenue', value: '₹ 42,500', icon: BarChart2, color: 'from-amber-100/40 to-amber-50/40' }
    ],
    []
  );

  const restaurants = [
    {
      id: 1,
      name: 'Bombay Darbar',
      cuisine: 'Indian',
      status: 'Open',
      items: 8,
      highlighted: true
    },
    {
      id: 2,
      name: 'Casa Mexicana',
      cuisine: 'Mexican',
      status: 'Closed',
      items: 10,
      highlighted: false
    }
  ];

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center bg-white dark:bg-dark-card rounded-2xl shadow-md p-8 border border-light-border/80 dark:border-dark-border">
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Restricted</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Owner dashboard only</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please login as a restaurant owner account to manage restaurants and menus.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Owner dashboard</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, <span className="text-primary">Owner</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Monitor restaurant performance and keep your menus up to date.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 px-4 py-3 rounded-2xl"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white text-lg font-extrabold shadow-md">
            FH
          </span>
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">FoodHub Business</p>
            <p className="text-xs text-gray-700 dark:text-gray-200">You are viewing the owner area</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`rounded-2xl border border-light-border/80 dark:border-dark-border bg-gradient-to-br ${item.color} p-4 flex flex-col gap-2`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                {item.label}
              </p>
              <item.icon size={18} className="text-primary" />
            </div>
            <p className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your restaurants</h2>
            <button className="text-sm font-semibold text-primary hover:underline">
              + Add restaurant
            </button>
          </div>
          <div className="space-y-3">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-light-border/80 dark:border-dark-border bg-light-card dark:bg-dark-hover px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                    {r.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {r.cuisine} • {r.items} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      r.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600/40 dark:text-gray-200'
                    }`}
                  >
                    {r.status}
                  </span>
                  <button className="text-xs md:text-sm font-semibold text-primary hover:underline">
                    Manage menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Today overview</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            This is sample data. Connect to the backend to view live analytics.
          </p>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <li className="flex justify-between">
              <span>Pending orders</span>
              <span className="font-semibold">4</span>
            </li>
            <li className="flex justify-between">
              <span>Completed orders</span>
              <span className="font-semibold">8</span>
            </li>
            <li className="flex justify-between">
              <span>Average rating</span>
              <span className="font-semibold">4.6 ★</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

