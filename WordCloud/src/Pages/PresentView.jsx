// src/pages/PresentView.jsx
import { useNavigate } from "react-router-dom";

function PresentView() {
  const navigate = useNavigate();
  const sessionCode = "XKJ49P";
  const participants = 24;
  const replies = 158;

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Minimal Header */}
      <div className='flex justify-between items-center p-4 border-b border-gray-100'>
        <div className='flex items-center space-x-4'>
          {/* Menu Icon */}
          <button className='text-gray-600 hover:text-gray-900'>
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
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
          {/* Expand Icon */}
          <button className='text-gray-600 hover:text-gray-900'>
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
                d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
              />
            </svg>
          </button>
        </div>
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-600'>wordcloud.app</span>
          <span className='font-medium'>{sessionCode}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 p-8'>
        <div className='max-w-5xl mx-auto bg-gray-50 rounded-lg h-[calc(100vh-240px)] flex items-center justify-center'>
          <span className='text-gray-400'>Word Cloud Display Area</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='fixed bottom-0 left-0 right-0'>
        {/* Instructions Box - Repositioned and widened */}
        <div className='absolute bottom-16 left-8'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-[300px]'>
            <ol className='space-y-2 text-sm text-gray-600'>
              <li className='flex items-center space-x-2'>
                <span className='text-gray-400'>1.</span>
                <span>Go to wordcloud.app</span>
              </li>
              <li className='flex items-center space-x-2'>
                <span className='text-gray-400'>2.</span>
                <span>
                  Enter code: <span className='font-medium'>{sessionCode}</span>
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-white border-t border-gray-100'>
          <div className='px-8 py-4'>
            <div className='flex justify-between items-center text-sm'>
              {/* Connected Status - Left side */}
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-600'>Connected</span>
              </div>

              {/* Stats - Right side */}
              <div className='flex items-center space-x-6 text-gray-500'>
                <span>Participants: {participants}</span>
                <span>Replies: {replies}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresentView;
