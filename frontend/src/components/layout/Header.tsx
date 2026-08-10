import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogIn, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../LoginModal';
import toast from 'react-hot-toast';

const Header = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      toast.success('Signed out');
      navigate('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      {/* Slim sticky navbar — ~56px tall */}
      <header className="sticky top-0 z-50 h-14 bg-navy-800 border-b border-navy-900 shadow-sm">
        <nav className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group min-h-0"
            aria-label="CatchMyBus home"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded bg-amber-400 flex-shrink-0">
              <Bus className="w-4 h-4 text-navy-800" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base tracking-tight leading-none">
              CatchMyBus
            </span>
          </Link>

          {/* Right side auth controls */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              /* User menu */
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-lg hover:bg-white/10 transition-colors min-h-0"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar circle */}
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-navy-800 text-xs font-bold flex items-center justify-center flex-shrink-0 leading-none">
                    {currentUser.email?.[0].toUpperCase() ?? <User className="w-3 h-3" />}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium leading-none">
                    {currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    {/* Click-away backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-lg shadow-transit-md z-50 animate-fade-in py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 min-h-0"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                          Admin panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 min-h-0"
                      >
                        <LogOut className="w-4 h-4 text-neutral-400" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Log in button */
              <button
                id="login-button"
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-navy-800 text-sm font-semibold rounded-lg hover:bg-amber-300 active:bg-amber-500 transition-colors min-h-0"
                aria-label="Log in"
              >
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Header;
