const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Générer JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/signup
// @desc    Inscription d'un nouvel utilisateur
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, churchWebsite } = req.body;

    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      firstName,
      lastName,
      email,
      password,
      churchWebsite,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Rechercher l'utilisateur
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // Vérifier le mot de passe
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Récupérer le profil de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/auth/profile
// @desc    Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, churchWebsite } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, churchWebsite },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profil mis à jour',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
