import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SessionSetup() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleStartSession = () => {
    // Here you would handle starting the session
    navigate("/dashboard/session/new");
    // For now, we'll just log the question
    // console.log("Starting session with question:", question);
    // You can add navigation to the session page here
  };

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
                {/* <span className='ml-2 text-sm font-medium'>Back</span> */}
              </button>
              <span className='ml-4 text-xl font-medium text-gray-900'>
                Session Setup
              </span>
            </div>

            <div className='flex items-center space-x-4'>
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
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
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

      {/* Main Content */}
      <main className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex flex-col items-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            What&apos;s your question?
          </h1>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Type your question here...'
            className='w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          />

          <button
            onClick={handleStartSession}
            className='w-full mt-6 bg-[#1a2b3b] text-white py-3 rounded-lg hover:bg-[#2c3e50] transition-colors'
          >
            Start Session
          </button>
        </div>
      </main>
    </div>
  );
}

export default SessionSetup;
