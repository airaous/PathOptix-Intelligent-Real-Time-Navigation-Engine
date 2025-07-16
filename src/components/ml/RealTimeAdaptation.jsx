
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealTimeAdaptation = ({ routeData, onRouteUpdate }) => {
  const [adaptations, setAdaptations] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (isMonitoring && routeData) {
      const interval = setInterval(checkForAdaptations, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring, routeData]);

  const checkForAdaptations = async () => {
    try {
      const response = await fetch('/api/v2/real-time-adaptation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeData)
      });
      
      const data = await response.json();
      
      if (data.adaptation.should_reroute) {
        setAdaptations(prev => [...prev, {
          id: Date.now(),
          timestamp: new Date(),
          type: 'reroute',
          reason: data.adaptation.adaptation_reason,
          confidence: data.ml_analysis.confidence,
          suggestion: data.adaptation.recommended_action
        }]);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Real-time adaptation error:', error);
    }
  };

  const dismissAdaptation = (id) => {
    setAdaptations(prev => prev.filter(a => a.id !== id));
  };

  const applyAdaptation = (adaptation) => {
    onRouteUpdate?.(adaptation);
    dismissAdaptation(adaptation.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          🔄 Real-time Adaptation
        </h3>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            isMonitoring
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isMonitoring ? '🟢 Active' : '⚪ Inactive'}
        </button>
      </div>

      {isMonitoring && (
        <div className="text-xs text-gray-500 mb-3">
          Last check: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {adaptations.map((adaptation) => (
          <motion.div
            key={adaptation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-800">
                  Route Update Available
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  {adaptation.reason}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Confidence: {(adaptation.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => applyAdaptation(adaptation)}
                  className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                >
                  Apply
                </button>
                <button
                  onClick={() => dismissAdaptation(adaptation.id)}
                  className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {adaptations.length === 0 && isMonitoring && (
          <div className="text-center py-4 text-gray-500 text-sm">
            🛣️ Route is optimal - no adaptations needed
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAdaptation;
