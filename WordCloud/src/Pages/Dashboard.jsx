import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Add the copy button animation styles
const copyButtonStyles = `
  @keyframes scaleCheck {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .copy-success {
    animation: scaleCheck 0.3s ease-in-out;
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Session states
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [deleteSessionId, setDeleteSessionId] = useState(null);
  const [copiedCodes, setCopiedCodes] = useState({});
  const SESSIONS_PER_PAGE = 10;

  // Authentication effect
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

  // Fetch initial sessions
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes({ ...copiedCodes, [code]: true });
      setTimeout(() => {
        setCopiedCodes((prev) => ({ ...prev, [code]: false }));
      }, 5000); // Reset after 5 seconds
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const fetchSessions = async (isLoadingMore = false) => {
    if (loading || (!isLoadingMore && !user)) return;

    setLoading(true);
    setError(null);

    try {
      let sessionsQuery = query(
        collection(db, "sessions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(SESSIONS_PER_PAGE)
      );

      if (isLoadingMore && lastVisible) {
        sessionsQuery = query(
          collection(db, "sessions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(SESSIONS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(sessionsQuery);

      const sessionDocs = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          question: docData.question,
          code: docData.code,
          createdAt: docData.createdAt?.toDate() || new Date(),
          responses: docData.responses || 0,
          isActive: docData.isActive || false,
        };
      });

      if (!isLoadingMore) {
        setSessions(sessionDocs);
      } else {
        setSessions((prev) => [...prev, ...sessionDocs]);
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === SESSIONS_PER_PAGE);
    } catch (err) {
      console.error("Detailed error fetching sessions:", err);
      setError("Failed to load sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      setDeleteSessionId(null);
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session");
    }
  };

  const handleEdit = (sessionId) => {
    navigate(`/dashboard/session-setup/${sessionId}/edit`);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <style>{copyButtonStyles}</style>

      {/* Navbar */}
      <nav className='bg-white shadow-sm'>
        <div className='w-full px-6'>
          <div className='flex justify-between h-16 items-center'>
            <div className='flex items-center'>
              <span className='text-xl font-medium text-gray-900'>
                WordCloud Presenter
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
                  />
                ) : user ? (
                  <div className='w-8 h-8 bg-[#1a2b3b] rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-medium'>
                      {user.displayName
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Create New Session Button */}
        <div className='flex justify-center mb-8'>
          <button
            onClick={() => navigate("/dashboard/session-setup")}
            className='bg-[#1a2b3b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2c3e50] transition-colors'
          >
            <span className='text-lg'>+</span>
            Create New Session
          </button>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Recent Sessions
          </h2>

          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            {sessions.map((session) => (
              <div
                key={session.id}
                className='bg-white rounded-lg shadow-sm p-4'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {session.question}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Created on {formatDate(session.createdAt)}
                    </p>
                  </div>

                  {/* Gray background section for code and buttons */}
                  <div className='flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg'>
                    <div className='flex items-center'>
                      <span className='text-sm text-gray-500'>
                        CODE: {session.code}
                      </span>
                    </div>

                    {/* Copy Button with Animation */}
                    <button
                      onClick={() => handleCopy(session.code)}
                      className='text-gray-500 hover:text-gray-700 transition-colors relative'
                      title={
                        copiedCodes[session.code] ? "Copied!" : "Copy Code"
                      }
                    >
                      {copiedCodes[session.code] ? (
                        <svg
                          className='w-5 h-5 text-green-500 transition-all duration-300 copy-success'
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
                      ) : (
                        <svg
                          className='w-5 h-5 transition-all duration-300'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                          />
                        </svg>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(session.id)}
                      className='text-gray-500 hover:text-gray-700 transition-colors'
                      title='Edit Session'
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
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteSessionId(session.id)}
                      className='text-gray-500 hover:text-gray-700 transition-colors'
                      title='Delete Session'
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
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>

                    {/* Resume Button */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/session/${session.id}`)
                      }
                      className='bg-[#1a2b3b] text-white px-4 py-2 rounded-lg hover:bg-[#2c3e50] transition-colors'
                    >
                      Resume Session
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-center py-4'>
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
              </div>
            )}

            {!loading && hasMore && sessions.length > 0 && (
              <div className='flex justify-center pt-4'>
                <button
                  onClick={() => fetchSessions(true)}
                  className='text-gray-600 hover:text-gray-900 text-sm font-medium'
                >
                  Load More Sessions
                </button>
              </div>
            )}

            {!loading && sessions.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                No sessions found. Create your first session!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteSessionId && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm mx-4'>
            <h3 className='text-xl font-medium text-gray-900 mb-4'>
              Delete Session
            </h3>
            <p className='text-gray-500 mb-6'>
              Are you sure you want to delete this session? This action cannot
              be undone.
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setDeleteSessionId(null)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteSessionId)}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
