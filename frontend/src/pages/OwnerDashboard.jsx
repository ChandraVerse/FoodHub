import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, ClipboardList, Utensils, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    cuisine: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    price: '',
    coverImageUrl: '',
    openingHours: '',
    minOrderValue: '',
    deliveryFee: '',
    open: true,
    pureVeg: false
  });
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    veg: true,
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = user && user.role === 'restaurant_owner';

  const [ordersToday, setOrdersToday] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = useState(0);

  const stats = useMemo(
    () => [
      {
        label: 'Active Restaurants',
        value: restaurants.length,
        icon: Store,
        color: 'from-primary/10 to-primary/5'
      },
      {
        label: 'Menu Items',
        value: selectedRestaurant ? menuItems.length : 0,
        icon: Utensils,
        color: 'from-secondary/10 to-secondary/5'
      },
      {
        label: 'Orders Today',
        value: ordersToday,
        icon: ClipboardList,
        color: 'from-emerald-100/40 to-emerald-50/40'
      },
      {
        label: 'Monthly Revenue',
        value: `₹ ${monthlyRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        icon: BarChart2,
        color: 'from-amber-100/40 to-amber-50/40'
      },
      {
        label: 'Orders This Month',
        value: totalOrdersThisMonth,
        icon: ClipboardList,
        color: 'from-blue-100/40 to-blue-50/40'
      }
    ],
    [restaurants.length, selectedRestaurant, menuItems.length, ordersToday, monthlyRevenue, totalOrdersThisMonth]
  );

  useEffect(() => {
    if (!isOwner) {
      return;
    }

    const token = user?.token;

    const commonHeaders = token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {};

    const loadRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/owner/restaurants', {
          headers: {
            ...commonHeaders
          }
        });
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const ownerId = user ? user.id : null;
          const filtered = ownerId
            ? data.filter((r) => r.ownerId === ownerId)
            : data.filter((r) => r.ownerId);
          setRestaurants(
            filtered.map((r) => ({
              id: r.id || r._id,
              name: r.name,
              cuisine: r.cuisine,
              status: 'Open',
              items: 0
            }))
          );
        } else {
          setRestaurants([]);
        }
      } catch (e) {
        setError('Could not load restaurants from backend.');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    const loadMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/owner/metrics', {
          headers: {
            ...commonHeaders
          }
        });
        if (!response.ok) {
          return;
        }
        const body = await response.json().catch(() => null);
        if (body) {
          if (typeof body.ordersToday === 'number') {
            setOrdersToday(body.ordersToday);
          }
          if (typeof body.monthlyRevenue === 'number') {
            setMonthlyRevenue(body.monthlyRevenue);
          }
          if (typeof body.totalOrdersThisMonth === 'number') {
            setTotalOrdersThisMonth(body.totalOrdersThisMonth);
          }
        }
      } catch {
      }
    };

    loadRestaurants();
    loadMetrics();
  }, [isOwner, user]);

  const handleRestaurantFormChange = (event) => {
    const { name, value } = event.target;
    setRestaurantForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateRestaurant = () => {
    setRestaurantForm({
      name: '',
      cuisine: '',
      description: '',
      address: '',
      city: '',
      pincode: '',
      phone: '',
      price: '',
      coverImageUrl: '',
      openingHours: '',
      minOrderValue: '',
      deliveryFee: '',
      open: true,
      pureVeg: false
    });
    setEditingRestaurant(null);
    setShowRestaurantForm(true);
  };

  const saveRestaurant = async () => {
    try {
      const token = user?.token;
      const body = {
        name: restaurantForm.name,
        cuisine: restaurantForm.cuisine,
        description: restaurantForm.description,
        address: restaurantForm.address,
        city: restaurantForm.city,
        pincode: restaurantForm.pincode,
        phone: restaurantForm.phone,
        price: restaurantForm.price,
        coverImageUrl: restaurantForm.coverImageUrl,
        openingHours: restaurantForm.openingHours,
        minOrderValue: restaurantForm.minOrderValue ? parseFloat(restaurantForm.minOrderValue) : null,
        deliveryFee: restaurantForm.deliveryFee ? parseFloat(restaurantForm.deliveryFee) : null,
        open: restaurantForm.open,
        pureVeg: restaurantForm.pureVeg,
        ownerId: user ? user.id : null
      };
      const url = editingRestaurant
        ? `http://localhost:8080/api/owner/restaurants/${editingRestaurant.id}`
        : 'http://localhost:8080/api/owner/restaurants';
      const method = editingRestaurant ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error();
      }
      const saved = await response.json();
      if (editingRestaurant) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === editingRestaurant.id
              ? {
                  id: saved.id,
                  name: saved.name,
                  cuisine: saved.cuisine,
                  status: r.status,
                  items: r.items
                }
              : r
          )
        );
      } else {
        setRestaurants((prev) => [
          ...prev,
          {
            id: saved.id,
            name: saved.name,
            cuisine: saved.cuisine,
            status: 'Open',
            items: 0
          }
        ]);
      }
      setEditingRestaurant(null);
      setShowRestaurantForm(false);
    } catch (e) {
      showError('Could not save restaurant. Please try again.');
    }
  };

  const openEditRestaurant = (restaurant) => {
    setRestaurantForm({
      name: restaurant.name || '',
      cuisine: restaurant.cuisine || '',
      description: restaurant.description || '',
      address: restaurant.address || '',
      city: restaurant.city || '',
      pincode: restaurant.pincode || '',
      phone: restaurant.phone || '',
      price: restaurant.price || '',
      coverImageUrl: restaurant.coverImageUrl || '',
      openingHours: restaurant.openingHours || '',
      minOrderValue: restaurant.minOrderValue != null ? String(restaurant.minOrderValue) : '',
      deliveryFee: restaurant.deliveryFee != null ? String(restaurant.deliveryFee) : '',
      open: restaurant.open !== false,
      pureVeg: restaurant.pureVeg === true
    });
    setEditingRestaurant(restaurant);
    setShowRestaurantForm(true);
  };

  const deleteRestaurant = async (restaurant) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Delete restaurant "${restaurant.name}"? This cannot be undone.`
      );
      if (!confirmed) {
        return;
      }
    }
    try {
      const token = user?.token;
      const response = await fetch(
        `http://localhost:8080/api/owner/restaurants/${restaurant.id}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      if (!response.ok && response.status !== 204) {
        throw new Error();
      }
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      if (selectedRestaurant && selectedRestaurant.id === restaurant.id) {
        setSelectedRestaurant(null);
        setMenuItems([]);
      }
    } catch (e) {
      showError('Could not delete restaurant. Please try again.');
    }
  };

  const loadMenuItems = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuItems([]);
    setOrders([]);
    try {
      const response = await fetch(`http://localhost:8080/api/owner/restaurants/${restaurant.id}/menu`);
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setMenuItems(
          data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            imageUrl: item.imageUrl,
            veg: item.veg,
            available: item.available
          }))
        );
      }
    } catch (e) {
      showError('Could not load menu items. Please try again.');
    }
  };

  const loadOrders = async (restaurant) => {
    if (!restaurant) {
      return;
    }
    try {
      const token = user?.token;
      const response = await fetch(
        `http://localhost:8080/api/owner/restaurants/${restaurant.id}/orders`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (e) {
      showError('Could not load orders for this restaurant.');
      setOrders([]);
    }
  };

  const handleStatusChange = async (order, status) => {
    try {
      const token = user?.token;
      const response = await fetch(`http://localhost:8080/api/owner/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error();
      }
      const saved = await response.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === saved.id ? saved : o))
      );
      showSuccess('Order status updated.');
    } catch (e) {
      showError('Could not update order status.');
    }
  };

  const openCreateMenuItem = () => {
    if (!selectedRestaurant) {
      return;
    }
    setMenuForm({
      id: null,
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      veg: true,
      available: true
    });
    setEditingMenuItem(null);
    setShowMenuForm(true);
  };

  const handleMenuFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveMenuItem = async () => {
    if (!selectedRestaurant) {
      return;
    }
    try {
      const token = user?.token;
      const body = {
        name: menuForm.name,
        description: menuForm.description,
        category: menuForm.category,
        price: parseFloat(menuForm.price || '0'),
        imageUrl: menuForm.imageUrl,
        veg: menuForm.veg,
        available: menuForm.available
      };
      const url = editingMenuItem
        ? `http://localhost:8080/api/owner/restaurants/${selectedRestaurant.id}/menu/${editingMenuItem.id}`
        : `http://localhost:8080/api/owner/restaurants/${selectedRestaurant.id}/menu`;
      const method = editingMenuItem ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error();
      }
      const saved = await response.json();
      if (editingMenuItem) {
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === editingMenuItem.id
              ? {
                  id: saved.id,
                  name: saved.name,
                  category: saved.category,
                  price: saved.price,
                  imageUrl: saved.imageUrl,
                  veg: saved.veg,
                  available: saved.available
                }
              : item
          )
        );
      } else {
        setMenuItems((prev) => [
          ...prev,
          {
            id: saved.id,
            name: saved.name,
            category: saved.category,
            price: saved.price,
            imageUrl: saved.imageUrl,
            veg: saved.veg,
            available: saved.available
          }
        ]);
      }
      setEditingMenuItem(null);
      setShowMenuForm(false);
    } catch (e) {
      showError('Could not save menu item. Please try again.');
    }
  };

  const openEditMenuItem = (item) => {
    setMenuForm({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: String(item.price ?? ''),
      imageUrl: item.imageUrl || '',
      veg: item.veg,
      available: item.available
    });
    setEditingMenuItem(item);
    setShowMenuForm(true);
  };

  const deleteMenuItem = async (item) => {
    if (!selectedRestaurant) {
      return;
    }
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Delete menu item "${item.name}"? This cannot be undone.`
      );
      if (!confirmed) {
        return;
      }
    }
    try {
      const token = user?.token;
      const response = await fetch(
        `http://localhost:8080/api/owner/restaurants/${selectedRestaurant.id}/menu/${item.id}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      if (!response.ok && response.status !== 204) {
        throw new Error();
      }
      setMenuItems((prev) => prev.filter((m) => m.id !== item.id));
    } catch (e) {
      showError('Could not delete menu item. Please try again.');
    }
  };

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
            <button
              className="text-sm font-semibold text-primary hover:underline"
              onClick={openCreateRestaurant}
            >
              + Add restaurant
            </button>
          </div>
          <div className="space-y-3">
            {loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading restaurants…</p>
            )}
            {!loading && restaurants.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No restaurants found. Use “Add restaurant” to create one.
              </p>
            )}
            {error && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {error}
              </p>
            )}
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
                <div className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      r.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600/40 dark:text-gray-200'
                    }`}
                  >
                    {r.status}
                  </span>
                  <button
                    className="text-xs md:text-sm font-semibold text-primary hover:underline"
                    onClick={() => {
                      loadMenuItems(r);
                      loadOrders(r);
                    }}
                  >
                    Manage menu
                  </button>
                  <button
                    className="text-xs text-gray-600 dark:text-gray-300 hover:underline"
                    onClick={() => openEditRestaurant(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    onClick={() => deleteRestaurant(r)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Menu & orders</h2>
          {!selectedRestaurant && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a restaurant and click Manage menu to view and edit items.
            </p>
          )}
          {selectedRestaurant && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Restaurant</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedRestaurant.name}
                  </p>
                </div>
                <button
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={openCreateMenuItem}
                >
                  + Add menu item
                </button>
              </div>
              {menuItems.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No menu items yet. Add your first dish.
                </p>
              )}
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-light-border/80 dark:border-dark-border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.category} • ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                        {item.veg ? 'Veg' : 'Non-veg'}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-600/40 dark:text-gray-200'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        className="text-xs text-gray-500 hover:underline"
                        onClick={() =>
                          setMenuItems((prev) => {
                            if (index === 0) return prev;
                            const next = [...prev];
                            const [moved] = next.splice(index, 1);
                            next.splice(index - 1, 0, moved);
                            return next;
                          })
                        }
                      >
                        ↑
                      </button>
                      <button
                        className="text-xs text-gray-500 hover:underline"
                        onClick={() =>
                          setMenuItems((prev) => {
                            if (index === prev.length - 1) return prev;
                            const next = [...prev];
                            const [moved] = next.splice(index, 1);
                            next.splice(index + 1, 0, moved);
                            return next;
                          })
                        }
                      >
                        ↓
                      </button>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => openEditMenuItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                        onClick={() => deleteMenuItem(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {menuItems.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-xs">
                  <button
                    className="text-primary hover:underline"
                    onClick={() =>
                      setMenuItems((prev) =>
                        prev.map((item) => ({ ...item, available: true }))
                      )
                    }
                  >
                    Mark all available
                  </button>
                  <button
                    className="text-gray-600 dark:text-gray-300 hover:underline"
                    onClick={() =>
                      setMenuItems((prev) =>
                        prev.map((item) => ({ ...item, available: false }))
                      )
                    }
                  >
                    Mark all unavailable
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRestaurant && (
        <div className="mt-8 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent orders</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {orders.length} order(s)
            </p>
          </div>
          {orders.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No orders yet for this restaurant.
            </p>
          )}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-light-border/80 dark:border-dark-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.customerEmail || 'Customer'} • {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="text-xs px-2 py-1 rounded-full border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-gray-800 dark:text-gray-100"
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRestaurantForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-light-border/80 dark:border-dark-border w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add restaurant
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              <input
                name="name"
                value={restaurantForm.name}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Restaurant name"
              />
              <input
                name="cuisine"
                value={restaurantForm.cuisine}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Cuisine (e.g. Indian, Italian)"
              />
              <textarea
                name="description"
                value={restaurantForm.description}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Short description"
                rows={3}
              />
              <input
                name="address"
                value={restaurantForm.address}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Street address"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  name="city"
                  value={restaurantForm.city}
                  onChange={handleRestaurantFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="City"
                />
                <input
                  name="pincode"
                  value={restaurantForm.pincode}
                  onChange={handleRestaurantFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Pincode"
                />
                <input
                  name="phone"
                  value={restaurantForm.phone}
                  onChange={handleRestaurantFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Phone"
                />
              </div>
              <input
                name="price"
                value={restaurantForm.price}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Average price (e.g. ₹300 for two)"
              />
              <input
                name="coverImageUrl"
                value={restaurantForm.coverImageUrl}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Cover image URL"
              />
              <input
                name="openingHours"
                value={restaurantForm.openingHours}
                onChange={handleRestaurantFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Opening hours (e.g. 11am – 11pm)"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="minOrderValue"
                  value={restaurantForm.minOrderValue}
                  onChange={handleRestaurantFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Min order value (₹)"
                />
                <input
                  name="deliveryFee"
                  value={restaurantForm.deliveryFee}
                  onChange={handleRestaurantFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Delivery fee (₹)"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-800 dark:text-gray-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="open"
                    checked={restaurantForm.open}
                    onChange={(e) =>
                      setRestaurantForm((prev) => ({
                        ...prev,
                        open: e.target.checked
                      }))
                    }
                  />
                  <span>Currently open</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pureVeg"
                    checked={restaurantForm.pureVeg}
                    onChange={(e) =>
                      setRestaurantForm((prev) => ({
                        ...prev,
                        pureVeg: e.target.checked
                      }))
                    }
                  />
                  <span>Pure veg</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setShowRestaurantForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover"
                onClick={saveRestaurant}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showMenuForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-light-border/80 dark:border-dark-border w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add menu item
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              <input
                name="name"
                value={menuForm.name}
                onChange={handleMenuFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Dish name"
              />
              <textarea
                name="description"
                value={menuForm.description}
                onChange={handleMenuFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Description"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="category"
                  value={menuForm.category}
                  onChange={handleMenuFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Category (e.g. Starters)"
                />
                <input
                  name="price"
                  value={menuForm.price}
                  onChange={handleMenuFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                  placeholder="Price (₹)"
                />
              </div>
              <input
                name="imageUrl"
                value={menuForm.imageUrl}
                onChange={handleMenuFormChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border/80 dark:border-dark-border bg-white dark:bg-dark-hover text-sm text-gray-900 dark:text-white"
                placeholder="Image URL"
              />
              <div className="flex items-center gap-4 text-sm text-gray-800 dark:text-gray-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="veg"
                    checked={menuForm.veg}
                    onChange={handleMenuFormChange}
                  />
                  <span>Veg</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={menuForm.available}
                    onChange={handleMenuFormChange}
                  />
                  <span>Available</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => setShowMenuForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover"
                onClick={saveMenuItem}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
