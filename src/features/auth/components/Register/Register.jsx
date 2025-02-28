// src/features/auth/components/Register/Register.jsx
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../../../firebase/auth";
import { useAuth } from "../../../../contexts/authContext";
import "./Register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // First check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message || "Failed to create account");
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="auth-page">
      {userLoggedIn && <Navigate to={"/"} replace={true} />}

      <main className="auth-page__container">
        <div className="auth-card">
          <div className="auth-card__header">
            <h3 className="auth-card__title">Create a New Account</h3>
          </div>
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form__group">
              <label className="form__label">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form__input"
              />
            </div>

            <div className="form__group">
              <label className="form__label">Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form__input"
              />
            </div>

            <div className="form__group">
              <label className="form__label">Confirm Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className="form__input"
              />
            </div>

            {errorMessage && (
              <div className="form__error">{errorMessage}</div>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`button button--primary button--full ${
                isRegistering ? "button--disabled" : ""
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            
            <div className="auth-card__link-container">
              <p>
                Already have an account?{" "}
                <Link to={"/login"} className="auth-card__link">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;