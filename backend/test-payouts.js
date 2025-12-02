require('dotenv').config();
const mongoose = require('mongoose');
const Campus = require('./src/models/Campus');
const Registration = require('./src/models/Registration');
const Payout = require('./src/models/Payout');
const payoutService = require('./src/services/payoutService');

async function testPayouts() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Créer/Vérifier les campus
    console.log('\n📋 Configuration des campus...');
    console.log('⚠️  IMPORTANT: Remplacez les emails ci-dessous par vos vrais emails Sandbox PayPal\n');
    
    const campusData = [
      { name: 'Lorient', paypalEmail: 'sb-ffquu47897197@personal.example.com' },
      { name: 'Laval', paypalEmail: 'sb-zswpq47896992@personal.example.com' },
      { name: 'Amiens', paypalEmail: 'sb-u6ney47783903@personal.example.com' },
      { name: 'Nantes', paypalEmail: 'sb-hlowi47877553@business.example.com' },
      { name: 'Autres', paypalEmail: 'sb-ffquu47897197@personal.example.com' }, // Utilise Lorient par défaut
    ];

    for (const data of campusData) {
      let campus = await Campus.findOne({ name: data.name });
      if (!campus) {
        campus = new Campus({
          ...data,
          redistributionPercentage: 100,
          isActive: true,
        });
        await campus.save();
        console.log(`✅ Campus créé: ${data.name} → ${data.paypalEmail}`);
      } else {
        // Mettre à jour l'email si nécessaire
        campus.paypalEmail = data.paypalEmail;
        await campus.save();
        console.log(`ℹ️  Campus mis à jour: ${data.name} → ${data.paypalEmail}`);
      }
    }

    // 2. Trouver des inscriptions payées sans payout
    console.log('\n💰 Recherche d\'inscriptions payées...');
    const paidRegistrations = await Registration.find({
      paymentStatus: 'paid',
    }).limit(5);

    console.log(`Trouvé ${paidRegistrations.length} inscription(s) payée(s)\n`);

    if (paidRegistrations.length === 0) {
      console.log('⚠️  Aucune inscription payée trouvée.');
      console.log('💡 Créez d\'abord une inscription avec paymentStatus="paid"');
      console.log('   ou utilisez l\'interface d\'inscription pour tester.\n');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Afficher les inscriptions trouvées
    paidRegistrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} - ${reg.refuge} - ${reg.amountPaid}€`);
    });

    // 3. Créer des payouts pour test
    console.log('\n🔄 Création des payouts...');
    let createdCount = 0;

    for (const registration of paidRegistrations) {
      try {
        const payout = await payoutService.createPayoutForRegistration(
          registration._id.toString()
        );
        console.log(`✅ Payout créé: ${payout.amount}€ pour ${payout.campus} → ${payout.recipientEmail}`);
        createdCount++;
      } catch (error) {
        console.log(`⚠️  ${registration.firstName} ${registration.lastName}: ${error.message}`);
      }
    }

    console.log(`\n📊 ${createdCount} payout(s) créé(s)`);

    // 4. Lister les payouts en attente
    console.log('\n📋 Tous les payouts en attente:');
    const pendingPayouts = await Payout.find({ status: 'pending' })
      .populate('registration', 'firstName lastName refuge amountPaid');

    if (pendingPayouts.length === 0) {
      console.log('Aucun payout en attente');
    } else {
      pendingPayouts.forEach((payout, index) => {
        console.log(`\n${index + 1}. Campus: ${payout.campus}`);
        console.log(`   Montant: ${payout.amount}€ (${payout.redistributionPercentage}% de ${payout.originalAmount}€)`);
        console.log(`   Destinataire: ${payout.recipientEmail}`);
        console.log(`   Inscription: ${payout.registration.firstName} ${payout.registration.lastName}`);
      });
    }

    // 5. Afficher les statistiques
    console.log('\n\n📈 Statistiques globales:');
    const stats = await payoutService.getStatistics();
    
    if (stats.byStatus && stats.byStatus.length > 0) {
      console.log('\n📊 Par statut:');
      stats.byStatus.forEach(s => {
        console.log(`   ${s._id.toUpperCase().padEnd(12)} ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€`);
      });
    }

    if (stats.byCampus && stats.byCampus.length > 0) {
      console.log('\n🏢 Par campus:');
      stats.byCampus.forEach(s => {
        console.log(`   ${s._id.padEnd(12)} ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€ (✅${s.successCount} | ❌${s.failedCount})`);
      });
    }

    // 6. Instructions pour l'envoi PayPal
    console.log('\n\n' + '='.repeat(70));
    console.log('⚠️  PROCHAINE ÉTAPE : TESTER L\'ENVOI PAYPAL SANDBOX');
    console.log('='.repeat(70));
    console.log('\n1. Vérifiez que PAYPAL_MODE=sandbox dans votre .env');
    console.log('2. Vérifiez que PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET sont corrects');
    console.log('3. Remplacez les emails ci-dessus par vos vrais comptes Sandbox');
    console.log('4. Assurez-vous que votre compte Business Sandbox a du crédit');
    console.log('\n5. Pour exécuter l\'envoi PayPal, décommentez la section ci-dessous:\n');

    // ENVOI PAYPAL ACTIVÉ - TEST RÉEL
    console.log('🚀 Exécution des payouts PayPal...\n');
    const result = await payoutService.executePendingPayouts(10);
    
    console.log('\n✅ Redistribution terminée:');
    console.log(`   Succès: ${result.success}`);
    console.log(`   Échecs: ${result.failed}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Erreurs:');
      result.errors.forEach(err => console.log(`   - ${err}`));
    }

    // Rafraîchir les stats après envoi
    const updatedStats = await payoutService.getStatistics();
    console.log('\n📊 Statistiques mises à jour:');
    updatedStats.byStatus.forEach(s => {
      console.log(`   ${s._id.toUpperCase().padEnd(12)} ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test terminé - Déconnexion MongoDB\n');
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Exécuter le test
testPayouts();
