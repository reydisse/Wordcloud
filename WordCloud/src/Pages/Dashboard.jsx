import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth } from "../config/firebase";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Add recentSessions state
  const [recentSessions] = useState([
    {
      title: "Q1 Sales Presentation",
      createdOn: "Jan 15, 2025",
      code: "XYZ123",
    },
    {
      title: "Product Launch 2025",
      createdOn: "Jan 10, 2025",
      code: "ABC789",
    },
    {
      title: "Team Updates",
      createdOn: "Jan 5, 2025",
      code: "DEF456",
    },
  ]);

  // Handle user authentication state
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

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreateSession = () => {
    navigate("/dashboard/session-setup");
  };
  return (
    <div className='min-h-screen bg-gray-50'>
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
            onClick={handleCreateSession}
            className='bg-[#1a2b3b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2c3e50] transition-colors'
          >
            <span className='text-lg'>+</span>
            Create New Session
          </button>
        </div>

        {/* Recent Sessions List */}
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Recent Sessions
          </h2>
          <div className='space-y-4'>
            {recentSessions.map((session, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-sm p-4 flex items-center justify-between'
              >
                <div>
                  <h3 className='text-lg font-medium text-gray-900'>
                    {session.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Created on {session.createdOn}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-sm text-gray-500'>
                    CODE: {session.code}
                  </span>
                  <button className='p-2 text-gray-500 hover:text-gray-700'>
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
                        d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                      />
                    </svg>
                  </button>
                  <button className='p-2 text-gray-500 hover:text-gray-700'>
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
                  <button className='bg-[#1a2b3b] text-white px-4 py-2 rounded-lg hover:bg-[#2c3e50] transition-colors'>
                    Resume Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
