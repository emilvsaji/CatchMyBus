import { Link, useNavigate } from 'react-router-dom';
import { Bus, Heart, Info, LayoutDashboard, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../LoginModal';
import toast from 'react-hot-toast';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CatchMyBus</h1>
              <p className="text-xs text-gray-500">Kerala Transport</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            
            {/* Show Admin link only for admin users */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 font-medium transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Auth buttons */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-slide-up">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>

            {/* Admin link for admin users only */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Auth buttons */}
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors w-full"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        )}

        {/* Login Modal */}
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </nav>
    </header>
  );
};

export default Header;
