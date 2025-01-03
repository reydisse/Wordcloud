import { Outlet, Link } from "react-router-dom";

function RootLayout() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between h-16'>
            <div className='flex space-x-4 items-center'>
              <Link to='/' className='text-gray-800 hover:text-gray-600'>
                Home
              </Link>
              <Link to='/about' className='text-gray-800 hover:text-gray-600'>
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className='max-w-7xl mx-auto px-4 py-6'>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
