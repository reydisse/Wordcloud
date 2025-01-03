// src/pages/SessionView.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SessionView() {
  const navigate = useNavigate();
  const [participants] = useState(247);
  const [responses] = useState(1893);
  const sessionCode = "XK439P";

  const handlePresent = () => {
    navigate(`/dashboard/session/${sessionCode}/present`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm'>
        <div className='w-full px-6'>
          <div className='flex justify-between h-16 items-center'>
            {/* Left side - pushed to far left */}
            <div className='flex items-center'>
              <span className='text-xl font-medium text-gray-900'>
                WordCloud Presenter
              </span>
            </div>

            {/* Right side - pushed to far right */}
            <div className='flex items-center space-x-6'>
              <span className='text-sm text-gray-600'>go to xyz.com</span>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-600'>Session Code:</span>
                <span className='font-medium'>{sessionCode}</span>
              </div>
              <button className='text-gray-700 hover:text-gray-900'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                </svg>
              </button>
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
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className='fixed left-0 top-16 w-48 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col'>
        {/* Stats Box */}
        <div className='p-4'>
          <div className='border border-gray-200 rounded-lg p-4 mb-4'>
            <div className='mb-4'>
              <h2 className='text-sm text-gray-600'>Participants</h2>
              <p className='text-2xl font-bold text-gray-900'>{participants}</p>
            </div>
            <div>
              <h2 className='text-sm text-gray-600'>Responses</h2>
              <p className='text-2xl font-bold text-gray-900'>{responses}</p>
            </div>
          </div>
        </div>

        {/* End Session Button - pushed to bottom */}
        <div className='mt-auto p-4'>
          <button
            onClick={() => {
              /* Handle end session */
            }}
            className='w-full py-2 px-4 bg-[#1a2b3b] text-white rounded-lg hover:bg-[#2c3e50] transition-colors'
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='ml-48 p-6'>
        <div className='flex justify-end mb-4'>
          <button
            onClick={handlePresent}
            className='bg-[#1a2b3b] text-white px-4 py-2 rounded-lg hover:bg-[#2c3e50] transition-colors'
          >
            Present
          </button>
        </div>
        <div className='bg-white rounded-lg shadow-sm p-8 min-h-[400px] flex items-center justify-center'>
          <div className='text-center space-y-4'>
            <p className='text-2xl text-gray-400'>Technology</p>
            <p className='text-5xl font-bold'>Innovation</p>
            <p className='text-xl text-gray-400'>Digital</p>
            <p className='text-lg text-gray-400'>Transform</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionView;
