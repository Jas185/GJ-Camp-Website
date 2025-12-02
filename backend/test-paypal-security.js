const mongoose = require('mongoose');
require('dotenv').config();
const TransactionLog = require('./src/models/TransactionLog');
const paypalService = require('./src/services/paypalService');

console.log('🧪 Test de la Configuration Sécurité PayPal\n');

async function testPayPalSecurity() {
  try {
    // Connexion MongoDB
    console.log('📡 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Test 1: Vérifier la configuration
    console.log('=== TEST 1: Configuration PayPal ===');
    console.log('Client ID:', process.env.PAYPAL_CLIENT_ID ? '✅ Configuré' : '❌ Manquant');
    console.log('Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? '✅ Configuré' : '⚠️ Mode dégradé activé');
    console.log('Environnement:', process.env.NODE_ENV || 'development');
    console.log('URL API:', paypalService.baseURL);
    console.log('');

    // Test 2: Vérifier le modèle TransactionLog
    console.log('=== TEST 2: Modèle TransactionLog ===');
    const transactionCount = await TransactionLog.countDocuments();
    console.log(`✅ Modèle TransactionLog accessible`);
    console.log(`📊 Nombre de transactions loggées: ${transactionCount}`);
    console.log('');

    // Test 3: Afficher les dernières transactions
    if (transactionCount > 0) {
      console.log('=== TEST 3: Dernières Transactions ===');
      const recentTransactions = await TransactionLog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderID amount status payerEmail createdAt isDevelopmentMode');
      
      recentTransactions.forEach((t, i) => {
        console.log(`${i + 1}. Order ${t.orderID}`);
        console.log(`   Montant: ${t.amount}€ | Statut: ${t.status}`);
        console.log(`   Email: ${t.payerEmail} | Date: ${t.createdAt.toLocaleString('fr-FR')}`);
        console.log(`   Mode Dev: ${t.isDevelopmentMode ? 'Oui' : 'Non'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Aucune transaction loggée pour le moment\n');
    }

    // Test 4: Tester l'obtention du token (si secret configuré)
    if (process.env.PAYPAL_CLIENT_SECRET) {
      console.log('=== TEST 4: Connexion API PayPal ===');
      try {
        const token = await paypalService.getAccessToken();
        console.log('✅ Token PayPal obtenu avec succès');
        console.log(`Token (début): ${token.substring(0, 20)}...`);
      } catch (error) {
        console.log('❌ Erreur obtention token:', error.message);
        console.log('⚠️ Vérifiez vos credentials PayPal dans .env');
      }
    } else {
      console.log('=== TEST 4: Connexion API PayPal ===');
      console.log('⚠️ PAYPAL_CLIENT_SECRET manquant - Test ignoré');
      console.log('ℹ️ Le mode dégradé acceptera toutes les transactions (DEV UNIQUEMENT)');
    }

    console.log('\n✅ Tests terminés avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Obtenir le Client Secret: https://developer.paypal.com/dashboard/');
    console.log('2. Ajouter PAYPAL_CLIENT_SECRET dans backend/.env');
    console.log('3. Redémarrer le serveur backend');
    console.log('4. Tester une inscription avec paiement PayPal');
    console.log('5. Vérifier que la transaction est loggée dans MongoDB');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

testPayPalSecurity();
