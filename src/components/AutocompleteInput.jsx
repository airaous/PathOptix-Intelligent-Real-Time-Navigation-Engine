import React, { useState, useRef, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AutocompleteInput = ({
  placeholder,
  value,
  onChange,
  icon,
  isActive,
  onMapSelectToggle
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed */
    },
    debounce: 300,
  });

  // Update input value when external value changes
  useEffect(() => {
    if (value && typeof value === 'object' && value.lat && value.lng) {
      // If value is a coordinates object, don't update input (keep user's search)
      // This prevents the input from showing coordinates
    } else if (typeof value === 'string') {
      setValue(value, false);
    }
  }, [value, setValue]);

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (suggestion) => {
    setValue(suggestion.description, false);
    clearSuggestions();
    setIsInputFocused(false);

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      onChange({ lat, lng, address: suggestion.description });
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  const handleClear = () => {
    setValue('', false);
    onChange(null);
    clearSuggestions();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setIsInputFocused(false), 150);
  };

  const getDisplayValue = () => {
    if (inputValue) return inputValue;
    if (value && typeof value === 'object' && value.address) return value.address;
    return '';
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`relative bg-white rounded-lg shadow-lg border transition-all duration-200 ${
          isInputFocused || isActive
            ? 'border-blue-500 shadow-xl ring-2 ring-blue-200'
            : 'border-gray-300'
        }`}
      >
        <div className="flex items-center">
          <div className="pl-4">
            {icon}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={getDisplayValue()}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!ready}
            className="flex-1 px-3 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
          />

          <div className="flex items-center pr-2 space-x-1">
            {value && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-gray-400" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMapSelectToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
              title="Select on map"
              type="button"
            >
              <MapPin className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {status === 'OK' && isInputFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50"
          >
            {data.map((suggestion, index) => (
              <motion.button
                key={suggestion.place_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                type="button"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {!ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center"
        >
          <div className="flex items-center space-x-2 text-gray-500">
            <Search className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Loading...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AutocompleteInput;
