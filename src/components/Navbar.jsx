import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaHome, FaFileAlt, FaUser, FaBriefcase, FaBars, FaTimes } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/templates', icon: <FaFileAlt />, label: 'Templates' },
    { path: isLoggedIn ? '/dashboard' : '/login', icon: <FaBriefcase />, label: 'Dashboard' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 shadow-sm ${darkMode ? 'bg-gray-900 text-white border-gray-200' : 'bg-white text-black border-gray-200'}`}>
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <IoDocumentTextOutline className="text-2xl md:text-3xl text-blue-500 animate-pulse" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">ResumePro</h1>
              <p className="text-xs text-gray-500 hidden md:block">Build resumes that get noticed</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200"
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}

            {/* Login/Signup or Profile */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ml-2 transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-lg" />
              ) : (
                <FaMoon className="text-gray-700 text-lg" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 py-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex flex-col space-y-3 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="block py-3 text-center rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-3 bg-black dark:bg-white text-white dark:text-black text-center rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;