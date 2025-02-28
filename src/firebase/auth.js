// src/firebase/auth.js
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup, // Add this import
  signOut, // Add this import
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
  // result.user
  return result
}

export const doSignOut = async () => {
  // Changed to use the imported signOut function
  return signOut(auth); 
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