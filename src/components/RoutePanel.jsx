import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Route, 
  X, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoutePanel = ({
  routeInfo,
  isCalculating,
  alternateRoutes,
  selectedRouteIndex,
  onRouteSelect,
  onClearRoute,
  travelMode,
  isMobile = false,
  aiRouteData,
  showAiRoute
}) => {
  const [showSteps, setShowSteps] = useState(false);
  const [showAlternates, setShowAlternates] = useState(false);

  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case 'DRIVING': return '🚗';
      case 'WALKING': return '🚶';
      case 'BICYCLING': return '🚴';
      case 'TRANSIT': return '🚌';
      default: return '🚗';
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (isCalculating) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Calculating Route</h3>
          <p className="text-sm text-gray-500 mt-2">Finding the best path for you...</p>
        </motion.div>
      </div>
    );
  }

  if (!routeInfo) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col ${isMobile ? 'max-h-[60vh]' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Route className="h-5 w-5 text-blue-500" />
            <span>Route Details</span>
          </h2>
          <button
            onClick={onClearRoute}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {getTravelModeIcon(travelMode)} {travelMode.toLowerCase().replace('_', ' ')}
        </div>
      </div>

      {/* Route Summary */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-50 rounded-lg p-3 text-center"
          >
            <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-600">{routeInfo.duration}</div>
            <div className="text-xs text-blue-500">Duration</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 rounded-lg p-3 text-center"
          >
            <MapPin className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600">{routeInfo.distance}</div>
            <div className="text-xs text-green-500">Distance</div>
          </motion.div>
        </div>

        {/* AI Route Information */}
        {showAiRoute && aiRouteData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600">🤖</span>
              <span className="font-semibold text-green-700">AI Route Analysis</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {Math.round(aiRouteData.prediction.confidence * 100)}% confidence
              </span>
            </div>
            <div className="text-sm text-green-700 mb-2">
              {aiRouteData.prediction.recommendation}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/50 rounded p-2">
                <div className="font-medium text-green-600">Efficiency Score</div>
                <div className="text-green-700">{Math.round(aiRouteData.prediction.efficiency_score * 100)}%</div>
              </div>
              <div className="bg-white/50 rounded p-2">
                <div className="font-medium text-green-600">AI Estimated</div>
                <div className="text-green-700">{Math.round(aiRouteData.prediction.estimated_duration / 60)}min</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Warnings */}
        {routeInfo.warnings && routeInfo.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                {routeInfo.warnings.map((warning, index) => (
                  <div key={index} className="mb-1 last:mb-0">{warning}</div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Alternate Routes */}
        {alternateRoutes && alternateRoutes.length > 1 && (
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={() => setShowAlternates(!showAlternates)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-700">
                Route Options ({alternateRoutes.length})
              </span>
              {showAlternates ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {showAlternates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  {alternateRoutes.map((route, index) => {
                    const leg = route.legs[0];
                    const isSelected = index === selectedRouteIndex;
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onRouteSelect(index)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                              Route {index + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                              {leg.duration.text} • {leg.distance.text}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Step-by-Step Directions */}
        <div className="p-4">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="font-medium text-gray-700 flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Directions ({routeInfo.steps?.length || 0} steps)</span>
            </span>
            {showSteps ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {showSteps && routeInfo.steps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {routeInfo.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-sm text-gray-700 mb-1"
                        dangerouslySetInnerHTML={{ 
                          __html: step.instructions.replace(/<div[^>]*>/g, ' ').replace(/<\/div>/g, '') 
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        {step.distance.text} • {step.duration.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {routeInfo.copyrights && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-2">
            <Info className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-500">{routeInfo.copyrights}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RoutePanel;
