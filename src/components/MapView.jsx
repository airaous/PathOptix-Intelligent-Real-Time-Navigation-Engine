import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer, TrafficLayer, Marker } from '@react-google-maps/api';
import ModernAutocompleteInput from './ModernAutocompleteInput'; // Use the new component
import { MapPin, Navigation, Target, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const MapView = forwardRef(({
  center,
  origin,
  destination,
  directionsResult,
  selectedRouteIndex,
  trafficLayerVisible,
  onOriginChange,
  onDestinationChange,
  alternateRoutes,
  onRouteSelect,
  aiRouteData,
  showAiRoute,
  onCalculateRoute,
  isCalculating,
  autoCalculateRoute,
  onToggleAutoCalculate,
  onClearRoute
}, ref) => {
  const [map, setMap] = useState(null);
  const [clickMarker, setClickMarker] = useState(null);
  const [isSelectingOrigin, setIsSelectingOrigin] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);
  const [directionsRendererRef, setDirectionsRendererRef] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const mapRef = useRef();

  useImperativeHandle(ref, () => ({
    getMap: () => map,
    panTo: (latLng) => map?.panTo(latLng),
    fitBounds: (bounds) => map?.fitBounds(bounds)
  }));

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  // Handle map clicks for setting origin/destination
  const handleMapClick = useCallback((event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    if (isSelectingOrigin) {
      onOriginChange(clickedLocation);
      setIsSelectingOrigin(false);
      setClickMarker(null);
    } else if (isSelectingDestination) {
      onDestinationChange(clickedLocation);
      setIsSelectingDestination(false);
      setClickMarker(null);
    } else {
      setClickMarker(clickedLocation);
    }
  }, [isSelectingOrigin, isSelectingDestination, onOriginChange, onDestinationChange]);

  // Handle click marker actions
  const handleSetAsOrigin = useCallback(() => {
    if (clickMarker) {
      onOriginChange(clickMarker);
      setClickMarker(null);
    }
  }, [clickMarker, onOriginChange]);

  const handleSetAsDestination = useCallback(() => {
    if (clickMarker) {
      onDestinationChange(clickMarker);
      setClickMarker(null);
    }
  }, [clickMarker, onDestinationChange]);

  // Create directions renderer options
  const directionsOptions = {
    suppressMarkers: false,
    suppressInfoWindows: true,
    preserveViewport: false,
    routeIndex: selectedRouteIndex,
    polylineOptions: {
      strokeColor: '#4285F4',
      strokeWeight: 6,
      strokeOpacity: 0.8
    }
  };

  // Handle route selection from alternate routes
  const handleDirectionsLoad = useCallback((directionsRenderer) => {
    setDirectionsRendererRef(directionsRenderer);
    // Configure the directions renderer
    directionsRenderer.setOptions({
      suppressMarkers: false,
      suppressInfoWindows: true,
      routeIndex: selectedRouteIndex,
      polylineOptions: {
        strokeColor: selectedRouteIndex === 0 ? '#4285F4' : '#9CA3AF',
        strokeWeight: selectedRouteIndex === 0 ? 6 : 4,
        strokeOpacity: selectedRouteIndex === 0 ? 0.8 : 0.6
      }
    });
  }, [selectedRouteIndex]);

  // Effect to handle route clearing
  useEffect(() => {
    if (!directionsResult && directionsRendererRef) {
      // Force clear the directions renderer when directionsResult becomes null
      directionsRendererRef.setDirections(null);
      // Also increment render key to force remount of DirectionsRenderer components
      setRenderKey(prev => prev + 1);
    }
  }, [directionsResult, directionsRendererRef]);

  return (
    <div className="relative h-full w-full">
      {/* Search Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <ModernAutocompleteInput
            placeholder="From: Enter starting location"
            value={origin}
            onChange={onOriginChange}
            icon={<Navigation className="h-4 w-4 text-green-500" />}
            isActive={isSelectingOrigin}
            onMapSelectToggle={() => setIsSelectingOrigin(!isSelectingOrigin)}
          />
          <ModernAutocompleteInput
            placeholder="To: Enter destination"
            value={destination}
            onChange={onDestinationChange}
            icon={<Target className="h-4 w-4 text-red-500" />}
            isActive={isSelectingDestination}
            onMapSelectToggle={() => setIsSelectingDestination(!isSelectingDestination)}
          />
          
          {/* Route Calculation Controls */}
          {origin && destination && (
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-lg">
              <button
                onClick={onCalculateRoute}
                disabled={isCalculating}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isCalculating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                }`}
              >
                {isCalculating ? 'Calculating...' : 'Calculate Route'}
              </button>
              
              <button
                onClick={onToggleAutoCalculate}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  autoCalculateRoute
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
                title={autoCalculateRoute ? 'Auto-calculate ON' : 'Auto-calculate OFF'}
              >
                AUTO {autoCalculateRoute ? 'ON' : 'OFF'}
              </button>
              
              <button
                onClick={onClearRoute}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-all duration-200"
                title="Clear route"
              >
                CLEAR
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Map Selection Helper */}
      <AnimatePresence>
        {(isSelectingOrigin || isSelectingDestination) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 z-20 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-xl">
              <p className="text-center text-gray-700 font-medium">
                {isSelectingOrigin ? 'Click on the map to set starting location' : 'Click on the map to set destination'}
              </p>
              <button
                onClick={() => {
                  setIsSelectingOrigin(false);
                  setIsSelectingDestination(false);
                }}
                className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {/* Traffic Layer */}
        {trafficLayerVisible && <TrafficLayer />}

        {/* Directions Renderer */}
        {directionsResult && (
          <DirectionsRenderer
            key={`directions-${renderKey}-${directionsResult.routes?.[0]?.legs?.[0]?.start_address}-${directionsResult.routes?.[0]?.legs?.[0]?.end_address}`}
            options={directionsOptions}
            directions={directionsResult}
            routeIndex={selectedRouteIndex}
            onLoad={handleDirectionsLoad}
          />
        )}

        {/* AI Route Renderer */}
        {showAiRoute && aiRouteData && directionsResult && (
          <DirectionsRenderer
            key={`ai-route-${renderKey}-${directionsResult.routes?.[0]?.legs?.[0]?.start_address}-${directionsResult.routes?.[0]?.legs?.[0]?.end_address}`}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#10B981', // Green for AI route
                strokeWeight: 6,
                strokeOpacity: 0.8,
                zIndex: 100
              },
              infoWindow: new window.google.maps.InfoWindow({
                content: `<div class="p-2">
                  <div class="font-bold text-green-600">🤖 ${aiRouteData.route.aiLabel}</div>
                  <div class="text-sm">${aiRouteData.route.aiRecommendation}</div>
                  <div class="text-xs text-gray-600">Efficiency: ${Math.round(aiRouteData.route.efficiencyScore * 100)}%</div>
                </div>`
              })
            }}
            directions={directionsResult}
            routeIndex={selectedRouteIndex}
          />
        )}

        {/* Origin Marker */}
        {origin && (
          <Marker
            position={origin}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 8,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }}
            title="Starting Location"
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            position={destination}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 8,
              fillColor: '#EF4444',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }}
            title="Destination"
          />
        )}

        {/* AI Route Label */}
        {showAiRoute && aiRouteData && origin && (
          <Marker
            position={{
              lat: origin.lat + 0.001,
              lng: origin.lng + 0.001
            }}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="120" height="30" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="30" rx="15" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
                  <text x="60" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
                    🤖 AI Route
                  </text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(120, 30),
              anchor: new window.google.maps.Point(60, 15)
            }}
            title={`${aiRouteData.route.aiLabel} - ${aiRouteData.route.aiRecommendation}`}
          />
        )}

        {/* Click Marker */}
        {clickMarker && (
          <Marker
            position={clickMarker}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 10,
              fillColor: '#3B82F6',
              fillOpacity: 0.8,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }}
          />
        )}
      </GoogleMap>

      {/* Click Marker Actions */}
      <AnimatePresence>
        {clickMarker && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white rounded-lg shadow-xl p-4 flex space-x-2">
              <button
                onClick={handleSetAsOrigin}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>Set as Start</span>
              </button>
              <button
                onClick={handleSetAsDestination}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Target className="h-4 w-4" />
                <span>Set as End</span>
              </button>
              <button
                onClick={() => setClickMarker(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        >
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Origin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Destination</span>
            </div>
            {trafficLayerVisible && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded"></div>
                <span>Traffic</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
});

MapView.displayName = 'MapView';

export default MapView;
