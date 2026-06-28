import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="navbar-stripe" />
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* Logo + Name */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Sri Vari Traders Logo"
                className="h-11 w-auto object-contain"
              />
              <div>
                <p className="font-bold text-gray-900 leading-tight text-base"
                  style={{ fontFamily: 'Georgia, serif' }}>
                  Sri Vari Traders
                </p>
                <p className="text-xs text-gray-500">Receivable Tracker</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-green-700 font-medium transition-colors">
                Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
              <Link to="/" className="block px-2 py-2 text-gray-700 hover:text-green-700"
                onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;