import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className='text-center mt-20'>
      <h1 className='text-4xl font-bold text-gray-800'>404</h1>
      <p className='text-gray-600 mt-2'>Page not found</p>
      <Link
        to='/'
        className='text-blue-500 hover:text-blue-600 mt-4 inline-block'
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
