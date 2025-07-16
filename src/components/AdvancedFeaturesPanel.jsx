import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedFeaturesPanel = ({ 
  route, 
  mlPrediction, 
  onFeatureToggle,
  onClose,
  className = ""
}) => {
  const [features, setFeatures] = useState({
    smartRerouting: true,
    predictiveTraffic: true,
    ecoMode: false,
    voiceNavigation: false,
    realTimeIncidents: true,
    dynamicPricing: false,
    weatherAdaptation: true,
    carbonTracking: false
  });

  const [notifications, setNotifications] = useState([]);
  const [ecoMetrics, setEcoMetrics] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Feature configurations
  const featureConfig = {
    smartRerouting: {
      icon: '🧠',
      title: 'Smart AI Rerouting',
      description: 'Automatically reroute based on real-time conditions',
      premium: false
    },
    predictiveTraffic: {
      icon: '🔮',
      title: 'Predictive Traffic Analysis',
      description: 'Forecast traffic patterns up to 2 hours ahead',
      premium: true
    },
    ecoMode: {
      icon: '🌱',
      title: 'Eco-Friendly Mode',
      description: 'Optimize routes for fuel efficiency and low emissions',
      premium: false
    },
    voiceNavigation: {
      icon: '🗣️',
      title: 'AI Voice Navigation',
      description: 'Natural language voice guidance with real-time updates',
      premium: true
    },
    realTimeIncidents: {
      icon: '🚨',
      title: 'Real-Time Incidents',
      description: 'Live accident, construction, and hazard alerts',
      premium: false
    },
    dynamicPricing: {
      icon: '💰',
      title: 'Dynamic Toll Pricing',
      description: 'Real-time toll prices and cost optimization',
      premium: true
    },
    weatherAdaptation: {
      icon: '🌤️',
      title: 'Weather-Adaptive Routing',
      description: 'Route adjustments based on weather conditions',
      premium: false
    },
    carbonTracking: {
      icon: '📊',
      title: 'Carbon Footprint Tracking',
      description: 'Track and offset your travel carbon emissions',
      premium: true
    }
  };

  // Toggle feature
  const toggleFeature = useCallback((featureName) => {
    setFeatures(prev => {
      const newFeatures = { ...prev, [featureName]: !prev[featureName] };
      onFeatureToggle?.(featureName, newFeatures[featureName]);
      
      // Add notification for feature change
      const config = featureConfig[featureName];
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: newFeatures[featureName] ? 'enabled' : 'disabled',
        message: `${config.title} ${newFeatures[featureName] ? 'enabled' : 'disabled'}`,
        icon: config.icon
      }]);
      
      return newFeatures;
    });
  }, [onFeatureToggle]);

  // Clear notification
  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Generate eco metrics when eco mode is enabled
  useEffect(() => {
    if (features.ecoMode && route) {
      setTimeout(() => {
        setEcoMetrics({
          fuelSavings: Math.random() * 15 + 5, // 5-20%
          co2Reduction: Math.random() * 12 + 3, // 3-15%
          costSavings: Math.random() * 8 + 2, // $2-10
          ecoScore: Math.random() * 40 + 60 // 60-100
        });
      }, 2000);
    } else {
      setEcoMetrics(null);
    }
  }, [features.ecoMode, route]);

  // Voice navigation setup
  useEffect(() => {
    if (features.voiceNavigation) {
      // Check if speech synthesis is available
      setVoiceEnabled('speechSynthesis' in window);
      
      // Announce feature activation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('AI Voice Navigation activated');
        speechSynthesis.speak(utterance);
      }
    } else {
      setVoiceEnabled(false);
    }
  }, [features.voiceNavigation]);

  // Auto-clear notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(-3)); // Keep only last 3 notifications
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            ⚡ Advanced Features
            <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
              {Object.values(features).filter(Boolean).length}/{Object.keys(features).length}
            </span>
          </h2>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="ml-4 p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              aria-label="Close Advanced Features"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-200"
            >
              <div className="p-3 space-y-2">
                {notifications.slice(-3).map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                      notification.type === 'enabled' 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{notification.icon}</span>
                      {notification.message}
                    </div>
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(featureConfig).map(([key, config]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  features[key]
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleFeature(key)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <span className="text-2xl mr-3">{config.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{config.title}</h3>
                        {config.premium && (
                          <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      features[key] ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        features[key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Eco Metrics */}
        <AnimatePresence>
          {ecoMetrics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 bg-green-50"
            >
              <div className="p-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  🌱 Eco Performance
                  <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Score: {ecoMetrics.ecoScore.toFixed(0)}/100
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">Fuel Savings</div>
                    <div className="text-lg font-semibold text-green-600">
                      {ecoMetrics.fuelSavings.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">CO₂ Reduction</div>
                    <div className="text-lg font-semibold text-green-600">
                      {ecoMetrics.co2Reduction.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">Cost Savings</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${ecoMetrics.costSavings.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">Eco Score</div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${ecoMetrics.ecoScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {ecoMetrics.ecoScore.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Status */}
        <AnimatePresence>
          {features.voiceNavigation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 bg-blue-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2">🗣️</span>
                    <div>
                      <div className="font-medium text-blue-800">Voice Navigation</div>
                      <div className="text-sm text-blue-600">
                        {voiceEnabled ? 'Ready for voice commands' : 'Voice not available'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${voiceEnabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Insights */}
        {mlPrediction && (
          <div className="border-t border-gray-200 bg-purple-50">
            <div className="p-4">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                🧠 AI Insights
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route Confidence</span>
                  <span className="font-medium text-purple-700">
                    {(mlPrediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-white rounded p-2 text-purple-700">
                  {mlPrediction.recommendation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 rounded-b-xl flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Advanced Navigation System
          </div>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesPanel;
