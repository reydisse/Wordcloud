// src/pages/participant/ParticipantView.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

function ParticipantView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [preservedResponse, setPreservedResponse] = useState("");
  const maxCharacters = 200;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionDoc = await getDoc(doc(db, "sessions", sessionId));

        if (!sessionDoc.exists()) {
          setError("Session not found");
          navigate("/join");
          return;
        }

        const sessionData = sessionDoc.data();
        if (!sessionData.isActive) {
          setError("This session has ended");
          navigate("/join");
          return;
        }

        setSession(sessionData);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      setError("Please enter your response");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const sessionRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionRef, {
        responses: arrayUnion(response.trim()),
        responseCount: (session.responseCount || 0) + 1,
      });

      navigate("/join?success=true");
    } catch (err) {
      console.error("Error submitting response:", err);
      setPreservedResponse(response);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
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

  return (
    <div className='min-h-screen bg-white p-4 relative'>
      {/* Session Code Header */}
      <div className='flex justify-between items-center mb-8'>
        <span className='text-sm text-gray-500'>Session Code:</span>
        <span className='text-sm text-gray-700'>{session?.code}</span>
      </div>

      {/* Question */}
      <div className='mb-4'>
        <h1 className='text-xl font-bold text-gray-900 mb-2'>
          {session?.question}
        </h1>
        <p className='text-sm text-gray-600'>
          Please share your response below
        </p>
      </div>

      {/* Response Input */}
      <div className='relative'>
        <textarea
          value={response}
          onChange={(e) => {
            if (e.target.value.length <= maxCharacters) {
              setResponse(e.target.value);
            }
          }}
          placeholder='Type your response here...'
          className='w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
        />
        <div className='absolute bottom-3 right-3 text-xs text-gray-400'>
          {response.length}/{maxCharacters} characters
        </div>
      </div>

      {error && !showToast && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg'>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !response.trim()}
        className={`w-full mt-6 py-3 bg-[#1a2b3b] text-white rounded-lg transition-colors
          ${
            submitting || !response.trim()
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#2c3e50]"
          }`}
      >
        {submitting ? (
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
            Submitting...
          </div>
        ) : (
          "Submit Response"
        )}
      </button>

      {/* Failed Submission View */}
      {showToast && (
        <div className='fixed bottom-0 left-0 right-0 p-4'>
          <div className='max-w-md mx-auto'>
            {/* Preserved Response Card */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2'>
              <p className='text-gray-700 text-sm'>{preservedResponse}</p>
            </div>

            {/* Retry Button */}
            <button
              onClick={() => {
                setResponse(preservedResponse);
                setShowToast(false);
              }}
              className='w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mb-2 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Retry Submission
            </button>

            {/* Toast Message */}
            <div className='bg-[#1a2b3b] text-white px-4 py-3 rounded-lg flex items-center justify-between'>
              <div className='flex items-center gap-2'>
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
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>Couldn&apos;t submit response</span>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className='text-white/80 hover:text-white'
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
            </div>
          </div>
        </div>
      )}

      {/* Tap to retry helper text */}
      {showToast && (
        <div className='fixed bottom-32 left-0 right-0 text-center'>
          <p className='text-sm text-gray-500'>Tap to retry</p>
        </div>
      )}
    </div>
  );
}

export default ParticipantView;
