// src/components/Hero.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

function Hero() {
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { handleGoogleSignIn, loading: authLoading } = useAuth();

  const handleCodeSubmit = async () => {
    if (!sessionCode.trim()) {
      setError("Please enter a session code");
      setShowError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      // Query sessions collection where code matches the input
      const sessionsRef = collection(db, "sessions");
      const q = query(
        sessionsRef,
        where("code", "==", sessionCode.trim().toUpperCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid session code");
        setShowError(true);
        return;
      }

      // Get the first matching session
      const sessionDoc = querySnapshot.docs[0];
      const sessionData = sessionDoc.data();

      if (!sessionData.isActive) {
        setError("This session has ended");
        setShowError(true);
        return;
      }

      // Navigate to participant view with the session ID
      navigate(`/participate/${sessionDoc.id}`);
    } catch (err) {
      console.error("Error validating session:", err);
      setError("Failed to join session");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCodeSubmit();
    }
  };

  // Handle input change with automatic capitalization
  const handleInputChange = (e) => {
    const upperValue = e.target.value.toUpperCase();
    setSessionCode(upperValue);
    setShowError(false);
  };

  return (
    <div className='relative isolate bg-white pt-16'>
      {/* Participant Entry Section */}
      <div className='w-full bg-blue-50 py-3 fixed top-16 left-0 right-0 z-40'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <span className='text-blue-900 font-medium'>
              Joining as a participant?
            </span>
            <div className='flex w-full sm:w-auto relative'>
              <input
                type='text'
                placeholder='Enter code here'
                value={sessionCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{ textTransform: "uppercase" }}
                className={`w-full sm:w-64 rounded-l-md px-4 py-2 border 
                  ${
                    showError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-600"
                  } 
                  focus:outline-none focus:ring-2 focus:border-transparent`}
              />
              <button
                onClick={handleCodeSubmit}
                disabled={loading}
                className={`rounded-r-md px-4 py-2 text-sm font-semibold text-white 
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  } 
                  transition-colors flex items-center justify-center min-w-[80px]`}
              >
                {loading ? (
                  <svg
                    className='animate-spin h-5 w-5 text-white'
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
                ) : (
                  "Join"
                )}
              </button>
            </div>

            {/* Error Message */}
            {showError && (
              <div className='absolute top-full left-0 right-0 mt-2 flex justify-center'>
                <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2 max-w-sm'>
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className='pt-32 pb-16 sm:pt-40'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Make Every Interaction Unforgettable
            </h1>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Turn presentations into conversations with live polls, quizzes,
              Q&A, and word clouds.
            </p>
            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4'>
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className='rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:opacity-50'
              >
                {authLoading ? "Loading..." : "Get Started for Free"}
              </button>
              <span className='text-sm text-gray-600'>
                No credit card required
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className='mt-16 flex justify-center'>
            <img
              src='https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg'
              alt='Interactive presentation illustration'
              className='max-w-full h-auto rounded-lg shadow-lg'
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
