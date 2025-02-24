// src/App.jsx
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import ErrorFallback from './components/ErrorBoundary/ErrorFallback';
import Layout from './features/shared/components/Layout';
import FeatureApp from './features/app/components/App';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Layout>
          <FeatureApp />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Layout>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;