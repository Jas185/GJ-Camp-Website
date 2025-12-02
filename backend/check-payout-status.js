require('dotenv').config();
const mongoose = require('mongoose');
const Payout = require('./src/models/Payout');
const payoutService = require('./src/services/payoutService');

async function checkPayoutStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Trouver les payouts en statut failed ou processing
    const payouts = await Payout.find({ 
      status: { $in: ['processing', 'failed'] },
      paypalBatchId: { $exists: true }
    });

    console.log(`📋 ${payouts.length} payout(s) à vérifier\n`);

    if (payouts.length === 0) {
      console.log('Aucun payout à vérifier');
      await mongoose.disconnect();
      return;
    }

    for (const payout of payouts) {
      console.log(`\n🔍 Vérification payout ${payout._id}`);
      console.log(`   Campus: ${payout.campus}`);
      console.log(`   Montant: ${payout.amount}€`);
      console.log(`   Destinataire: ${payout.recipientEmail}`);
      console.log(`   Batch ID: ${payout.paypalBatchId}`);
      
      try {
        const updated = await payoutService.getPayoutStatus(payout._id.toString());
        console.log(`   ✅ Statut mis à jour: ${updated.status}`);
        
        if (updated.status === 'failed' && updated.errorMessage) {
          console.log(`   ❌ Erreur: ${updated.errorMessage}`);
        } else if (updated.status === 'success') {
          console.log(`   💰 Transaction ID: ${updated.transactionId}`);
          console.log(`   💸 Frais PayPal: ${updated.paypalFee}€`);
        }
      } catch (error) {
        console.log(`   ❌ Erreur vérification: ${error.message}`);
      }
    }

    // Afficher les stats finales
    console.log('\n\n📊 Statistiques finales:');
    const stats = await payoutService.getStatistics();
    
    stats.byStatus.forEach(s => {
      console.log(`   ${s._id.toUpperCase().padEnd(12)} ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Vérification terminée\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkPayoutStatus();
