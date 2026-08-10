import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(email, password);
        toast.success('Login successful!');
        onClose();
      } else {
        // Register
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(email, password);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already registered');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slide-up border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <h2 className="text-lg font-bold text-neutral-800">
            {isLogin ? 'Log in to CatchMyBus' : 'Create an Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors min-h-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
              <Mail className="h-3.5 w-3.5 inline mr-1 opacity-70" />
              Email address
            </label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
              <Lock className="h-3.5 w-3.5 inline mr-1 opacity-70" />
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                <Lock className="h-3.5 w-3.5 inline mr-1 opacity-70" />
                Confirm password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-amber w-full justify-center text-sm font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all min-h-[44px]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-navy-800 border-t-transparent"></div>
              ) : (
                <>
                  <UserIcon className="h-4 w-4" />
                  <span>{isLogin ? 'Log in' : 'Create Account'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch Mode */}
        <div className="px-6 pb-6 text-center border-t border-neutral-100 pt-4 bg-neutral-50/50">
          <p className="text-xs text-neutral-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-navy-800 font-semibold hover:text-amber-500 transition-colors ml-1 inline min-h-0"
            >
              {isLogin ? 'Create one' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
