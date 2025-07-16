
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiModalTransport = ({ origin, destination, onModeChange }) => {
  const [transportModes, setTransportModes] = useState([]);
  const [selectedModes, setSelectedModes] = useState(['driving']);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const modes = [
    { id: 'driving', label: 'Driving', icon: '🚗', color: 'blue' },
    { id: 'walking', label: 'Walking', icon: '🚶', color: 'green' },
    { id: 'bicycling', label: 'Cycling', icon: '🚲', color: 'orange' },
    { id: 'transit', label: 'Transit', icon: '🚌', color: 'purple' },
    { id: 'rideshare', label: 'Rideshare', icon: '🚕', color: 'yellow' },
    { id: 'scooter', label: 'E-Scooter', icon: '🛴', color: 'pink' }
  ];

  useEffect(() => {
    if (origin && destination && selectedModes.length > 0) {
      fetchMultiModalComparison();
    }
  }, [origin, destination, selectedModes]);

  const fetchMultiModalComparison = async () => {
    setLoading(true);
    try {
      // Simulate multi-modal API call
      const comparisonData = selectedModes.map(mode => ({
        mode,
        duration: Math.floor(Math.random() * 3600) + 600, // 10-60 minutes
        distance: Math.floor(Math.random() * 20000) + 1000, // 1-20km
        cost: Math.floor(Math.random() * 50) + 5, // $5-$55
        carbon: Math.floor(Math.random() * 10) + 1, // 1-10kg CO2
        availability: Math.random() > 0.2, // 80% availability
        efficiency: Math.random() * 0.4 + 0.6 // 60-100% efficiency
      }));
      
      setComparison(comparisonData);
    } catch (error) {
      console.error('Multi-modal comparison error:', error);
    }
    setLoading(false);
  };

  const toggleMode = (modeId) => {
    setSelectedModes(prev => 
      prev.includes(modeId) 
        ? prev.filter(id => id !== modeId)
        : [...prev, modeId]
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    return mins > 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;
  };

  const formatDistance = (meters) => {
    return meters > 1000 ? `${(meters/1000).toFixed(1)} km` : `${meters} m`;
  };

  const getModeColor = (mode) => {
    const modeConfig = modes.find(m => m.id === mode);
    return modeConfig ? modeConfig.color : 'gray';
  };

  const getModeIcon = (mode) => {
    const modeConfig = modes.find(m => m.id === mode);
    return modeConfig ? modeConfig.icon : '🚗';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        🚀 Multi-Modal Transport
      </h3>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Select transport modes to compare:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => toggleMode(mode.id)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                selectedModes.includes(mode.id)
                  ? `border-${mode.color}-500 bg-${mode.color}-50 text-${mode.color}-700`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{mode.icon}</div>
              <div>{mode.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Comparing routes...</span>
          </motion.div>
        ) : comparison ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-md font-semibold text-gray-800 mb-3">
              Route Comparison
            </h4>
            
            {comparison.map((option) => (
              <div
                key={option.mode}
                className={`p-4 rounded-lg border-l-4 border-${getModeColor(option.mode)}-400 bg-gray-50`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getModeIcon(option.mode)}</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {option.mode}
                    </span>
                    {!option.availability && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onModeChange?.(option.mode)}
                    disabled={!option.availability}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      option.availability
                        ? `bg-${getModeColor(option.mode)}-500 text-white hover:bg-${getModeColor(option.mode)}-600`
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Select
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Time</div>
                    <div className="font-semibold">{formatDuration(option.duration)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Distance</div>
                    <div className="font-semibold">{formatDistance(option.distance)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Cost</div>
                    <div className="font-semibold">${option.cost}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">CO₂</div>
                    <div className="font-semibold">{option.carbon}kg</div>
                  </div>
                </div>
                
                {/* Efficiency Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Efficiency</span>
                    <span>{(option.efficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${getModeColor(option.mode)}-500`}
                      style={{ width: `${option.efficiency * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default MultiModalTransport;
