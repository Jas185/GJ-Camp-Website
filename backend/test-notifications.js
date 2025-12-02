require('dotenv').config();
const mongoose = require('mongoose');
const { notifyNewPost, sendEmailNotification } = require('./src/services/notificationService');

// Test du système de notifications
async function testNotifications() {
  try {
    console.log('🧪 Début des tests de notifications...\n');

    // Connexion à MongoDB
    console.log('📦 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Créer un post de test
    const testPost = {
      _id: 'test-post-id',
      author: {
        _id: 'test-author-id',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com'
      },
      text: 'Ceci est un post de test pour vérifier que les notifications fonctionnent correctement. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: null,
      createdAt: new Date()
    };

    console.log('📧 Test d\'envoi d\'email...\n');
    console.log('Post de test:');
    console.log(`  Auteur: ${testPost.author.firstName} ${testPost.author.lastName}`);
    console.log(`  Texte: ${testPost.text.substring(0, 50)}...`);
    console.log('');

    // Récupérer les utilisateurs avec notifications email activées
    const User = require('./src/models/User');
    const usersWithEmail = await User.find({ 
      emailNotifications: { $ne: false } 
    }).select('email firstName lastName emailNotifications').limit(5);

    if (usersWithEmail.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé avec notifications email activées');
      console.log('   Assurez-vous d\'avoir des utilisateurs dans la base de données\n');
      
      // Test avec un destinataire de test
      console.log('📧 Test avec un destinataire fictif...\n');
      const testRecipients = [{
        email: process.env.EMAIL_USER || 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }];
      
      const result = await sendEmailNotification(testPost, testRecipients);
      
      if (result.success) {
        console.log(`✅ Email de test envoyé avec succès à ${result.sent} destinataire(s)`);
        console.log(`   Vérifiez l'email: ${testRecipients[0].email}\n`);
      } else {
        console.log(`❌ Erreur lors de l'envoi: ${result.error}\n`);
      }
    } else {
      console.log(`📊 ${usersWithEmail.length} utilisateur(s) trouvé(s) avec email activé:\n`);
      usersWithEmail.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      });
      console.log('');

      // Envoyer uniquement aux 2 premiers pour le test
      const recipients = usersWithEmail.slice(0, 2);
      console.log(`📤 Envoi de l'email de test à ${recipients.length} destinataire(s)...\n`);

      const result = await sendEmailNotification(testPost, recipients);
      
      if (result.success) {
        console.log(`✅ Emails envoyés avec succès: ${result.sent}/${recipients.length}`);
        console.log('   Vérifiez les boîtes email des destinataires\n');
      } else {
        console.log(`❌ Erreur lors de l'envoi: ${result.error}\n`);
      }
    }

    console.log('📋 Résumé de la configuration:');
    console.log(`   Email service: ${process.env.EMAIL_SERVICE || 'Non configuré'}`);
    console.log(`   Email user: ${process.env.EMAIL_USER || 'Non configuré'}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'Non configuré'}`);
    console.log('');

    console.log('📱 Info SMS/Push:');
    console.log(`   SMS (Twilio): ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configuré' : '⚠️  Non configuré'}`);
    console.log(`   Push (OneSignal): ${process.env.ONESIGNAL_APP_ID ? '✅ Configuré' : '⚠️  Non configuré'}`);
    console.log('');

    console.log('✅ Test terminé avec succès!');
    console.log('\n💡 Pour tester en conditions réelles:');
    console.log('   1. Créez un nouveau post via l\'interface');
    console.log('   2. Les notifications seront envoyées automatiquement');
    console.log('   3. Vérifiez les logs du serveur pour le statut d\'envoi\n');

  } catch (error) {
    console.error('\n❌ Erreur pendant le test:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Lancer le test
testNotifications();
