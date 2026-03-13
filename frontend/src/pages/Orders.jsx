import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const { clearCart, addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/customer/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error();
        }
        const body = await response.json().catch(() => []);
        if (Array.isArray(body)) {
          setOrders(body);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleReorder = (order) => {
    if (!order || !order.items || order.items.length === 0) {
      return;
    }
    clearCart();
    order.items.forEach((item) => {
      addItem(
        { id: order.restaurantId, name: order.restaurantId },
        { id: item.menuItemId, name: item.name, price: item.price },
        item.quantity
      );
    });
    navigate('/cart');
  };

  if (!user) {
    return (
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex items-center justify-center text-gray-800 dark:text-gray-100">
        <div className="text-center">
          <p className="mb-4 text-sm">Please login to view your orders.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-10 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">My Orders</h1>
        {loading && (
          <p className="text-sm text-gray-600 dark:text-gray-300">Loading your orders...</p>
        )}
        {!loading && orders.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have not placed any orders yet.
          </p>
        )}
        <div className="space-y-4 mt-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-light-border/80 dark:border-dark-border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Order ID: <span className="font-mono">{order.id}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
                  Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
                  Total: <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status: <span className="font-semibold uppercase">{order.status}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReorder(order)}
                  className="px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
                >
                  Re-order
                </button>
                <button
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                  className="px-4 py-2 rounded-full border border-light-border dark:border-dark-border text-xs font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

