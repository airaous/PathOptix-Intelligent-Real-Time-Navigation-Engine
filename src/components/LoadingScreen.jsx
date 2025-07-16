import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center">
            <Navigation className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          PathOptix
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 text-lg mb-8"
        >
          Intelligent Navigation Engine
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex items-center justify-center space-x-3"
        >
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          <span className="text-gray-500 font-medium">Loading Maps...</span>
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex justify-center space-x-2 mt-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
          ))}
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 space-y-2 text-sm text-gray-500"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            <span>Real-time Traffic Analysis</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>Multi-modal Route Planning</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <span>Smart Route Optimization</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
