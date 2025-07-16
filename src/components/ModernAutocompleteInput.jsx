import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernAutocompleteInput = ({
  placeholder,
  value,
  onChange,
  icon,
  isActive,
  onMapSelectToggle
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const sessionTokenRef = useRef(null);

  // Initialize session token for Places API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      try {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      } catch (error) {
        // Silently handle any initialization errors
        console.warn('Failed to initialize Places API session token:', error.message);
      }
    }
  }, []);

  // Update input value when external value changes
  useEffect(() => {
    if (value && typeof value === 'object' && value.lat && value.lng) {
      // If value is a coordinates object, don't update input (keep user's search)
    } else if (typeof value === 'string') {
      setInputValue(value);
    }
  }, [value]);

  // Debounced autocomplete function using the new API approach
  const getAutocompleteSuggestions = useCallback(
    debounce(async (input) => {
      if (!input || !window.google || !window.google.maps || !window.google.maps.places) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Use AutocompleteService for now but with better error handling
        // The warning is from Google but the API still works
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: input,
            sessionToken: sessionTokenRef.current,
            types: ['geocode']
          },
          (predictions, status) => {
            try {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setSuggestions(predictions || []);
              } else {
                setSuggestions([]);
              }
            } catch (callbackError) {
              // Handle any errors in the callback
              setSuggestions([]);
            } finally {
              setIsLoading(false);
            }
          }
        );
      } catch (error) {
        // Filter out extension-related errors
        if (!error.message?.includes('runtime.lastError') && 
            !error.message?.includes('message channel closed')) {
          console.error('Autocomplete error:', error);
        }
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInput = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.length > 2) {
      getAutocompleteSuggestions(newValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (suggestion) => {
    setInputValue(suggestion.description || suggestion.structured_formatting?.main_text || '');
    setSuggestions([]);
    setIsInputFocused(false);

    try {
      // Use Geocoding API to get coordinates
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { 
          placeId: suggestion.place_id,
          sessionToken: sessionTokenRef.current 
        },
        (results, status) => {
          try {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              onChange({
                lat: location.lat(),
                lng: location.lng(),
                address: suggestion.description || suggestion.structured_formatting?.main_text || ''
              });
              
              // Create new session token for next request
              if (window.google && window.google.maps && window.google.maps.places) {
                sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
              }
            }
          } catch (geocodeCallbackError) {
            // Handle callback errors silently
            if (!geocodeCallbackError.message?.includes('runtime.lastError')) {
              console.error('Geocoding callback error:', geocodeCallbackError);
            }
          }
        }
      );
    } catch (error) {
      // Filter out extension-related errors
      if (!error.message?.includes('runtime.lastError') && 
          !error.message?.includes('message channel closed')) {
        console.error('Geocoding error:', error);
      }
    }
  };

  const clearInput = () => {
    setInputValue('');
    setSuggestions([]);
    onChange(null);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    if (inputValue.length > 2) {
      getAutocompleteSuggestions(inputValue);
    }
  };

  const handleBlur = () => {
    // Delay to allow suggestion selection
    setTimeout(() => {
      setIsInputFocused(false);
      setSuggestions([]);
    }, 200);
  };

  return (
    <div className="relative">
      <div className={`relative transition-all duration-200 ${
        isInputFocused ? 'transform scale-105' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon || <Search className="h-5 w-5 text-gray-400" />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pl-10 pr-20 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            isInputFocused 
              ? 'bg-white border-blue-300 shadow-lg' 
              : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400'
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {inputValue && (
            <button
              onClick={clearInput}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onMapSelectToggle}
            className={`p-1 transition-colors ${
              isActive 
                ? 'text-blue-600 hover:text-blue-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Select on map"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isInputFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id || index}
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.structured_formatting?.main_text || suggestion.description}
                    </p>
                    {suggestion.structured_formatting?.secondary_text && (
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default ModernAutocompleteInput;
