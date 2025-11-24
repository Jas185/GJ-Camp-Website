# GJ Camp Website - Guide d'Installation et Démarrage

## 📁 Structure du projet

```
GJ-Camp-Website/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuration BD
│   │   ├── controllers/ # Logique métier
│   │   ├── models/      # Schémas Mongoose
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middlewares
│   │   └── server.js    # Serveur principal
│   ├── package.json
│   └── .env
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages principales
│   │   ├── context/     # Contexte Auth
│   │   ├── styles/      # CSS
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Guide d'Installation

### Prérequis

- **Node.js** (v16+)
- **npm** ou **yarn**
- **MongoDB** (local ou Atlas)

### Étape 1: Installation du Backend

```bash
# Allez dans le dossier backend
cd backend

# Installez les dépendances
npm install

# Configurez les variables d'environnement
# Créez un fichier .env avec:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gj-camp
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Démarrez le serveur
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### Étape 2: Installation du Frontend

```bash
# Ouvrez un nouveau terminal et allez dans le dossier frontend
cd frontend

# Installez les dépendances
npm install

# Démarrez l'application React
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## 📝 Configuration MongoDB

### Option 1: MongoDB Local
```bash
# Installation sur Windows (avec Chocolatey)
choco install mongodb

# Ou téléchargez depuis: https://www.mongodb.com/try/download/community
```

### Option 2: MongoDB Atlas (Cloud)
1. Créez un compte sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster
3. Copiez la connection string
4. Remplacez dans `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gj-camp
```

## 🔌 Endpoints API

### Authentification

#### Inscription
```bash
POST /api/auth/signup
Body: {
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "churchWebsite": "https://example.com"
}
```

#### Connexion
```bash
POST /api/auth/login
Body: {
  "email": "jean@example.com",
  "password": "password123"
}
```

#### Récupérer le profil (nécessite un token)
```bash
GET /api/auth/me
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

#### Mettre à jour le profil (nécessite un token)
```bash
PUT /api/auth/profile
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body: {
  "firstName": "Jean",
  "lastName": "Dupont",
  "churchWebsite": "https://example.com"
}
```

## 🎨 Design et Couleurs

Les couleurs principales sont définies dans `frontend/src/styles/App.css`:

```css
--color-red: #a01e1e       /* Rouge principal */
--color-gold: #d4af37      /* Or (header) */
--color-dark-blue: #001a4d /* Bleu marine (footer) */
--color-white: #ffffff     /* Blanc */
```

## 📱 Fonctionnalités Implémentées

✅ **Authentification JWT**
- Inscription et connexion
- Protection des routes
- Stockage du token localStorage

✅ **Gestion d'utilisateurs**
- Profil utilisateur
- Mise à jour du profil
- Validation des données

✅ **Responsive Design**
- Mobile, tablette, desktop
- Menu responsive
- Carousel automatique

✅ **Interface Utilisateur**
- Header avec navigation
- Carousel de héros
- Footer avec réseaux sociaux
- Formulaires de login/signup

## 🔐 Sécurité

- Mots de passe hashés avec bcryptjs
- Authentification JWT
- Validation des emails
- CORS configuré
- Variables sensibles en .env

## 📦 Dépendances principales

### Backend
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `bcryptjs` - Hashage de mots de passe
- `jsonwebtoken` - Génération de tokens JWT
- `cors` - Gestion des origines croisées
- `dotenv` - Variables d'environnement

### Frontend
- `react` - Bibliothèque UI
- `react-router-dom` - Routage
- `axios` - Client HTTP

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifiez que MongoDB est en cours d'exécution
# Vérifiez les variables .env
# Vérifiez que le port 5000 est disponible
```

### Le frontend ne se connecte pas au backend
```bash
# Vérifiez que le proxy est configuré dans package.json
# Vérifiez que CORS est activé
# Vérifiez les ports (frontend: 3000, backend: 5000)
```

## 📞 Support

Pour toute question, consultez les README dans les dossiers `backend/` et `frontend/`

---

**Bon développement! 🚀**
