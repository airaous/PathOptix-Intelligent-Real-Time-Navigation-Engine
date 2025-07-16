import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom CSS for line clamping
const lineClampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

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

  // Generate unique ID for notifications
  const generateUniqueId = useCallback((prefix = 'notification') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  useEffect(() => {
    if (routeData) {
      generateSmartNotifications();
      
      // Set up periodic notifications
      const interval = setInterval(generateSmartNotifications, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [routeData, settings, generateSmartNotifications]);

  const generateSmartNotifications = useCallback(() => {
    const newNotifications = [];
    const now = new Date();

    // Traffic-based notifications
    if (settings.traffic_alerts) {
      const trafficLevel = Math.random();
      if (trafficLevel > 0.7) {
        newNotifications.push({
          id: generateUniqueId('traffic'),
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
          id: generateUniqueId('weather'),
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
          id: generateUniqueId('cost'),
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
          id: generateUniqueId('eco'),
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
        id: generateUniqueId('departure'),
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
  }, [generateUniqueId, settings]);

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
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-bold text-gray-800 flex items-center">
          🔔 Smart Alerts
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-800">
          Settings
        </button>
      </div>

      {/* Notification Settings (Compact) */}
      <div className="p-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="grid grid-cols-3 gap-1 text-xs">
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleSetting(key)}
                className="mr-1 w-3 h-3"
              />
              <span className="capitalize text-xs truncate">{key.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Notifications - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`p-2 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="text-sm mr-1">{notification.icon}</span>
                    <span className="font-semibold text-gray-800 text-xs truncate">
                      {notification.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1" style={lineClampStyle}>
                    {notification.message}
                  </div>
                  <div className="flex items-center justify-between">
                    {notification.action && (
                      <button
                        onClick={() => handleNotificationAction(notification)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        {notification.action}
                      </button>
                    )}
                    <span className="text-xs text-gray-400">
                      {notification.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 ml-1 text-sm"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notifications.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <div className="text-lg mb-1">🔕</div>
            <div className="text-xs">No active notifications</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotifications;
