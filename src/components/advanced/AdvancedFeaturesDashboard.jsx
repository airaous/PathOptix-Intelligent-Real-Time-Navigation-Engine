
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MultiModalTransport from './MultiModalTransport';
import EnvironmentalTracker from './EnvironmentalTracker';
import SmartNotifications from './SmartNotifications';

const AdvancedFeaturesDashboard = ({ routeData, onFeatureChange }) => {
  const [activeFeature, setActiveFeature] = useState('multimodal');
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { id: 'multimodal', label: 'Multi-Modal', icon: '🚀', component: MultiModalTransport },
    { id: 'environmental', label: 'Eco Impact', icon: '🌍', component: EnvironmentalTracker },
    { id: 'notifications', label: 'Smart Alerts', icon: '🔔', component: SmartNotifications }
  ];

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg"
      >
        <span className="text-lg">⚡</span>
      </motion.button>

      {/* Dashboard Panel - Optimized for Portrait Mode */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-4 bottom-20 z-40 w-80 max-w-[calc(100vw-2rem)] h-[60vh] max-h-96"
          >
            <div className="bg-white rounded-xl shadow-2xl h-full flex flex-col overflow-hidden">
              {/* Feature Tabs - Compact */}
              <div className="flex border-b flex-shrink-0">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`flex-1 p-2 text-center transition-all ${
                      activeFeature === feature.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-sm mb-1">{feature.icon}</div>
                    <div className="text-xs font-medium">{feature.label}</div>
                  </button>
                ))}
              </div>

              {/* Active Feature Content - Scrollable */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {ActiveComponent && (
                      <ActiveComponent
                        routeData={routeData}
                        onModeChange={onFeatureChange}
                        travelMode={routeData?.travel_mode || 'driving'}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdvancedFeaturesDashboard;
