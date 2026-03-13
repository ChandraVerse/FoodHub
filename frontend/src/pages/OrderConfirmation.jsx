import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${id}`);
        if (!response.ok) {
          throw new Error();
        }
        const body = await response.json();
        setOrder(body);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      load();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex items-center justify-center text-gray-800 dark:text-gray-100">
        Processing your order...
      </div>
    );
  }

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 border border-light-border/80 dark:border-dark-border">
          <h1 className="text-2xl font-extrabold mb-2 text-gray-900 dark:text-white">
            Thank you for your order
          </h1>
          {id && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Your order ID is <span className="font-semibold">{id}</span>.
            </p>
          )}
          {order && (
            <div className="mb-6 text-sm text-gray-700 dark:text-gray-200">
              <p className="mb-1">
                Restaurant: <span className="font-semibold">{order.restaurantId}</span>
              </p>
              <p className="mb-1">
                Total amount:{' '}
                <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
              </p>
              <p className="mb-1">
                Status: <span className="font-semibold">{order.status}</span>
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="inline-flex justify-center px-4 py-2 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-hover"
            >
              View my orders
            </Link>
            <Link
              to="/restaurants"
              className="inline-flex justify-center px-4 py-2 rounded-full border border-light-border dark:border-dark-border text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

