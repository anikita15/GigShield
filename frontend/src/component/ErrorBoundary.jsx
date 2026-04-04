import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-page p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 className="text-xl font-bold text-navy-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xs">
            An unexpected error occurred. Please reload the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-navy-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
