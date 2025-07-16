import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MLPredictionPanel = ({ 
  route, 
  onMLPrediction, 
  showComparison = false,
  onAdvancedOptimization,
  autoFetch = false  // Add prop to control automatic fetching
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
    // Only auto-fetch if explicitly enabled
    if (autoFetch && route && route.origin && route.destination) {
      fetchMLPrediction();
    }
  }, [fetchMLPrediction, autoFetch, route]);

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
      className="bg-white rounded-lg shadow-lg h-full flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-800">
          🤖 AI DeepRoute Prediction
        </h3>
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-xs">Analyzing route...</p>
            </div>
          </div>
        ) : mlPrediction ? (
          <div className="space-y-3">
            {/* Main Metrics - Vertical Layout for Portrait */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 mb-1">Confidence</div>
                <div className={`text-sm font-bold ${getConfidenceColor(mlPrediction?.confidence || 0)}`}>
                  {mlPrediction?.confidence ? (mlPrediction.confidence * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 mb-1">Efficiency</div>
                <div className="text-sm font-bold text-gray-800">
                  {mlPrediction?.efficiency_score ? (mlPrediction.efficiency_score * 100).toFixed(0) : '0'}%
                </div>
              </div>
            </div>

            {/* Duration & Distance Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 mb-1">AI Duration</div>
                <div className="text-sm font-bold text-gray-800">
                  {Math.round((mlPrediction?.estimated_duration || 0) / 60)} min
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 mb-1">AI Distance</div>
                <div className="text-sm font-bold text-gray-800">
                  {mlPrediction?.estimated_distance 
                    ? (mlPrediction.estimated_distance / 1000).toFixed(1) 
                    : '0.0'} km
                </div>
              </div>
            </div>

            {/* Recommendation Section */}
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="text-xs text-blue-600 font-medium mb-1">
                🎯 AI Recommendation
              </div>
              <div className="text-xs text-blue-800 mb-2">
                {mlPrediction?.recommendation || 'No recommendation available'}
              </div>
              
              {/* High Confidence Indicator */}
              {mlPrediction.confidence > 0.75 && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-1">
                  <div className="text-xs text-green-800 font-medium">
                    ✅ HIGH CONFIDENCE: AI route recommended!
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">
              🤖
            </div>
            <p className="text-gray-500 mb-3 text-xs">
              Get AI predictions for your route
            </p>
            <button
              onClick={fetchMLPrediction}
              disabled={!route || !route.origin || !route.destination}
              className="px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Route with AI
            </button>
          </div>
        )}

        {/* Advanced Optimization Tab */}
        <div className="border-t border-gray-200 pt-2">
          <button
            onClick={() => setActiveTab('optimization')}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'optimization' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            🚀 Advanced Optimization
          </button>
        </div>

        <AnimatePresence>
          {activeTab === 'optimization' && advancedOptimization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h4 className="text-xs font-semibold text-gray-800 mb-2">
                🚀 Optimization Results
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {/* Optimized Duration */}
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">Duration</div>
                  <div className="text-xs font-bold text-gray-800">
                    {Math.round(advancedOptimization.optimized_duration / 60)} min
                  </div>
                </div>

                {/* Optimized Distance */}
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">Distance</div>
                  <div className="text-xs font-bold text-gray-800">
                    {advancedOptimization?.optimized_distance 
                      ? (advancedOptimization.optimized_distance / 1000).toFixed(1) 
                      : '0.0'} km
                  </div>
                </div>

                {/* Fuel Savings */}
                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">Fuel Saved</div>
                  <div className="text-xs font-bold text-gray-800">
                    {advancedOptimization?.fuel_savings?.toFixed(2) || '0.00'} L
                  </div>
                </div>

                {/* Cost Savings */}
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">Cost Saved</div>
                  <div className="text-xs font-bold text-gray-800">
                    ${advancedOptimization?.cost_savings?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MLPredictionPanel;