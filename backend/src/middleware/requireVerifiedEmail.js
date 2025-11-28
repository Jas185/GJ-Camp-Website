module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  // L'accès n'est plus conditionné par la vérification de l'email.
  return next();
};
