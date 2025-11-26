const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConnection() {
  console.log('🔍 Test de connexion SMTP Brevo...\n');
  
  console.log('Configuration:');
  console.log('- Host:', process.env.EMAIL_HOST);
  console.log('- Port:', process.env.EMAIL_PORT);
  console.log('- User:', process.env.EMAIL_USER);
  console.log('- Password:', process.env.EMAIL_PASSWORD ? '✅ Défini' : '❌ Non défini');
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log('⏳ Vérification de la connexion...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie !');
    console.log('✅ L\'adresse email expéditeur est autorisée.');
    
    // Test d'envoi d'email
    console.log('\n📨 Envoi d\'un email de test...');
    const info = await transporter.sendMail({
      from: `"GJ Camp Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Envoi à soi-même
      subject: 'Test de configuration email',
      text: 'Ceci est un email de test pour vérifier la configuration Brevo.',
      html: '<p>Ceci est un email de test pour vérifier la configuration Brevo.</p>',
    });
    
    console.log('✅ Email de test envoyé avec succès !');
    console.log('Message ID:', info.messageId);
    console.log('\n✅ Tout fonctionne correctement !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion SMTP:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Problème d\'authentification:');
      console.error('   - Vérifiez que votre clé API Brevo est correcte');
      console.error('   - Vérifiez que l\'adresse email est autorisée dans Brevo');
      console.error('   - Connectez-vous sur https://app.brevo.com/settings/keys/smtp');
    } else if (error.code === 'ESOCKET') {
      console.error('\n⚠️  Problème de connexion réseau:');
      console.error('   - Vérifiez votre connexion internet');
      console.error('   - Vérifiez que le port 587 n\'est pas bloqué par un firewall');
    } else {
      console.error('\n⚠️  Erreur détaillée:', error);
    }
  }
}

testEmailConnection();
