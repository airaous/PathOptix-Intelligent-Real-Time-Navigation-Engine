import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MLPredictionPanel = ({ 
  route, 
  onMLPrediction, 
  showComparison = false,
  onAdvancedOptimization 
}) => {
  const [mlPrediction, setMLPrediction] = useState(null);
  const [advancedOptimization, setAdvancedOptimization] = useState(null);
  const [realTimeAdaptation, setRealTimeAdaptation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('prediction');

  // Fetch ML prediction with enhanced API
  const fetchMLPrediction = useCallback(async () => {
    if (!route || !route.origin || !route.destination) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get basic ML prediction
      const predictionResponse = await fetch('http://localhost:8000/predict-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: route.origin,
          destination: route.destination,
          waypoints: route.waypoints || [],
          travel_mode: route.travelMode || 'driving'
        })
      });
      
      if (!predictionResponse.ok) throw new Error('Prediction failed');
      const prediction = await predictionResponse.json();
      setMLPrediction(prediction);
      onMLPrediction?.(prediction);

      // Get advanced optimization (fallback on error)
      try {
        const optimizationResponse = await fetch('http://localhost:8000/api/v2/advanced-optimization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: route.origin,
            destination: route.destination,
            waypoints: route.waypoints || [],
            travel_mode: route.travelMode || 'driving'
          })
        });
        
        if (optimizationResponse.ok) {
          const optimization = await optimizationResponse.json();
          setAdvancedOptimization(optimization);
          onAdvancedOptimization?.(optimization);
        }
      } catch (optError) {
        // Advanced optimization not available - fail silently
        // console.log('Advanced optimization not available:', optError.message);
      }

      // Get real-time adaptation (fallback on error)
      try {
        const adaptationResponse = await fetch('http://localhost:8000/api/v2/real-time-adaptation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: route.origin,
            destination: route.destination,
            waypoints: route.waypoints || [],
            travel_mode: route.travelMode || 'driving'
          })
        });
        
        if (adaptationResponse.ok) {
          const adaptation = await adaptationResponse.json();
          setRealTimeAdaptation(adaptation);
        }
      } catch (adaptError) {
        // Real-time adaptation not available - fail silently
        // console.log('Real-time adaptation not available:', adaptError.message);
      }
      
    } catch (err) {
      setError(err.message);
      // Only log errors in development, not production
      if (process.env.NODE_ENV === 'development') {
        console.error('ML Services Error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [route, onMLPrediction, onAdvancedOptimization]);

  useEffect(() => {
    fetchMLPrediction();
  }, [fetchMLPrediction]);

  // Auto-refresh real-time data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (realTimeAdaptation?.next_check && 
          Date.now() / 1000 >= realTimeAdaptation.next_check) {
        fetchMLPrediction();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [fetchMLPrediction, realTimeAdaptation]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 0.8) return 'bg-green-500';
    if (efficiency >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="text-red-500">⚠️</div>
          <p className="text-red-700">AI prediction temporarily unavailable</p>
        </div>
        <p className="text-red-600 text-sm mt-1">Please try again in a moment</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          AI DeepRoute AI Prediction
        </h3>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Analyzing route with AI...</p>
          </div>
        </div>
      ) : mlPrediction ? (
        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Confidence:</span>
            <span className={`font-bold ${getConfidenceColor(mlPrediction.confidence)}`}>
              {(mlPrediction.confidence * 100).toFixed(1)}%
            </span>
          </div>

          {/* Efficiency Score */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Route Efficiency:</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getEfficiencyColor(mlPrediction.efficiency_score)}`}
                  style={{ width: `${mlPrediction.efficiency_score * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                {(mlPrediction.efficiency_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Predicted Duration */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">ML Duration:</span>
            <span className="font-medium">
              {Math.round(mlPrediction.estimated_duration / 60)} min
            </span>
          </div>

          {/* Predicted Distance */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">ML Distance:</span>
            <span className="font-medium">
              {(mlPrediction.estimated_distance / 1000).toFixed(1)} km
            </span>
          </div>

          {/* Recommendation */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              RECOMMENDATION: {mlPrediction.recommendation}
            </p>
          </div>

          {/* Override Indicator */}
          {mlPrediction.confidence > 0.75 && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-800 text-sm font-medium">
                HIGH CONFIDENCE: AI route recommended!
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">
            Select a route to get AI prediction
          </p>
        </div>
      )}

      {/* Advanced Optimization Tab */}
      <div className="mt-6">
        <button
          onClick={() => setActiveTab('optimization')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'optimization' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Advanced Optimization
        </button>
      </div>

      <AnimatePresence>
        {activeTab === 'optimization' && advancedOptimization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              Advanced Optimization Results
            </h4>
            <div className="space-y-2">
              {/* Optimized Duration */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Optimized Duration:</span>
                <span className="font-medium">
                  {Math.round(advancedOptimization.optimized_duration / 60)} min
                </span>
              </div>

              {/* Optimized Distance */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Optimized Distance:</span>
                <span className="font-medium">
                  {(advancedOptimization.optimized_distance / 1000).toFixed(1)} km
                </span>
              </div>

              {/* Fuel Savings */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fuel Savings:</span>
                <span className="font-medium">
                  {advancedOptimization.fuel_savings.toFixed(2)} L
                </span>
              </div>

              {/* Cost Savings */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cost Savings:</span>
                <span className="font-medium">
                  ${advancedOptimization.cost_savings.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MLPredictionPanel;