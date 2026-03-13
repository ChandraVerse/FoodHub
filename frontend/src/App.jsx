import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OwnerDashboard from './pages/OwnerDashboard';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurants" element={<RestaurantList />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                    <Route path="/owner" element={<OwnerDashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<Orders />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
