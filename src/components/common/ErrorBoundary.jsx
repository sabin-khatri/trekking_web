import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center border border-red-100">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ⚠️
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Oops, something went wrong.</h1>
            <p className="text-slate-600 mb-8">
              We encountered an unexpected error. Please try refreshing the page or head back to base camp.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-forest-500/30 transition-all"
            >
              Return to Base Camp
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
