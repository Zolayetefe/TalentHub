import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200">
          TalentHub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link
            to="/jobs"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Jobs
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            Register
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-900 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col space-y-4">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              onClick={toggleMenu}
            >
              Jobs
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 text-center"
              onClick={toggleMenu}
            >
              Register
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;