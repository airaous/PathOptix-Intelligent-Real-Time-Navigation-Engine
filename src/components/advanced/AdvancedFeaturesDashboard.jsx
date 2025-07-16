
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
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg"
      >
        <span className="text-xl">⚡</span>
      </motion.button>

      {/* Dashboard Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-4 bottom-20 z-40 w-96 max-h-[70vh] overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Feature Tabs */}
              <div className="flex border-b">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`flex-1 p-3 text-center transition-all ${
                      activeFeature === feature.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-lg mb-1">{feature.icon}</div>
                    <div className="text-xs font-medium">{feature.label}</div>
                  </button>
                ))}
              </div>

              {/* Active Feature Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
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
