const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage pour activités (images + PDF)
const activityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'fichierPdf' ? 'pdf-' : 'activity-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrer les fichiers pour activités (images + PDF)
const activityFileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Validation pour images
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  } else if (file.fieldname === 'fichierPdf') {
    // Validation pour PDF
    const isPdf = file.mimetype === 'application/pdf';
    const extname = path.extname(file.originalname).toLowerCase() === '.pdf';
    
    if (isPdf && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
  } else {
    cb(new Error('Champ de fichier non reconnu'));
  }
};

// Configuration de multer pour activités
const activityUpload = multer({
  storage: activityStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB pour PDF
  },
  fileFilter: activityFileFilter
});

module.exports = activityUpload;
