import React from "react";
import { Provider } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/authContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Pages
import Navbar from "./components/Navbar";
import { GameSelectionPage } from "./features/gameSelection";
import { CharacterSelectionPage } from "./features/characterSelection";
import { ComboListPage } from "./features/comboList";
import { ComboCreationPage } from "./features/comboCreation";

// Auth components
import { Login } from "./features/auth/components/Login"; 
import Register from "./features/auth/components/Register/Register";

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
        <AuthProvider>
          <div className="app">
            <Layout>
              <main className="app__main">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Home page is the game selection */}
                  <Route path="/" element={<GameSelectionPage />} />

                  {/* For backward compatibility, also handle /games */}
                  <Route path="/games" element={<Navigate to="/" replace />} />

                  {/* Character Selection */}
                  <Route
                    path="/games/:gameId/characters"
                    element={<CharacterSelectionPage />}
                  />

                  {/* Combo List */}
                  <Route
                    path="/games/:gameId/characters/:characterId/combos"
                    element={<ComboListPage />}
                  />

                  {/* Protected Routes */}
                  {/* Combo Builder (Updated path) */}
                  <Route
                    path="/games/:gameId/characters/:characterId/builder"
                    element={
                      <ProtectedRoute>
                        <ComboCreationPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Old Combo Creation Route - redirect to new path */}
                  <Route
                    path="/games/:gameId/characters/:characterId/combos/create"
                    element={<Navigate to="../builder" replace />}
                  />

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
            </Layout>
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
            theme="dark" // Changed to dark theme to match your app style
          />
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;