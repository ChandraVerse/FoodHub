import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'customer'
    }
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message || 'Signup failed. Please try again.';
        if (typeof window !== 'undefined') {
          window.alert(message);
        }
        return;
      }

      const body = await response.json().catch(() => null);
      if (body && body.userId && body.role) {
        login({
          id: body.userId,
          role: body.role,
          email: data.email
        });
      }
      if (typeof window !== 'undefined') {
        window.alert('Signup successful.');
      }
      navigate('/');
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.alert('Could not connect to server. Please make sure the backend is running.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-10 rounded-2xl shadow-xl"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join us for delicious food
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input
              {...register("name", { required: "Full name is required" })}
              type="text"
              className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-dark-border placeholder-gray-500 text-gray-900 dark:text-white dark:bg-dark-hover focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Full Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Sign up as
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover px-3 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="customer"
                  {...register('role', { required: true })}
                  className="text-primary focus:ring-primary"
                />
                <span>Customer</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-hover px-3 py-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="restaurant_owner"
                  {...register('role', { required: true })}
                  className="text-primary focus:ring-primary"
                />
                <span>Restaurant Owner</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-dark-border placeholder-gray-500 text-gray-900 dark:text-white dark:bg-dark-hover focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone size={20} />
            </div>
            <input
              {...register("phone", { required: "Phone number is required" })}
              type="tel"
              className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-dark-border placeholder-gray-500 text-gray-900 dark:text-white dark:bg-dark-hover focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Phone Number"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
              type="password"
              className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 dark:border-dark-border placeholder-gray-500 text-gray-900 dark:text-white dark:bg-dark-hover focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              Sign up
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
