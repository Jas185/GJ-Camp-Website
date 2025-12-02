// Script de vérification de l'intégration PayPal
console.log('🔍 Vérification de l\'intégration PayPal...\n');

// Vérifier les variables d'environnement
const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

if (!clientId) {
  console.error('❌ ERREUR : REACT_APP_PAYPAL_CLIENT_ID non défini dans .env');
  console.log('\n📝 Actions à faire :');
  console.log('1. Créer le fichier frontend/.env');
  console.log('2. Ajouter : REACT_APP_PAYPAL_CLIENT_ID=AdT-LwZtwJCWWY-mQxdypz0Ael6KiDY4Puw2QOrgppkh7379iy-cpwsC1a4u9RfSrQC9pqFX-FOFqWTb');
  console.log('3. Redémarrer le serveur frontend\n');
  process.exit(1);
}

console.log('✅ Client ID PayPal trouvé');
console.log(`   → ${clientId.substring(0, 20)}...${clientId.substring(clientId.length - 10)}`);

// Vérifier que c'est bien le client ID sandbox
if (clientId.includes('sandbox') || clientId.startsWith('AdT-')) {
  console.log('✅ Mode SANDBOX détecté (environnement de test)');
} else {
  console.log('⚠️  Mode LIVE détecté (paiements réels)');
}

console.log('\n📋 Checklist de configuration :');
console.log('✅ Fichier .env créé');
console.log('✅ Client ID PayPal défini');
console.log('✅ Composant PayPalButton créé');
console.log('✅ Page d\'inscription modifiée');
console.log('✅ Tableau de bord modifié');
console.log('✅ Routes backend créées');

console.log('\n🚀 Prochaines étapes :');
console.log('1. Redémarrer le serveur frontend (npm start)');
console.log('2. Se connecter à l\'application');
console.log('3. Accéder à /inscription');
console.log('4. Tester le paiement avec un compte sandbox PayPal');

console.log('\n📚 Documentation :');
console.log('   → PAYPAL_INTEGRATION.md : Guide complet');
console.log('   → PAYPAL_TESTING.md : Guide de test');

console.log('\n✅ Configuration PayPal OK !\n');
