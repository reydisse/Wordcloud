// src/pages/SessionSetup.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function SessionSetup() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const generateSessionCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.toUpperCase();
  };

  const handleStartSession = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sessionCode = generateSessionCode();
      console.log("Generated code:", sessionCode);

      const sessionData = {
        question: question.trim(),
        userId: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        code: sessionCode,
        isActive: true,
        responseCount: 0,
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      };

      // Add retry logic
      let retryCount = 0;
      const maxRetries = 3;
      let sessionRef;

      while (retryCount < maxRetries) {
        try {
          sessionRef = await addDoc(collection(db, "sessions"), sessionData);
          break; // If successful, exit the retry loop
        } catch (err) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw err; // If all retries failed, throw the error
          }
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }

      // Verify the session was created
      const createdSessionDoc = await getDoc(
        doc(db, "sessions", sessionRef.id)
      );
      if (!createdSessionDoc.exists()) {
        throw new Error("Session creation verification failed");
      }

      console.log("Session created successfully:", {
        id: sessionRef.id,
        code: sessionCode,
      });

      // Show success message before navigation
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/session/${sessionRef.id}`);
      }, 1000);
    } catch (err) {
      console.error("Error creating session:", err);
      setError("Failed to create session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not loaded yet, show loading state
  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='flex items-center space-x-2'>
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
          <span className='text-gray-500'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between h-16 items-center'>
            <div className='flex items-center'>
              <button
                onClick={handleBack}
                className='flex items-center text-gray-700 hover:text-gray-900 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='w-5 h-5'
                >
                  <path d='M19 12H5M12 19l-7-7 7-7' />
                </svg>
                <span className='ml-2 text-sm font-medium'>Back</span>
              </button>
              <span className='ml-4 text-xl font-medium text-gray-900'>
                Session Setup
              </span>
            </div>

            {/* User Profile Section */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center focus:outline-none'
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt='Profile'
                    className='w-8 h-8 rounded-full object-cover border border-gray-200'
                    referrerPolicy='no-referrer'
                  />
                ) : (
                  <div className='w-8 h-8 bg-[#1a2b3b] rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-medium'>
                      {user.displayName
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                  {user && (
                    <div className='px-4 py-2 border-b border-gray-100'>
                      <p className='text-sm font-medium text-gray-900'>
                        {user.displayName}
                      </p>
                      <p className='text-sm text-gray-500'>{user.email}</p>
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex flex-col items-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            What's your question?
          </h1>

          {error && (
            <div className='w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg'>
              {error}
            </div>
          )}

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Type your question here...'
            className='w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          />

          <button
            onClick={handleStartSession}
            disabled={isLoading}
            className={`w-full mt-6 bg-[#1a2b3b] text-white py-3 rounded-lg transition-colors
              ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#2c3e50]"
              }`}
          >
            {isLoading ? (
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
                Creating Session...
              </div>
            ) : (
              "Start Session"
            )}
          </button>
        </div>
      </main>

      {/* Success Message */}
      {success && (
        <div className='fixed bottom-0 left-0 right-0 p-4'>
          <div className='max-w-md mx-auto'>
            <div className='bg-green-50 border border-green-200 rounded-lg shadow-sm p-4 flex items-center justify-between'>
              <div className='flex items-center'>
                <svg
                  className='w-5 h-5 text-green-500 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span className='text-green-700'>
                  Session created successfully!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionSetup;
