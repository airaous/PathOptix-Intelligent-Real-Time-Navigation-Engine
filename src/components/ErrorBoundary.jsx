import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('PathOptix Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-red-100 p-4 rounded-full mx-auto w-20 h-20 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                PathOptix encountered an unexpected error. This might be due to a network issue or a temporary problem with the mapping service.
              </p>
            </motion.div>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mb-6 p-4 bg-gray-100 rounded-lg text-left"
              >
                <h3 className="font-semibold text-gray-700 mb-2">Error Details:</h3>
                <div className="text-sm text-gray-600 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div className="max-h-32 overflow-y-auto">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-3"
            >
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Application</span>
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6 text-sm text-gray-500"
            >
              <p>
                If the problem persists, please check:
              </p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Your internet connection</li>
                <li>• Google Maps API key configuration</li>
                <li>• Browser console for additional errors</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
