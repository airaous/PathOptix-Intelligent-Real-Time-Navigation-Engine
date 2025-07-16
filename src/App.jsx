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

  // Error handling for missing API key
  useEffect(() => {
    if (!googleMapsApiKey || googleMapsApiKey === 'your_new_api_key_here') {
      setError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.');
    }
  }, [googleMapsApiKey]);

  // Demo mode when no valid API key
  const isDemoMode = !googleMapsApiKey || googleMapsApiKey === 'your_new_api_key_here';

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
    if (!origin || !destination) return;

    try {
      const routeRequest = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: [],
        travel_mode: travelMode.toLowerCase(),
        avoid_tolls: false,
        avoid_highways: false
      };

      // Get ML prediction
      const predictionResponse = await fetch('http://localhost:8000/predict-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeRequest)
      });

      if (predictionResponse.ok) {
        const prediction = await predictionResponse.json();
        
        // Get advanced optimization
        const optimizationResponse = await fetch('http://localhost:8000/api/v2/advanced-optimization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routeRequest)
        });

        let optimization = null;
        if (optimizationResponse.ok) {
          optimization = await optimizationResponse.json();
        }

        // Create AI route data with recommendations
        setAiRouteData({
          prediction,
          optimization,
          route: {
            ...directionsResult,
            isAiRecommended: prediction.confidence > 0.7,
            aiRecommendation: prediction.recommendation,
            efficiencyScore: prediction.efficiency_score,
            aiLabel: `AI Route (${Math.round(prediction.confidence * 100)}% confidence)`
          }
        });
        
        setShowAiRoute(true);
        handleMLPrediction(prediction);
        
        if (optimization) {
          handleAdvancedOptimization(optimization);
        }
      }
    } catch (error) {
      console.error('Error getting AI route suggestions:', error);
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

  // Show loading screen if API key is missing
  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🗝️ Google Maps API Key Required</h1>
          <p className="text-gray-600 mb-6 text-lg">
            PathOptix needs a valid Google Maps API key to provide navigation services.
          </p>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-left mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">📝 Quick Setup Guide:</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 font-medium">1</span>
                <div>
                  Go to <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Cloud Console</a>
                  <div className="text-sm text-gray-500 mt-1">Create a new project and enable billing (required for Maps APIs)</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 font-medium">2</span>
                <div>
                  Enable Required APIs:
                  <div className="text-sm text-gray-500 mt-1">• Maps JavaScript API • Places API • Directions API</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 font-medium">3</span>
                <div>
                  Create API Key in "Credentials"
                  <div className="text-sm text-gray-500 mt-1">Configure restrictions for localhost:3000</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 font-medium">4</span>
                <div>
                  Update your <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> file
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-4">
            <p className="text-sm text-yellow-800">
              <strong>📝 Edit .env.local file:</strong><br />
              <code className="bg-yellow-100 px-3 py-2 rounded mt-2 block text-sm font-mono">
                VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
              </code>
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <p className="text-sm text-green-800">
              💡 <strong>Free Tier Available:</strong> Google provides $200/month free credit for Maps APIs - perfect for development!
            </p>
          </div>
        </div>
      </div>
    );
  }

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
