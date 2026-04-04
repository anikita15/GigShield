import React from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './component/ErrorBoundary';
import AppRouter from './router/AppRouter';

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
