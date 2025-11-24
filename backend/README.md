# GJ Camp Website - Backend

Backend API Node.js + Express pour le site de la jeunesse de l'église.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gj-camp
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Démarrage en mode développement

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:5000`

## Endpoints

### Authentification

- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Récupérer le profil (protégé)
- `PUT /api/auth/profile` - Mettre à jour le profil (protégé)

## Structure

- `src/models/` - Schémas Mongoose
- `src/controllers/` - Logique métier
- `src/routes/` - Définition des routes
- `src/middleware/` - Middlewares (authentification, etc.)
- `src/config/` - Configuration (DB, etc.)
