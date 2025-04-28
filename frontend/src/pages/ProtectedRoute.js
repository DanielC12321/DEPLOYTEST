import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes based on authentication and role
const ProtectedRoute = ({ children, requiredRole }) => {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  
  // If user is not authenticated, redirect to login
  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to an appropriate page
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    switch (userRole) {
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'cashier':
        return <Navigate to="/cashier" replace />;
      default:
        return <Navigate to="/customer" replace />;
    }
  }
  
  // User is authenticated and has the required role (or no specific role was required)
  return children;
};

export default ProtectedRoute;