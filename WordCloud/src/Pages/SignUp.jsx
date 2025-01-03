import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      // Handle specific error cases
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

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      {/* Logo */}
      <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-gray-600'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>

      {/* App Name and Tagline */}
      <h1 className='text-2xl font-bold text-gray-900 mb-1'>Word Cloud</h1>
      <p className='text-gray-500 text-sm mb-8'>Your workspace, simplified.</p>

      {/* Sign In Box */}
      <div className='w-full max-w-sm py-12 px-6 border border-gray-200 rounded-lg'>
        {/* Error Message */}
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg'>
            {error}
          </div>
        )}

        {user ? (
          <div className='text-center'>
            <p className='text-gray-700 mb-4'>Welcome, {user.displayName}!</p>
            <button
              onClick={() => auth.signOut()}
              className='w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors'
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm 
              ${
                loading
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4]"
              } transition-colors duration-300`}
          >
            {loading ? (
              <>
                <svg
                  className='animate-spin h-5 w-5 text-gray-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className='w-4 h-4' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        )}

        {/* Terms Text */}
        <p className='mt-8 text-center text-xs text-gray-500'>
          By signing in, you agree to our{" "}
          <a href='#' className='text-gray-700 hover:underline'>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href='#' className='text-gray-700 hover:underline'>
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Support Link */}
      <div className='mt-8 text-sm text-gray-500'>
        Need help?{" "}
        <a href='#' className='text-gray-700 hover:underline'>
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default SignUp;