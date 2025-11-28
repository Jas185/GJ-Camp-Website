const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé pour ce rôle' });
    }

    return next();
  };
};

module.exports = authorize;
