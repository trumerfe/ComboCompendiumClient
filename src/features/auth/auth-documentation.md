# Firebase Authentication Documentation

## Table of Contents
- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Authentication Setup](#authentication-setup)
  - [Firebase Configuration](#firebase-configuration)
  - [Authentication Service](#authentication-service)
  - [Auth Context](#auth-context)
- [Authentication Features](#authentication-features)
  - [User Registration](#user-registration)
  - [Email and Password Sign In](#email-and-password-sign-in)
  - [Google Sign In](#google-sign-in)
  - [Sign Out](#sign-out)
  - [Password Reset](#password-reset)
  - [Password Change](#password-change)
  - [Email Verification](#email-verification)
- [Usage Examples](#usage-examples)
  - [Registration Component](#registration-component)
  - [Login Component](#login-component)
  - [Protected Routes](#protected-routes)
  - [User Profile Component](#user-profile-component)
- [Best Practices](#best-practices)
- [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)

## Overview

This document describes the authentication system implemented for the Combo Compendium application using Firebase Authentication. The system provides user registration, sign-in with email/password or Google, session management, and account management features such as password reset and email verification.

The authentication implementation follows a service-based architecture with a React Context API for state management, making it easy to access authentication state throughout the application.

## Directory Structure

```
src/
├── firebase/
│   ├── firebase.js           # Firebase initialization and configuration
│   └── auth.js               # Authentication service functions
├── contexts/
│   └── authContext/
│       └── index.jsx         # Auth context provider and hook
└── components/
    └── auth/
        ├── Login.jsx         # Login component (example implementation)
        ├── Register.jsx      # Registration component (example implementation)
        └── ProtectedRoute.jsx # Route protection component (example implementation)
```

## Authentication Setup

### Firebase Configuration

Firebase is initialized in `src/firebase/firebase.js` using environment variables for configuration:

```javascript
// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

**Note**: The configuration supports both Vite and Create React App environment variable formats.

### Authentication Service

The authentication service (`src/firebase/auth.js`) provides wrapper functions for Firebase Authentication methods:

```javascript
// src/firebase/auth.js
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  updatePassword 
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async(email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result
}

export const doSignOut = async () => {
  return signOut(auth)
}

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email)
}

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password)
}

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}`
  })
}
```

This service layer abstracts Firebase-specific code, making it easier to:
- Test authentication logic
- Replace Firebase with another provider if needed
- Maintain clean component code

### Auth Context

The Auth Context (`src/contexts/authContext/index.jsx`) provides authentication state throughout the application:

```javascript
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
  const [userLoggedIn, setUserLoggedIn] = useState(false);
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

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

Key features of the Auth Context:
- Manages the user state using Firebase's `onAuthStateChanged` listener
- Provides loading state for authentication initialization
- Blocks rendering of child components until authentication is initialized
- Provides a clean API through the `useAuth()` hook

## Authentication Features

### User Registration

The `doCreateUserWithEmailAndPassword` function registers a new user with email and password:

```javascript
export const doCreateUserWithEmailAndPassword = async(email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}
```

### Email and Password Sign In

The `doSignInWithEmailAndPassword` function signs in an existing user with email and password:

```javascript
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}
```

### Google Sign In

The `doSignInWithGoogle` function provides sign-in with Google authentication:

```javascript
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result
}
```

### Sign Out

The `doSignOut` function signs out the currently authenticated user:

```javascript
export const doSignOut = async () => {
  return signOut(auth)
}
```

### Password Reset

The `doPasswordReset` function sends a password reset email to the specified email address:

```javascript
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email)
}
```

### Password Change

The `doPasswordChange` function changes the password for the currently authenticated user:

```javascript
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password)
}
```

### Email Verification

The `doSendEmailVerification` function sends an email verification link to the currently authenticated user:

```javascript
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}`
  })
}
```

## Usage Examples

### Registration Component

Example implementation of a registration component:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword, doSendEmailVerification } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Create the user
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      
      // Send email verification
      await doSendEmailVerification();
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      setError(`Failed to create an account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
```

### Login Component

Example implementation of a login component:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await doSignInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (error) {
      setError(`Failed to sign in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      
      await doSignInWithGoogle();
      navigate('/');
    } catch (error) {
      setError(`Failed to sign in with Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleEmailLogin}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
      <div>
        <button onClick={handleGoogleLogin} disabled={loading}>
          Sign in with Google
        </button>
      </div>
      <div>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login;
```

### Protected Routes

Example implementation of a protected route component:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
```

Usage in Router:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### User Profile Component

Example implementation of a user profile component:

```jsx
import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { doPasswordChange, doSignOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await doPasswordChange(password);
      setMessage('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(`Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      setError(`Failed to sign out: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      
      <div>
        <strong>Email:</strong> {currentUser.email}
      </div>
      <div>
        <strong>Email Verified:</strong> {currentUser.emailVerified ? 'Yes' : 'No'}
      </div>
      
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>New Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          Update Password
        </button>
      </form>
      
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default UserProfile;
```

## Best Practices

1. **Environment Variables**
   - Store Firebase configuration in environment variables
   - Include fallbacks for different build systems (Vite, CRA)
   - Do not commit `.env` files to version control

2. **Error Handling**
   - Always wrap Firebase authentication calls in try/catch blocks
   - Display user-friendly error messages
   - Provide clear feedback for authentication failures

3. **Context Usage**
   - Initialize authentication in a high-level component (e.g., App.jsx)
   - Use the `useAuth` hook only within components wrapped by the AuthProvider
   - Check for loading state before rendering protected content

4. **Security**
   - Implement password strength requirements
   - Encourage email verification
   - Use protected routes to prevent unauthorized access

5. **Performance**
   - Clean up auth listeners in useEffect return functions
   - Only render children after authentication is initialized
   - Cache user data to reduce unnecessary re-renders

## Common Issues and Troubleshooting

### 1. "useAuth must be used within an AuthProvider" Error

**Cause**: The `useAuth` hook is being used in a component that is not wrapped by the `AuthProvider`.

**Solution**: Ensure that all components using the `useAuth` hook are descendants of the `AuthProvider` in the component tree.

```jsx
// In App.jsx or your main component
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <AuthProvider>
      {/* All your routes and components */}
    </AuthProvider>
  );
}
```

### 2. Protected Routes Flash Unauthorized Content

**Cause**: The protected route renders before the authentication state is determined.

**Solution**: Ensure loading state is properly checked before rendering:

```jsx
const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### 3. "auth/requires-recent-login" Error When Changing Password

**Cause**: Firebase requires recent authentication for sensitive operations.

**Solution**: Re-authenticate the user before sensitive operations:

```javascript
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const reAuthenticate = async (password) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, password);
  return reauthenticateWithCredential(user, credential);
};

// Then before sensitive operations:
await reAuthenticate(currentPassword);
await doPasswordChange(newPassword);
```

### 4. Persisting Authentication State on Page Refresh

**Cause**: By default, Firebase authentication persistence may not be set for long-term sessions.

**Solution**: Set persistence in your initialization:

```javascript
// In firebase.js or when setting up auth
import { setPersistence, browserLocalPersistence } from "firebase/auth";

// After initializing auth
setPersistence(auth, browserLocalPersistence);
```

### 5. Google Sign-In Popup Blocked

**Cause**: Popup blockers or the popup not triggered by a direct user action.

**Solution**: Ensure the sign-in method is triggered by a direct user action (like a button click) and consider using redirect method as a fallback:

```javascript
export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      // Fallback to redirect method
      return signInWithRedirect(auth, provider);
    }
    throw error;
  }
};
```
