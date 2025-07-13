// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Re-check token if storage changes
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    // Check for token changes on mount and focus
    const checkToken = () => {
      setToken(localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkToken);
    
    // Also check token periodically
    const interval = setInterval(checkToken, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkToken);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsMenuOpen(false); // Close mobile menu on logout
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex-shrink-0">
          <Link 
            to={token ? "/notes" : "/login"} 
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition-all duration-300"
          >
            📚 NoteKeeper
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {token ? (
            <>
              <NavLink 
                to="/notes" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
              </NavLink>
              
              <NavLink 
                to="/bookmarks" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Bookmarks
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </NavLink>
              
              <NavLink 
                to="/register" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Right side - Logout and Mobile Menu */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {token && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-800/50">
          <div className="flex flex-col gap-2 mt-4">
            {token ? (
              <>
                <NavLink 
                  to="/notes" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Notes
                </NavLink>
                
                <NavLink 
                  to="/bookmarks" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-purple-500/20 text-purple-400" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Bookmarks
                </NavLink>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-green-500/20 text-green-400" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </NavLink>
                
                <NavLink 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;