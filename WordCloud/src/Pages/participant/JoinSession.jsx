// src/pages/participant/JoinSession.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function JoinSession() {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleJoinSession = async () => {
    if (!sessionCode.trim()) {
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const sessionsRef = collection(db, "sessions");
      const q = query(
        sessionsRef,
        where("code", "==", sessionCode.toUpperCase()),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setShowError(true);
        return;
      }

      const sessionDoc = querySnapshot.docs[0];
      navigate(`/participate/${sessionDoc.id}`);
    } catch (err) {
      console.error("Error joining session:", err);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  if (showError) {
    return (
      <div className='min-h-screen bg-white flex flex-col items-center justify-center px-4'>
        <div className='w-full max-w-sm bg-white rounded-lg p-6 flex flex-col items-center'>
          {/* Error Icon */}
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-6 h-6 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Oops! Invalid code
          </h2>
          <p className='text-gray-500 text-sm mb-6'>
            Check the code and try again
          </p>

          {/* Input Field */}
          <div className='w-full relative mb-4'>
            <input
              type='text'
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              placeholder='Enter session code'
              className='w-full px-4 py-3 text-center text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider'
              maxLength={6}
            />
            {sessionCode && (
              <button
                onClick={() => setSessionCode("")}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleJoinSession}
            disabled={loading || !sessionCode.trim()}
            className={`w-full py-3 bg-[#1a2b3b] text-white rounded-lg transition-colors mb-4
              ${
                loading || !sessionCode.trim()
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#2c3e50]"
              }`}
          >
            {loading ? "Checking..." : "Try Again"}
          </button>

          {/* Support Link */}
          <p className='text-sm text-gray-500 mb-4'>
            Need help?{" "}
            <a href='#' className='text-gray-700 hover:underline'>
              Contact Support
            </a>
          </p>

          {/* Back to Home */}
          <button
            onClick={() => {
              setShowError(false);
              setSessionCode("");
            }}
            className='text-sm text-gray-700 hover:text-gray-900 flex items-center'
          >
            <svg
              className='w-4 h-4 mr-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Normal Join Session View
  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center px-4'>
      {/* Logo/Icon */}
      <div className='mb-12'>
        <svg
          className='w-12 h-12 text-gray-800'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
          />
        </svg>
      </div>

      {/* Session Code Input */}
      <div className='w-full max-w-xs'>
        <div className='relative'>
          <input
            type='text'
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            placeholder='ENTER SESSION'
            className='w-full px-4 py-3 text-center text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider'
            maxLength={6}
          />
          {sessionCode && (
            <button
              onClick={() => setSessionCode("")}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinSession}
          disabled={loading || !sessionCode.trim()}
          className={`w-full mt-6 py-3 bg-[#1a2b3b] text-white rounded-lg transition-colors
            ${
              loading || !sessionCode.trim()
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#2c3e50]"
            }`}
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <svg className='animate-spin h-5 w-5 mr-2' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                  fill='none'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Joining...
            </div>
          ) : (
            "Join Session"
          )}
        </button>
      </div>

      {/* Support Link */}
      <div className='mt-8 text-sm text-gray-500'>
        Need help?{" "}
        <a href='#' className='text-gray-700 hover:underline'>
          Contact support
        </a>
      </div>
    </div>
  );
}

export default JoinSession;
