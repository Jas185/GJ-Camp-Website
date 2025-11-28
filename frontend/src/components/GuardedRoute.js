import React, { useContext, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const normalizeRole = (role) => {
  if (!role) return 'utilisateur';
  return role === 'user' ? 'utilisateur' : role;
};

const GuardedRoute = ({ element, roles = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  const normalizedRole = useMemo(() => normalizeRole(user?.role), [user?.role]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message: 'Veuillez vous connecter pour continuer.' }}
      />
    );
  }

  if (roles.length > 0 && !roles.includes(normalizedRole)) {
    return (
      <Navigate
        to="/acces-refuse"
        replace
        state={{ from: location.pathname, required: roles }}
      />
    );
  }

  return element;
};

export default GuardedRoute;
