require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connexion à la base de données
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/users', userRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: '✅ Backend fonctionnaire' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
