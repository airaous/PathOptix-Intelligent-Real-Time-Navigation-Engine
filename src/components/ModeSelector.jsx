import React from 'react';
import { Car, Bike, Footprints, Bus } from 'lucide-react';
import { motion } from 'framer-motion';

const MODES = [
  {
    id: 'DRIVING',
    name: 'Car',
    icon: Car,
    color: 'blue'
  },
  {
    id: 'WALKING',
    name: 'Walk',
    icon: Footprints,
    color: 'green'
  },
  {
    id: 'BICYCLING',
    name: 'Bike',
    icon: Bike,
    color: 'orange'
  },
  {
    id: 'TRANSIT',
    name: 'Transit',
    icon: Bus,
    color: 'purple'
  }
];

const ModeSelector = ({ selectedMode, onModeChange, disabled = false }) => {
  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected
        ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200'
        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50',
      green: isSelected
        ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200'
        : 'bg-white text-green-600 border-green-200 hover:bg-green-50',
      orange: isSelected
        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200'
        : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50',
      purple: isSelected
        ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-200'
        : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30"
    >
      <div className="flex flex-col space-y-2">
        <div className="text-xs font-medium text-gray-600 px-1 mb-1">
          Travel Mode
        </div>
        
        {MODES.map((mode) => {
          const IconComponent = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: disabled ? 1 : 1.03 }}
              whileTap={{ scale: disabled ? 1 : 0.97 }}
              onClick={() => !disabled && onModeChange(mode.id)}
              disabled={disabled}
              className={`
                flex items-center justify-center space-x-2 px-2 py-2 rounded-lg border transition-all duration-200
                ${getColorClasses(mode.color, isSelected)}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                min-w-0 text-xs
              `}
            >
              <IconComponent className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium truncate">{mode.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Compact Mode Description */}
      <motion.div
        key={selectedMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mt-2 pt-2 border-t border-gray-200"
      >
        <div className="text-xs text-gray-500 px-1 leading-tight">
          {selectedMode === 'DRIVING' && 'Car routes with traffic'}
          {selectedMode === 'WALKING' && 'Pedestrian paths'}
          {selectedMode === 'BICYCLING' && 'Bike-friendly routes'}
          {selectedMode === 'TRANSIT' && 'Public transport'}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModeSelector;
