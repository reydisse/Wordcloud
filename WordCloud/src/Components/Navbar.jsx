import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Product", href: "/#product" },
  { name: "Solutions", href: "/#solutions" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Resources", href: "/#resources" },
  { name: "Enterprise", href: "/#enterprise" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='fixed w-full bg-white shadow-sm z-50'>
      <nav
        className='mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8'
        aria-label='Global'
      >
        <div className='flex lg:flex-1 items-center'>
          <Link to='/' className='-m-1.5 p-1.5 flex items-center gap-2'>
            <PresentationChartBarIcon className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-blue-600'>Presento</span>
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            ) : (
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            )}
          </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600'
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:items-center'>
          <Link
            to='/auth'
            className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 mr-4'
          >
            Log in
          </Link>
          <Link
            to='/auth'
            className='rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors'
          >
            Get Started Free
          </Link>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='lg:hidden'>
          <div className='fixed inset-0 z-50' />
          <div className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
            <div className='flex items-center justify-between'>
              <Link to='/' className='-m-1.5 p-1.5 flex items-center gap-2'>
                <PresentationChartBarIcon className='h-8 w-8 text-blue-600' />
                <span className='text-2xl font-bold text-blue-600'>
                  Presento
                </span>
              </Link>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-gray-700'
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/10'>
                <div className='space-y-2 py-6'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className='py-6'>
                  <Link
                    to='/auth'
                    className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                  >
                    Log in
                  </Link>
                  <Link
                    to='/auth'
                    className='mt-2 -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-blue-600 hover:bg-blue-500'
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
