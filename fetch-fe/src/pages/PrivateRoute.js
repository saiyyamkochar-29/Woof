import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ isAuthenticated, children }) {
  const location = useLocation();
  
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
}

export default PrivateRoute;
