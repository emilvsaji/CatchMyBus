import { Link } from 'react-router-dom';
import { Bus, Heart, Info, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link
              to="/admin"
              className="flex items-center space-x-1 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 font-medium transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin</span>
            </Link>
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
            <Link
              to="/admin"
              className="flex items-center space-x-2 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
