const Activity = require('../models/Activity');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: 1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Erreur getActivities:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createActivity = async (req, res) => {
  try {
    // only admin can create
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { title, summary, details, imagePath, time, location } = req.body;
    if (!title) return res.status(400).json({ message: 'Titre requis' });

    const activity = new Activity({ title, summary, details, imagePath, time, location });
    await activity.save();
    res.status(201).json({ message: 'Activité ajoutée', activity });
  } catch (error) {
    console.error('Erreur createActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) return res.status(404).json({ message: 'Activité introuvable' });

    await activity.remove();
    res.status(200).json({ message: 'Activité supprimée' });
  } catch (error) {
    console.error('Erreur deleteActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Return list of image filenames from frontend public assets folder
exports.listImages = async (req, res) => {
  try {
    // assume images are placed in frontend/public/assets/images
    const imagesDir = path.resolve(__dirname, '../../frontend/public/assets/images');
    if (!fs.existsSync(imagesDir)) return res.status(200).json([]);
    const files = fs.readdirSync(imagesDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    // return URLs relative to frontend host
    const urls = files.map(f => `/assets/images/${f}`);
    res.status(200).json(urls);
  } catch (error) {
    console.error('Erreur listImages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
