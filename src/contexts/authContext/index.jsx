// src/contexts/authContext/index.jsx
import { useContext, useEffect, useState, createContext } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create the context with a default value
const AuthContext = createContext({
  currentUser: null,
  userLoggedIn: false,
  loading: true
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Initialize as false, not null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  async function initializeUser(user) {
    console.log("Auth state changed, user:", user ? "exists" : "null");
    
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  // Create value object once to avoid unnecessary re-renders
  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  console.log("AuthProvider rendering with userLoggedIn:", userLoggedIn);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}