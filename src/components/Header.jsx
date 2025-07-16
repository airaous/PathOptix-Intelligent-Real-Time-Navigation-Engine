import React from 'react';
import { Navigation, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-10 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg"
          >
            <Navigation className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PathOptix
            </h1>
            <p className="text-sm text-gray-500">Intelligent Navigation Engine</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Real-time Optimization</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-green-500" />
            <span>Smart Routing</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:block">
            <span className="text-xs text-gray-400">Powered by</span>
            <div className="text-sm font-medium text-gray-600">Google Maps</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
