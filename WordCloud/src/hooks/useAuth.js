// src/hooks/useAuth.js
import { useState } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Sign-in cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError(
            "Pop-up blocked by browser. Please allow pop-ups and try again."
          );
          break;
        case "auth/cancelled-popup-request":
          setError("Multiple pop-up requests detected. Please try again.");
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your connection and try again."
          );
          break;
        default:
          setError("An error occurred during sign in. Please try again.");
      }
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    handleGoogleSignIn,
  };
};
