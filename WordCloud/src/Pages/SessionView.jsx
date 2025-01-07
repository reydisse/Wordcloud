// src/pages/SessionView.jsx - Part 1
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Styles for animations
const endingStyles = `
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.95); }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(100%); }
    100% { transform: translateY(0); }
  }
  
  .ending-animation {
    animation: fadeOut 1.5s ease-in-out forwards;
  }
  
  .slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }
  
  .modal-overlay {
    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease-in-out;
  }
`;

function SessionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [responses, setResponses] = useState([]);
  const [participants, setParticipants] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Generate word cloud styles
  const generateWordCloudStyles = useCallback((text) => {
    const fontSize = Math.floor(Math.random() * (32 - 16) + 16);
    const opacity = Math.random() * (1 - 0.4) + 0.4;
    const top = Math.floor(Math.random() * 70) + 15;
    const left = Math.floor(Math.random() * 70) + 15;
    const weight = Math.min(700, 400 + text.length * 10);

    return {
      position: "absolute",
      top: `${top}%`,
      left: `${left}%`,
      fontSize: `${fontSize}px`,
      opacity: opacity,
      fontWeight: weight,
      transform: `rotate(${Math.random() * 20 - 10}deg)`,
      transition: "all 0.5s ease-in-out",
      cursor: "default",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
      zIndex: Math.floor(Math.random() * 10),
    };
  }, []);

  // End session handler
  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await updateDoc(doc(db, "sessions", id), {
        isActive: false,
        endedAt: serverTimestamp(),
      });

      // Start exit animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error ending session:", err);
      setIsEnding(false);
    }
  };

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!id) return;

      try {
        const sessionDoc = await getDoc(doc(db, "sessions", id));

        if (!sessionDoc.exists()) {
          setError("Session not found");
          return;
        }

        const sessionData = sessionDoc.data();
        setSession({ id: sessionDoc.id, ...sessionData });
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to load session");
      }
    };

    fetchSession();
  }, [id]);

  // Real-time responses listener
  useEffect(() => {
    if (!id) return;

    const responsesRef = collection(doc(db, "sessions", id), "responses");
    const responsesQuery = query(responsesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      responsesQuery,
      (snapshot) => {
        const responsesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          style: generateWordCloudStyles(doc.data().text),
          createdAt: doc.data().createdAt?.toDate(),
        }));

        // Track unique participant IDs
        const uniqueParticipants = new Set(
          responsesList.map((response) => response.participantId)
        );
        setParticipants(uniqueParticipants);
        setResponses(responsesList);
        setLoading(false);
      },
      (err) => {
        console.error("Error in responses listener:", err);
        setError("Failed to load responses");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id, generateWordCloudStyles]);

  // Loading and error handlers
  if (loading) {
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
          <span className='text-gray-500'>Loading session...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className='text-blue-500 hover:underline'
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <style>{endingStyles}</style>

      {/* Header */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-[90%] mx-auto px-4'>
          <div className='flex justify-between h-16 items-center'>
            {/* Left side */}
            <div className='flex items-center space-x-8'>
              {/* Back Button */}
              <button
                onClick={() => navigate("/dashboard")}
                className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
              >
                <svg
                  className='w-5 h-5 mr-2'
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
                <span>Back to Dashboard</span>
              </button>

              {/* Question */}
              <span className='text-xl font-medium text-gray-900'>
                {session?.question}
              </span>
            </div>

            {/* Right side */}
            <div className='flex items-center space-x-6'>
              <div className='text-sm text-gray-500'>
                Code: <span className='font-medium'>{session?.code}</span>
              </div>
              <div className='bg-gray-100 px-3 py-1 rounded-full text-sm'>
                go to xyz.com
              </div>
              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className='flex items-center px-4 py-2 bg-[#1a2b3b] text-white rounded-lg hover:bg-[#2c3e50] transition-colors'
              >
                {isFullscreen ? (
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 9H4v5M20 9h-5v5M9 20H4v-5M20 20h-5v-5'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
                    />
                  </svg>
                )}
                {isFullscreen ? "Exit Fullscreen" : "Present Fullscreen"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`max-w-[90%] mx-auto px-4 py-8 ${
          isEnding ? "ending-animation" : ""
        }`}
      >
        <div className='flex gap-8'>
          {/* Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <div className='bg-white rounded-lg shadow-sm p-6 space-y-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  Participants
                </h3>
                <p className='text-3xl font-bold text-gray-900'>
                  {participants.size}
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>
                  Responses
                </h3>
                <p className='text-3xl font-bold text-gray-900'>
                  {responses.length}
                </p>
              </div>
            </div>
          </div>

          {/* Word Cloud Area */}
          <div className='flex-1'>
            <div
              className='bg-white rounded-lg shadow-sm p-8 relative'
              style={{ height: "calc(100vh - 180px)" }}
            >
              {responses.map((response) => (
                <div
                  key={response.id}
                  style={response.style}
                  className='absolute inline-block text-gray-900 hover:text-blue-600 transition-colors duration-200'
                >
                  {response.text}
                </div>
              ))}

              {responses.length === 0 && (
                <div className='h-full flex items-center justify-center text-gray-500'>
                  <div className='text-center'>
                    <p className='text-xl mb-2'>Waiting for responses...</p>
                    <p className='text-sm'>
                      Share the code with participants to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* End Session Button */}
      <div className='fixed bottom-8 left-8'>
        <button
          onClick={() => setShowEndConfirmation(true)}
          className='bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2'
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
          End Session
        </button>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div
            className='absolute inset-0 modal-overlay'
            onClick={() => setShowEndConfirmation(false)}
          />
          <div className='bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 relative z-10 slide-up'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-red-500'
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
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                End Session?
              </h3>
              <p className='text-gray-500 mb-6'>
                This will end the session for all participants. This action
                cannot be undone.
              </p>
              <div className='flex justify-center space-x-4'>
                <button
                  onClick={() => setShowEndConfirmation(false)}
                  className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndSession}
                  disabled={isEnding}
                  className={`px-4 py-2 bg-red-500 text-white rounded-lg transition-colors
                    ${
                      isEnding
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-600"
                    }`}
                >
                  {isEnding ? (
                    <div className='flex items-center'>
                      <svg
                        className='animate-spin h-5 w-5 mr-2'
                        viewBox='0 0 24 24'
                      >
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
                      Ending...
                    </div>
                  ) : (
                    "End Session"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionView;
