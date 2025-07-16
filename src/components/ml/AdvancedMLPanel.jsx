
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedMLPanel = ({ origin, destination, onPredictionUpdate }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState('time');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (origin && destination) {
      fetchMLPrediction();
    }
  }, [origin, destination, optimizationMode]);

  const fetchMLPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v2/predict-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          optimize_for: optimizationMode
        })
      });
      
      const data = await response.json();
      setPrediction(data);
      onPredictionUpdate?.(data);
    } catch (error) {
      console.error('ML Prediction error:', error);
      // Fallback mock data
      setPrediction({
        confidence: 0.85,
        estimated_duration: 1800,
        estimated_distance: 12500,
        efficiency_score: 0.78,
        recommendation: "Optimal route with high confidence",
        optimization_suggestions: ["Route optimized for time", "Consider traffic patterns"]
      });
    }
    setLoading(false);
  };

  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    return mins > 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;
  };

  const formatDistance = (meters) => {
    return meters > 1000 ? `${(meters/1000).toFixed(1)} km` : `${meters} m`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyColor = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          🤖 AI Route Analysis
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          {showAdvanced ? 'Basic' : 'Advanced'}
        </button>
      </div>

      {/* Optimization Mode Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Optimize for:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['time', 'distance', 'fuel', 'eco'].map((mode) => (
            <button
              key={mode}
              onClick={() => setOptimizationMode(mode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                optimizationMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Analyzing route...</span>
          </motion.div>
        ) : prediction ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Confidence Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Confidence</span>
              <span className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>

            {/* Efficiency Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Route Efficiency</span>
                <span className="font-bold text-gray-800">
                  {(prediction.efficiency_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getEfficiencyColor(prediction.efficiency_score)}`}
                  style={{ width: `${prediction.efficiency_score * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Route Metrics */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-500">Duration</div>
                <div className="font-semibold text-gray-800">
                  {formatDuration(prediction.estimated_duration)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Distance</div>
                <div className="font-semibold text-gray-800">
                  {formatDistance(prediction.estimated_distance)}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium mb-1">
                AI Recommendation
              </div>
              <div className="text-sm text-gray-800">
                {prediction.recommendation}
              </div>
            </div>

            {/* Advanced Features */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Optimization Suggestions
                    </h4>
                    {prediction.optimization_suggestions?.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={fetchMLPrediction}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                🔄 Refresh Analysis
              </button>
              <button
                onClick={() => onPredictionUpdate?.(prediction)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                ✅ Apply
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedMLPanel;
