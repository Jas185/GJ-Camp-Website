const REQUIRED_FIELDS = {
  referent: ['phoneNumber', 'ministryRole'],
  responsable: ['phoneNumber', 'ministryRole'],
  admin: ['phoneNumber'],
};

const formatField = (field) => {
  const labels = {
    phoneNumber: 'numéro de téléphone',
    ministryRole: 'rôle ministériel',
    bio: 'biographie',
  };
  return labels[field] || field;
};

module.exports = (options = {}) => {
  const { customFields = [] } = options;

  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    const role = req.user?.role || 'utilisateur';
    const expectedFields = new Set([...(REQUIRED_FIELDS[role] || []), ...customFields]);

    if (expectedFields.size === 0) {
      return next();
    }

    const missingFields = Array.from(expectedFields).filter((field) => {
      const value = req.currentUser[field];
      if (value === null || value === undefined) {
        return true;
      }
      if (typeof value === 'string') {
        return value.trim() === '';
      }
      return false;
    });

    if (missingFields.length > 0) {
      const readableMissing = missingFields.map(formatField).join(', ');
      return res.status(400).json({
        message: `Complétez votre profil avant de continuer : ${readableMissing}`,
      });
    }

    return next();
  };
};
