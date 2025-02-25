// src/App.jsx
import React from "react";
import { Provider } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import { GameSelectionPage } from "./features/gameSelection";
import { CharacterSelectionPage } from "./features/characterSelection";

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button
        className="button button--primary mt-4"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <div className="app">
          {/* Sidebar would be included here once implemented */}
          <main className="app__main">
            <Routes>
              {/* Home page is the game selection */}
              <Route path="/" element={<GameSelectionPage />} />
              
              {/* For backward compatibility, also handle /games */}
              <Route path="/games" element={<Navigate to="/" replace />} />

              {/* Character Selection */}
              <Route path="/games/:gameId/characters" element={<CharacterSelectionPage />} />

              {/* Combo List - to be implemented */}
              <Route path="/games/:gameId/characters/:characterId/combos" element={<div>Combo List Page (coming soon)</div>} />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="page">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
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
      </ErrorBoundary>
    </Provider>
  );
};

export default App;