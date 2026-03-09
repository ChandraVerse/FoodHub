import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

const Offers = () => {
  const offers = [
    {
      id: 1,
      code: 'WELCOME50',
      discount: '50% OFF',
      description: 'Get 50% off on your first order up to $10.',
      color: 'bg-orange-500'
    },
    {
      id: 2,
      code: 'FREEDEL',
      discount: 'Free Delivery',
      description: 'Free delivery on all orders above $20.',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      code: 'PIZZAPARTY',
      discount: 'Flat $5 OFF',
      description: 'Get flat $5 off on all pizza orders.',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Exclusive Offers</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Save more with these coupons</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-dark-border"
            >
              <div className={`${offer.color} h-24 flex items-center justify-center text-white`}>
                <span className="text-3xl font-bold">{offer.discount}</span>
              </div>
              <div className="p-6 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-card p-2 rounded-full shadow-sm">
                  <Tag className="text-primary" size={24} />
                </div>
                <div className="text-center mt-4">
                  <div className="bg-gray-100 dark:bg-dark-hover py-2 px-4 rounded-lg inline-block font-mono font-bold text-gray-800 dark:text-gray-200 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 select-all">
                    {offer.code}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{offer.description}</p>
                  <button className="text-primary font-bold hover:underline">Copy Code</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
