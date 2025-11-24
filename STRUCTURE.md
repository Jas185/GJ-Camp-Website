# 📁 Structure du Projet GJ Camp Website

## Architecture complète du projet

```
GJ-Camp-Website/
│
├── 📂 backend/                          # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Configuration MongoDB
│   │   ├── controllers/
│   │   │   └── authController.js       # Logique authentification
│   │   ├── middleware/
│   │   │   └── auth.js                 # Middleware JWT
│   │   ├── models/
│   │   │   └── User.js                 # Schéma utilisateur Mongoose
│   │   ├── routes/
│   │   │   └── authRoutes.js           # Routes authentification
│   │   └── server.js                   # Serveur principal
│   ├── package.json
│   ├── .env                            # Variables d'environnement
│   └── .gitignore
│
├── 📂 frontend/                         # Application React
│   ├── public/
│   │   ├── index.html                  # HTML principal
│   │   ├── logo.jpeg                   # Logo GJ
│   │   └── images/                     # Dossier images
│   │       ├── IMG_1263.jpg            # Carousel image 1
│   │       ├── IMG_1272.jpg            # Carousel image 2
│   │       ├── IMG_1278.jpg            # Carousel image 3
│   │       ├── _DSC9308.jpg            # Carousel image 4
│   │       ├── _DSC9762.jpg            # Carousel image 5
│   │       └── ...autres images
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js               # Barre de navigation
│   │   │   ├── Footer.js               # Pied de page
│   │   │   └── Carousel.js             # Carousel principal
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.js             # Accueil
│   │   │   ├── LoginPage.js            # Connexion
│   │   │   └── SignupPage.js           # Inscription
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js          # Gestion authentification
│   │   │
│   │   ├── styles/
│   │   │   └── App.css                 # Styles principaux
│   │   │
│   │   ├── App.js                      # Composant principal
│   │   └── index.js                    # Point d'entrée
│   │
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
├── 📂 my-web-page/                     # Page web statique (optionnel)
│   ├── src/
│   │   ├── index.html
│   │   ├── styles/
│   │   └── scripts/
│   └── README.md
│
├── SETUP.md                            # Guide d'installation
├── STRUCTURE.md                        # Cette documentation
└── README.md                           # Fichier principal
```

## 🎨 Couleurs du design

```css
--color-red: #a01e1e        /* Rouge principal */
--color-gold: #d4af37       /* Or (header) */
--color-dark-blue: #001a4d  /* Bleu marine (footer) */
--color-white: #ffffff      /* Blanc */
```

## 📊 Chemins des ressources dans le code React

### Logo
```javascript
<img src="/logo.jpeg" alt="Logo GJ" />
```

### Images du Carousel
```javascript
'/images/IMG_1263.jpg'
'/images/IMG_1272.jpg'
'/images/IMG_1278.jpg'
'/images/_DSC9308.jpg'
'/images/_DSC9762.jpg'
```

## 🔧 Points d'entrée

### Backend
- **Port:** 5000
- **Fichier principal:** `backend/src/server.js`
- **Commande de démarrage:** `npm run dev`

### Frontend
- **Port:** 3000
- **Fichier principal:** `frontend/src/App.js`
- **Commande de démarrage:** `npm start`

## 📝 Variables d'environnement

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gj-camp
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🔗 API Endpoints

### Authentification
```
POST   /api/auth/signup      # Inscription
POST   /api/auth/login       # Connexion
GET    /api/auth/me          # Profil (protégé)
PUT    /api/auth/profile     # Mise à jour (protégé)
```

## 📦 Dépendances principales

### Backend
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `bcryptjs` - Sécurité mots de passe
- `jsonwebtoken` - Authentification JWT
- `cors` - CORS
- `dotenv` - Variables d'env

### Frontend
- `react` - UI
- `react-router-dom` - Routage
- `axios` - Client HTTP

## 🚀 Commandes utiles

```bash
# Backend
cd backend
npm install          # Installation
npm run dev          # Démarrage dev
npm start            # Démarrage production

# Frontend
cd frontend
npm install          # Installation
npm start            # Démarrage dev
npm run build        # Build production
```

## 📁 Nettoyage du projet

Les dossiers à ignorer dans Git:
- `node_modules/` - Dépendances npm
- `.env` - Variables sensibles
- `build/` - Build production
- `dist/` - Distribution

## ✅ Checklist pour ajouter du contenu

- [ ] Placer les images dans `frontend/public/images/`
- [ ] Mettre à jour les chemins dans les composants
- [ ] Ajouter les icônes réseaux sociaux dans `public/`
- [ ] Configurer les variables `.env`
- [ ] Tester l'application en développement
- [ ] Build pour production

---

**Bon développement! 🚀**
