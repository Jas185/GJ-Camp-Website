# GJ-Camp-Website

Site web pour la jeunesse de l'église - Génération Josué

## 🚀 Démarrage rapide en local

### Prérequis

- **Node.js** (v16+) - [Télécharger](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Git** - [Télécharger](https://git-scm.com/)

### Installation et démarrage

#### 1️⃣ Cloner le repository

```bash
git clone https://github.com/Jas185/GJ-Camp-Website.git
cd GJ-Camp-Website
```

#### 2️⃣ Démarrer le Backend (API)

Ouvrez un terminal PowerShell:

```bash
cd backend
npm install
npm run dev
```

Le serveur backend démarrera sur **`http://localhost:5000`**

#### 3️⃣ Démarrer le Frontend (React)

Ouvrez un **nouveau terminal** PowerShell:

```bash
cd frontend
npm install
npm start
```

Le site sera accessible sur **`http://localhost:3000`**

---

## 📋 Configuration

### Variables d'environnement Backend

Créez un fichier `.env` dans le dossier `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gj-camp
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 📁 Structure du projet

```
GJ-Camp-Website/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration DB
│   │   ├── controllers/    # Logique métier
│   │   ├── models/         # Schémas Mongoose
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares
│   │   └── server.js       # Serveur principal
│   └── package.json
│
├── frontend/                # Application React
│   ├── src/
│   │   ├── components/     # Header, Footer, Carousel
│   │   ├── pages/          # HomePage, LoginPage, SignupPage
│   │   ├── context/        # Gestion authentification
│   │   ├── styles/         # CSS
│   │   └── App.js          # Composant principal
│   ├── public/
│   │   ├── logo.jpeg       # Logo GJ
│   │   └── images/         # Images du carousel
│   └── package.json
│
├── SETUP.md                # Guide d'installation détaillé
├── STRUCTURE.md            # Documentation structure
└── README.md               # Ce fichier
```

---

## 🎨 Design

### Couleurs principales

- **Rouge:** `#a01e1e` (fond principal)
- **Or:** `#d4af37` (header)
- **Bleu marine:** `#001a4d` (footer)
- **Blanc:** `#ffffff`

### Pages principales

- 🏠 **Accueil** - Carousel avec images du camp
- 🔐 **Connexion** - Page de login
- ✍️ **Inscription** - Page de signup
- 📋 **Profil** - Gestion du compte utilisateur

---

## 🔧 Commandes utiles

### Backend

```bash
cd backend

# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm start
```

### Frontend

```bash
cd frontend

# Installation des dépendances
npm install

# Démarrage en mode développement
npm start

# Build pour production
npm run build
```

---

## 🔐 Authentification

### Endpoints API

#### Inscription
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "password": "password123",
  "churchWebsite": "https://example.com"
}
```

#### Connexion
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "password123"
}
```

#### Récupérer le profil
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifiez que le port 5000 est disponible
# Vérifiez les variables d'environnement dans .env
# Vérifiez que Node.js est installé
node --version
```

### Le frontend ne se connecte pas au backend

```bash
# Vérifiez que le backend est en cours d'exécution sur le port 5000
# Vérifiez que CORS est activé dans backend/src/server.js
# Vérifiez que le proxy est configuré dans frontend/package.json
```

### Les images du carousel ne s'affichent pas

```bash
# Vérifiez que les images existent dans frontend/public/images/
# Vérifiez les chemins dans frontend/src/components/Carousel.js
```

---

## 📦 Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données (optionnel)
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hashage de mots de passe

### Frontend
- **React** - Bibliothèque UI
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Font Awesome** - Icônes

---

## 📞 Support

Pour toute question:
- Consultez `SETUP.md` pour un guide détaillé
- Consultez `STRUCTURE.md` pour la documentation technique
- Ouvrez une issue sur GitHub

---

## 📝 Licence

Tous droits réservés. Génération Josué

---

**Bon développement! 🚀**