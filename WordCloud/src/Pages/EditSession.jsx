import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function EditSession() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [navigationPath, setNavigationPath] = useState(null);
  const dropdownRef = useRef(null);

  // Check for unsaved changes
  const hasUnsavedChanges = question !== originalQuestion;

  // Handle beforeunload event
  useBeforeUnload(
    useCallback(
      (e) => {
        if (hasUnsavedChanges) {
          e.preventDefault();
          return (e.returnValue =
            "You have unsaved changes. Are you sure you want to leave?");
        }
      },
      [hasUnsavedChanges]
    )
  );

  // Authentication check
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

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId || !user) return;

      try {
        const sessionDoc = await getDoc(doc(db, "sessions", sessionId));

        if (!sessionDoc.exists()) {
          setError("Session not found");
          return;
        }

        const sessionData = sessionDoc.data();

        // Check if user owns this session
        if (sessionData.userId !== user.uid) {
          setError("You do not have permission to edit this session");
          return;
        }

        setQuestion(sessionData.question);
        setOriginalQuestion(sessionData.question);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSession();
    }
  }, [sessionId, user]);

  // Navigation handler with unsaved changes check
  const handleNavigation = (path) => {
    if (hasUnsavedChanges) {
      setNavigationPath(path);
      setShowConfirmDialog(true);
    } else {
      navigate(path);
    }
  };

  const handleSave = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const sessionRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionRef, {
        question: question.trim(),
        updatedAt: new Date(),
      });

      setOriginalQuestion(question);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating session:", err);
      setError("Failed to update session");
    } finally {
      setSaving(false);
    }
  };

  // Debug log
  console.log("Session ID:", sessionId);
  console.log("Loading:", loading);
  console.log("User:", user);

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

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between h-16 items-center'>
            <div className='flex items-center'>
              <button
                onClick={() => handleNavigation("/dashboard")}
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
                Edit Session
              </span>
            </div>

            {/* User Profile Section */}
            {/* ... (keep existing user profile section) ... */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex flex-col items-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            Edit Question
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

          <div className='flex gap-4 w-full mt-6'>
            <button
              onClick={() => handleNavigation("/dashboard")}
              className='flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className={`flex-1 py-3 px-4 bg-[#1a2b3b] text-white rounded-lg transition-colors
                ${
                  saving || !hasUnsavedChanges
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#2c3e50]"
                }`}
            >
              {saving ? (
                <div className='flex items-center justify-center'>
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
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Unsaved Changes Dialog */}
      {showConfirmDialog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm mx-4'>
            <h3 className='text-xl font-medium text-gray-900 mb-4'>
              Unsaved Changes
            </h3>
            <p className='text-gray-500 mb-6'>
              You have unsaved changes. Are you sure you want to leave?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  navigate(navigationPath);
                }}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSession;
