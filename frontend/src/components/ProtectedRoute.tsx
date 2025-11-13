import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (requireAdmin && currentUser && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
    } else if (requireAdmin && !currentUser) {
      toast.error('Please login to access this page');
    }
  }, [currentUser, isAdmin, requireAdmin]);

  // If route requires admin but user is not admin
  if (requireAdmin && (!currentUser || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  // If route requires authentication but user is not logged in
  if (!requireAdmin && !currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
