import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RouteComparisonView = ({ 
  googleRoute, 
  mlPrediction, 
  onRouteSelect 
}) => {
  const [comparison, setComparison] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('google');

  useEffect(() => {
    if (googleRoute && mlPrediction) {
      const improvementTime = googleRoute.duration_seconds - mlPrediction.estimated_duration;
      const improvementPercent = (improvementTime / googleRoute.duration_seconds) * 100;
      
      setComparison({
        timeImprovement: improvementTime,
        improvementPercent,
        shouldRecommendML: mlPrediction.confidence > 0.75 && improvementTime > 60
      });
    }
  }, [googleRoute, mlPrediction]);

  const handleRouteSelection = (routeType) => {
    setSelectedRoute(routeType);
    onRouteSelect?.(routeType);
  };

  if (!googleRoute || !mlPrediction) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        COMPARISON: Route Comparison
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Maps Route */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedRoute === 'google' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleRouteSelection('google')}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">MAP Google Maps</h4>
            {selectedRoute === 'google' && (
              <span className="text-blue-600 text-sm">CHECK Selected</span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {Math.round(googleRoute.duration_seconds / 60)} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">
                {(googleRoute.distance_meters / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Traffic:</span>
              <span className="text-orange-600">Real-time</span>
            </div>
          </div>
        </motion.div>

        {/* ML Prediction Route */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedRoute === 'ml' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleRouteSelection('ml')}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">AI DeepRoute AI</h4>
            {selectedRoute === 'ml' && (
              <span className="text-green-600 text-sm">CHECK Selected</span>
            )}
            {comparison?.shouldRecommendML && (
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
                RECOMMENDED
              </span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {Math.round(mlPrediction.estimated_duration / 60)} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">
                {(mlPrediction.estimated_distance / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence:</span>
              <span className={`font-medium ${
                mlPrediction.confidence > 0.8 ? 'text-green-600' : 
                mlPrediction.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {(mlPrediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Metrics */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h5 className="font-medium text-gray-800 mb-3">CHART Analysis</h5>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Time Difference:</span>
              <p className={`font-medium ${
                comparison.timeImprovement > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.timeImprovement > 0 ? '+' : ''}
                {Math.round(comparison.timeImprovement / 60)} min
              </p>
            </div>
            
            <div>
              <span className="text-gray-600">Improvement:</span>
              <p className={`font-medium ${
                comparison.improvementPercent > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.improvementPercent > 0 ? '+' : ''}
                {comparison.improvementPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          {comparison.shouldRecommendML && (
            <div className="mt-3 p-3 bg-green-100 rounded border border-green-200">
              <p className="text-green-800 text-sm font-medium">
                TARGET AI route shows significant improvement - recommended!
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RouteComparisonView;