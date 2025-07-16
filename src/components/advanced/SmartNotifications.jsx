
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartNotifications = ({ routeData, userPreferences }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    traffic_alerts: true,
    weather_updates: true,
    cost_optimization: true,
    eco_suggestions: true,
    safety_warnings: true,
    smart_departure: true
  });

  useEffect(() => {
    if (routeData) {
      generateSmartNotifications();
      
      // Set up periodic notifications
      const interval = setInterval(generateSmartNotifications, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [routeData, settings]);

  const generateSmartNotifications = () => {
    const newNotifications = [];
    const now = new Date();

    // Traffic-based notifications
    if (settings.traffic_alerts) {
      const trafficLevel = Math.random();
      if (trafficLevel > 0.7) {
        newNotifications.push({
          id: `traffic-${Date.now()}`,
          type: 'warning',
          icon: '🚦',
          title: 'Heavy Traffic Detected',
          message: 'Consider leaving 15 minutes earlier or taking an alternative route',
          action: 'View Alternatives',
          priority: 'high',
          timestamp: now
        });
      }
    }

    // Weather-based notifications
    if (settings.weather_updates) {
      const weatherConditions = ['sunny', 'rainy', 'snowy', 'foggy'];
      const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      if (weather === 'rainy') {
        newNotifications.push({
          id: `weather-${Date.now()}`,
          type: 'info',
          icon: '🌧️',
          title: 'Rain Expected',
          message: 'Allow extra travel time and drive carefully',
          action: 'Weather Details',
          priority: 'medium',
          timestamp: now
        });
      }
    }

    // Cost optimization
    if (settings.cost_optimization) {
      const savingsOpportunity = Math.random() > 0.6;
      if (savingsOpportunity) {
        newNotifications.push({
          id: `cost-${Date.now()}`,
          type: 'success',
          icon: '💰',
          title: 'Cost Savings Available',
          message: 'Taking transit could save you $12.50 compared to driving',
          action: 'Switch Mode',
          priority: 'low',
          timestamp: now
        });
      }
    }

    // Eco suggestions
    if (settings.eco_suggestions) {
      const ecoOpportunity = Math.random() > 0.5;
      if (ecoOpportunity) {
        newNotifications.push({
          id: `eco-${Date.now()}`,
          type: 'success',
          icon: '🌱',
          title: 'Eco-Friendly Option',
          message: 'Cycling this route would reduce 2.3kg CO₂ emissions',
          action: 'Go Green',
          priority: 'medium',
          timestamp: now
        });
      }
    }

    // Smart departure timing
    if (settings.smart_departure) {
      const optimalTime = new Date(now.getTime() + 15 * 60000); // 15 minutes from now
      newNotifications.push({
        id: `departure-${Date.now()}`,
        type: 'info',
        icon: '⏰',
        title: 'Optimal Departure Time',
        message: `Leave at ${optimalTime.toLocaleTimeString()} for best route conditions`,
        action: 'Set Reminder',
        priority: 'high',
        timestamp: now
      });
    }

    // Add new notifications and remove old ones
    setNotifications(prev => {
      const updated = [...prev, ...newNotifications];
      return updated.slice(-5); // Keep only last 5 notifications
    });
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationAction = (notification) => {
    console.log('Notification action:', notification.action);
    dismissNotification(notification.id);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-blue-400 bg-blue-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          🔔 Smart Notifications
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Settings
        </button>
      </div>

      {/* Notification Settings (Compact) */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleSetting(key)}
                className="mr-2 w-3 h-3"
              />
              <span className="capitalize">{key.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Notifications */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">{notification.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {notification.title}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </div>
                  {notification.action && (
                    <button
                      onClick={() => handleNotificationAction(notification)}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {notification.action}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            🔕 No active notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotifications;
