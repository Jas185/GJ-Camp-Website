const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const User = require('./src/models/User');

// Interface pour lire l'entrée utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:GjCamp2025Mongo@localhost:27017/gj-camp?authSource=admin');
    console.log('✅ MongoDB connecté\n');

    // Demander les informations de l'admin
    const email = await question('📧 Email de l\'admin: ');
    const firstName = await question('👤 Prénom: ');
    const lastName = await question('👤 Nom: ');
    const password = await question('🔑 Mot de passe (min 8 caractères): ');

    if (password.length < 8) {
      console.log('❌ Le mot de passe doit contenir au moins 8 caractères');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      // Mettre à jour le rôle et le mot de passe
      existingUser.role = 'admin';
      existingUser.isEmailVerified = true;
      existingUser.password = password;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      await existingUser.save();
      console.log('\n✅ Utilisateur existant mis à jour en tant qu\'admin');
    } else {
      // Créer un nouvel utilisateur admin
      const adminUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        churchWebsite: 'https://gj-camp.fr',
        role: 'admin',
        isEmailVerified: true,
        dataProcessingConsent: true,
        dataProcessingConsentDate: new Date(),
        privacyPolicyAcceptedAt: new Date()
      });

      await adminUser.save();
      console.log('\n✅ Utilisateur admin créé avec succès');
    }

    console.log('📧 Email:', email);
    console.log('👤 Nom:', firstName, lastName);
    console.log('✅ Rôle: admin');

    rl.close();
    await mongoose.connection.close();
    console.log('\n✅ Terminé');
  } catch (error) {
    console.error('❌ Erreur:', error);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdminUser();
