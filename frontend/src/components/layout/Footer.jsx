import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white text-lg font-extrabold shadow-md">
                FH
              </span>
              <span>
                Food<span className="text-primary">Hub</span>
              </span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Delicious food delivered to your doorstep. We partner with the best restaurants to ensure you get the best quality food.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ride with us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-primary">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodHub. All rights reserved. Made with ❤️ for foodies.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
