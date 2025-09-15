import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access login page
  if (!requireAuth && isAuthenticated()) {
    const defaultRoute = user?.role === 'owner' ? '/dashboard' : '/home';
    return <Navigate to={defaultRoute} replace />;
  }

  // If specific roles are required, check if user has the required role
  if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    const userRole = user?.role;
    const redirectPath = userRole === 'owner' ? '/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;