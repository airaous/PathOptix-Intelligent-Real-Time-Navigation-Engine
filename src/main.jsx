import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TestApp from './TestApp.jsx'
import './index.css'

// Suppress common browser extension and Google Maps deprecation warnings
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  const message = args.join(' ');
  
  // Suppress specific Google Maps deprecation warnings that we can't control
  if (message.includes('google.maps.places.AutocompleteService is not available to new customers') ||
      message.includes('google.maps.Marker is deprecated') ||
      message.includes('A listener indicated an asynchronous response') ||
      message.includes('message channel closed before a response was received')) {
    return; // Suppress these warnings
  }
  
  // Allow other warnings through
  originalConsoleWarn.apply(console, args);
};

console.error = (...args) => {
  const message = args.join(' ');
  
  // Suppress browser extension related errors
  if (message.includes('runtime.lastError') ||
      message.includes('message channel closed before a response was received') ||
      message.includes('A listener indicated an asynchronous response')) {
    return; // Suppress these errors
  }
  
  // Allow other errors through
  originalConsoleError.apply(console, args);
};

// Global error handler for unhandled promise rejections and runtime errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('message channel closed before a response was received') ||
       event.reason.message.includes('runtime.lastError'))) {
    event.preventDefault(); // Suppress this error
    return;
  }
});

// Handle Chrome extension runtime errors
window.addEventListener('error', (event) => {
  if (event.message && 
      (event.message.includes('runtime.lastError') ||
       event.message.includes('message channel closed before a response was received'))) {
    event.preventDefault(); // Suppress this error
    return;
  }
});

// Additional handler for Chrome runtime errors
if (typeof chrome !== 'undefined' && chrome.runtime) {
  try {
    let lastErrorValue = chrome.runtime.lastError;
    Object.defineProperty(chrome.runtime, 'lastError', {
      get: function() {
        return lastErrorValue;
      },
      set: function(value) {
        // Suppress setting of lastError if it's the extension communication error
        if (value && value.message && 
            value.message.includes('message channel closed before a response was received')) {
          return; // Don't set the error
        }
        lastErrorValue = value;
      }
    });
  } catch (e) {
    // Silently handle any errors with Chrome runtime modification
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
