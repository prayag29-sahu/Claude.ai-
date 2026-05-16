import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaScissors } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <FaScissors className="text-gold text-6xl mx-auto mb-6 rotate-45" />
      <h1 className="font-serif text-8xl font-bold text-dark-400 mb-4">404</h1>
      <h2 className="font-serif text-3xl text-white mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="gold-btn">Go Back Home</Link>
    </motion.div>
  </div>
);

export default NotFound;
