import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import MapView from './components/MapView';
import Header from './components/Header';
import RoutePanel from './components/RoutePanel';
import ModeSelector from './components/ModeSelector';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import MLPredictionPanel from './components/ml/MLPredictionPanel';
import RouteComparisonView from './components/ml/RouteComparisonView';
import AdvancedFeaturesPanel from './components/AdvancedFeaturesPanel';

// Google Maps libraries to load
const libraries = ['places', 'geometry'];

// Default map center (San Francisco)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const TRAVEL_MODES = {
  DRIVING: 'DRIVING',
  WALKING: 'WALKING',
  BICYCLING: 'BICYCLING',
  TRANSIT: 'TRANSIT'
};

function App() {
  // State management
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [travelMode, setTravelMode] = useState(TRAVEL_MODES.DRIVING);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [trafficLayerVisible, setTrafficLayerVisible] = useState(true);
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  
  // ML Enhancement States
  const [mlPrediction, setMLPrediction] = useState(null);
  const [advancedOptimization, setAdvancedOptimization] = useState(null);
  const [showMLPanel, setShowMLPanel] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [advancedFeatures, setAdvancedFeatures] = useState({});
  const [aiRouteData, setAiRouteData] = useState(null);
  const [showAiRoute, setShowAiRoute] = useState(false);
  const [autoCalculateRoute, setAutoCalculateRoute] = useState(false); // Default to manual calculation

  // Refs
  const directionsServiceRef = useRef(null);
  const mapRef = useRef(null);

  // Get API key from environment
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Handle script load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    directionsServiceRef.current = new window.google.maps.DirectionsService();
  }, []);

  const handleLoadError = useCallback((error) => {
    console.error('Error loading Google Maps:', error);
    setError('Failed to load Google Maps. Please check your API key and internet connection.');
  }, []);

  // Handle ML prediction updates
  const handleMLPrediction = useCallback((prediction) => {
    setMLPrediction(prediction);
    setShowMLPanel(true);
  }, []);

  const handleAdvancedOptimization = useCallback((optimization) => {
    setAdvancedOptimization(optimization);
  }, []);

  // Get AI route suggestions
  const getAiRouteSuggestions = useCallback(async () => {
    console.log('🚀 AI: Starting AI route suggestions...');
    console.log('🚀 AI: Origin:', origin);
    console.log('🚀 AI: Destination:', destination);
    console.log('🚀 AI: Travel Mode:', travelMode);
    
    if (!origin || !destination) {
      console.error('❌ AI: Missing origin or destination');
      alert('Please set both origin and destination before requesting AI predictions.');
      return;
    }

    if (!directionsResult) {
      console.error('❌ AI: No route calculated yet');
      alert('Please calculate a route first before requesting AI predictions.');
      return;
    }

    try {
      // Extract and validate coordinates with comprehensive checking
      const originLat = origin.lat;
      const originLng = origin.lng;
      const destLat = destination.lat;
      const destLng = destination.lng;
      
      console.log('🚀 AI: Raw coordinates:', {
        originLat, originLng, destLat, destLng,
        originLatType: typeof originLat,
        originLngType: typeof originLng,
        destLatType: typeof destLat,
        destLngType: typeof destLng
      });

      // Validate coordinates are valid numbers
      if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
        console.error('❌ AI: Invalid coordinates - NaN detected');
        alert('Invalid coordinates detected. Please set locations again.');
        return;
      }

      if (originLat < -90 || originLat > 90 || destLat < -90 || destLat > 90) {
        console.error('❌ AI: Invalid latitude range');
        alert('Invalid latitude values. Must be between -90 and 90.');
        return;
      }

      if (originLng < -180 || originLng > 180 || destLng < -180 || destLng > 180) {
        console.error('❌ AI: Invalid longitude range');
        alert('Invalid longitude values. Must be between -180 and 180.');
        return;
      }

      // Create simplified request payload that matches working backend format
      const routeRequest = {
        origin: { 
          lat: Number(originLat),
          lng: Number(originLng)
        },
        destination: { 
          lat: Number(destLat),
          lng: Number(destLng)
        },
        travel_mode: String(travelMode).toLowerCase()
      };

      console.log('🚀 AI: Final request payload:', JSON.stringify(routeRequest, null, 2));

      // Get ML prediction with detailed error handling
      const predictionResponse = await fetch('/api/v2/predict-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeRequest)
      });

      console.log('🚀 AI: Response status:', predictionResponse.status);
      console.log('🚀 AI: Response headers:', Object.fromEntries(predictionResponse.headers.entries()));

      if (predictionResponse.ok) {
        const prediction = await predictionResponse.json();
        console.log('✅ AI: Prediction received:', prediction);
        
        // Get advanced optimization
        const optimizationResponse = await fetch('/api/v2/advanced-optimization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routeRequest)
        });

        let optimization = null;
        if (optimizationResponse.ok) {
          optimization = await optimizationResponse.json();
          console.log('✅ AI: Optimization received:', optimization);
        } else {
          console.warn('⚠️ AI: Optimization failed:', optimizationResponse.status);
        }

        // Create AI route data with recommendations
        const aiData = {
          prediction,
          optimization,
          route: {
            ...directionsResult,
            isAiRecommended: prediction.confidence > 0.7,
            aiRecommendation: prediction.recommendation,
            efficiencyScore: prediction.efficiency_score,
            aiLabel: `AI Route (${Math.round(prediction.confidence * 100)}% confidence)`
          }
        };

        console.log('✅ AI: Setting AI route data:', aiData);
        
        setAiRouteData(aiData);
        setShowAiRoute(true);
        handleMLPrediction(prediction);
        
        if (optimization) {
          handleAdvancedOptimization(optimization);
        }
        
        console.log('✅ AI: AI predictions completed successfully!');
      } else {
        const errorText = await predictionResponse.text();
        console.error('❌ AI: Prediction request failed:', predictionResponse.status, errorText);
        
        // Try to parse error details for 422 responses
        let errorDetails = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            errorDetails = Array.isArray(errorJson.detail) 
              ? errorJson.detail.map(d => `${d.loc?.join('.')} : ${d.msg}`).join(', ')
              : errorJson.detail;
          }
        } catch (e) {
          // Keep original error text if parsing fails
        }
        
        alert(`AI prediction failed (${predictionResponse.status}): ${errorDetails}`);
      }
    } catch (error) {
      console.error('❌ AI: Error getting AI route suggestions:', error);
      alert(`AI prediction error: ${error.message}`);
    }
  }, [origin, destination, travelMode, directionsResult, handleMLPrediction, handleAdvancedOptimization]);

  // Calculate route
  const calculateRoute = useCallback(async () => {
    if (!origin || !destination || !directionsServiceRef.current) return;

    setIsCalculating(true);
    setError(null);

    try {
      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
        provideRouteAlternatives: true,
        avoidHighways: false,
        avoidTolls: false,
        region: 'US'
      };

      directionsServiceRef.current.route(request, (result, status) => {
        if (status === 'OK') {
          setDirectionsResult(result);
          setAlternateRoutes(result.routes || []);
          setSelectedRouteIndex(0);
          
          // Extract route information
          const route = result.routes[0];
          const leg = route.legs[0];
          
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            durationValue: leg.duration.value,
            steps: leg.steps,
            warnings: route.warnings || [],
            copyrights: route.copyrights
          });

          // Note: AI route suggestions will only be triggered manually by user
          // setTimeout(() => {
          //   getAiRouteSuggestions();
          // }, 1000);
        } else {
          console.error('Directions request failed:', status);
          setError(`Route calculation failed: ${status}`);
        }
        setIsCalculating(false);
      });
    } catch (err) {
      console.error('Error calculating route:', err);
      setError('An error occurred while calculating the route.');
      setIsCalculating(false);
    }
  }, [origin, destination, travelMode, getAiRouteSuggestions]);

  // Effect to calculate route when origin, destination, or travel mode changes (only if auto-calculate is enabled)
  useEffect(() => {
    if (origin && destination && autoCalculateRoute) {
      calculateRoute();
    }
  }, [origin, destination, travelMode, calculateRoute, autoCalculateRoute]);

  // Clear route
  const clearRoute = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setDirectionsResult(null);
    setRouteInfo(null);
    setAlternateRoutes([]);
    setSelectedRouteIndex(0);
    setAiRouteData(null);
    setShowAiRoute(false);
    setMLPrediction(null);
  }, []);

  // Handle route selection
  const handleRouteSelect = useCallback((routeIndex) => {
    if (alternateRoutes[routeIndex]) {
      setSelectedRouteIndex(routeIndex);
      const route = alternateRoutes[routeIndex];
      const leg = route.legs[0];
      
      setRouteInfo({
        distance: leg.distance.text,
        duration: leg.duration.text,
        durationValue: leg.duration.value,
        steps: leg.steps,
        warnings: route.warnings || [],
        copyrights: route.copyrights
      });
    }
  }, [alternateRoutes]);

  const handleFeatureToggle = useCallback((featureName, enabled) => {
    setAdvancedFeatures(prev => ({ ...prev, [featureName]: enabled }));
  }, []);

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-gray-100">
        <LoadScript
          googleMapsApiKey={googleMapsApiKey}
          libraries={libraries}
          onLoad={handleLoad}
          onError={handleLoadError}
          loadingElement={<LoadingScreen />}
        >
          <AnimatePresence>
            {!isLoaded ? (
              <LoadingScreen key="loading" />
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col"
              >
                {/* Header */}
                <Header />

                {/* Main Content */}
                <div className="flex-1 flex relative">
                  {/* Map */}
                  <div className="flex-1 relative">
                    <MapView
                      ref={mapRef}
                      center={defaultCenter}
                      origin={origin}
                      destination={destination}
                      directionsResult={directionsResult}
                      selectedRouteIndex={selectedRouteIndex}
                      trafficLayerVisible={trafficLayerVisible}
                      onOriginChange={setOrigin}
                      onDestinationChange={setDestination}
                      alternateRoutes={alternateRoutes}
                      onRouteSelect={handleRouteSelect}
                      aiRouteData={aiRouteData}
                      showAiRoute={showAiRoute}
                      onCalculateRoute={calculateRoute}
                      isCalculating={isCalculating}
                      autoCalculateRoute={autoCalculateRoute}
                      onToggleAutoCalculate={() => setAutoCalculateRoute(!autoCalculateRoute)}
                      onClearRoute={clearRoute}
                    />

                    {/* Floating Controls */}
                    <div className="absolute top-4 left-4 z-30">
                      <ModeSelector
                        selectedMode={travelMode}
                        onModeChange={setTravelMode}
                        disabled={isCalculating}
                      />
                    </div>

                    {/* Traffic Toggle */}
                    <div className="absolute top-4 right-4 z-30">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTrafficLayerVisible(!trafficLayerVisible)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            trafficLayerVisible
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                          }`}
                        >
                          Traffic {trafficLayerVisible ? 'ON' : 'OFF'}
                        </motion.button>
                        
                        {/* AI Panel Toggle */}
                        {(origin && destination) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowMLPanel(!showMLPanel);
                              if (showMLPanel) {
                                // Clear ML data when turning off
                                setMLPrediction(null);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              showMLPanel
                                ? 'bg-purple-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                            }`}
                          >
                            🧠 AI {showMLPanel ? 'ON' : 'OFF'}
                          </motion.button>
                        )}

                        {/* AI Route Suggestions */}
                        {(origin && destination) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (showAiRoute) {
                                setShowAiRoute(false);
                                setAiRouteData(null);
                              } else {
                                getAiRouteSuggestions();
                              }
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              showAiRoute
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                            }`}
                          >
                            🤖 AI Route {showAiRoute ? 'ON' : 'OFF'}
                          </motion.button>
                        )}
                        
                        {/* Advanced Features Toggle */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            showAdvancedFeatures
                              ? 'bg-indigo-500 text-white shadow-lg'
                              : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                          }`}
                        >
                          ⚡ Features {showAdvancedFeatures ? 'ON' : 'OFF'}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Route Panel */}
                  <AnimatePresence>
                    {(routeInfo || isCalculating) && (
                      <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="w-96 bg-white shadow-xl border-l border-gray-200 hidden lg:block"
                      >
                        <RoutePanel
                          routeInfo={routeInfo}
                          isCalculating={isCalculating}
                          alternateRoutes={alternateRoutes}
                          selectedRouteIndex={selectedRouteIndex}
                          onRouteSelect={handleRouteSelect}
                          onClearRoute={clearRoute}
                          travelMode={travelMode}
                          aiRouteData={aiRouteData}
                          showAiRoute={showAiRoute}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Advanced Features Panel */}
                  <AnimatePresence>
                    {showAdvancedFeatures && (
                      <motion.div
                        initial={{ y: -400, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute top-20 left-4 w-80 z-40"
                      >
                        <AdvancedFeaturesPanel
                          route={origin && destination ? {
                            origin: origin,
                            destination: destination,
                            travelMode: travelMode
                          } : null}
                          mlPrediction={mlPrediction}
                          onFeatureToggle={handleFeatureToggle}
                          onClose={() => setShowAdvancedFeatures(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Route Panel */}
                <AnimatePresence>
                  {(routeInfo || isCalculating) && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="lg:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[60vh] mobile-panel z-20"
                    >
                      <RoutePanel
                        routeInfo={routeInfo}
                        isCalculating={isCalculating}
                        alternateRoutes={alternateRoutes}
                        selectedRouteIndex={selectedRouteIndex}
                        onRouteSelect={handleRouteSelect}
                        onClearRoute={clearRoute}
                        travelMode={travelMode}
                        isMobile={true}
                        aiRouteData={aiRouteData}
                        showAiRoute={showAiRoute}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile ML Panel */}
                <AnimatePresence>
                  {showMLPanel && (origin && destination) && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="lg:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] mobile-panel z-40"
                    >
                      <div className="p-2 border-b border-gray-200">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        <MLPredictionPanel
                          route={{
                            origin: origin,
                            destination: destination,
                            travelMode: travelMode
                          }}
                          onMLPrediction={handleMLPrediction}
                          onAdvancedOptimization={handleAdvancedOptimization}
                          showComparison={showComparison}
                          autoFetch={false}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Desktop AI Prediction Panel */}
                <AnimatePresence>
                  {showMLPanel && (origin && destination) && (
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="hidden lg:block fixed bottom-4 left-4 w-96 max-w-[calc(50vw-2rem)] h-[60vh] max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-30"
                    >
                      <MLPredictionPanel
                        route={{
                          origin: origin,
                          destination: destination,
                          travelMode: travelMode
                        }}
                        onMLPrediction={handleMLPrediction}
                        onAdvancedOptimization={handleAdvancedOptimization}
                        showComparison={showComparison}
                        autoFetch={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60"
                    >
                      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{error}</span>
                          <button
                            onClick={() => setError(null)}
                            className="ml-4 text-white hover:text-red-200"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </LoadScript>
      </div>
    </ErrorBoundary>
  );
}

export default App;
