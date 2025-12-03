/**
 * Script de nettoyage automatique des données (Conformité RGPD)
 * 
 * Ce script doit être exécuté périodiquement (cron job recommandé: quotidien)
 * pour respecter les durées de conservation RGPD:
 * 
 * - Comptes non vérifiés : suppression après 30 jours
 * - Données de santé (allergies) : suppression immédiate après le camp
 * - Logs de consentement : conservation 3 ans
 * - Inscriptions camp : anonymisation après 3 ans (conservation données financières)
 * 
 * Usage: node backend/scripts/dataRetentionCleanup.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Registration = require('../src/models/Registration');
const ConsentLog = require('../src/models/ConsentLog');

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const THREE_YEARS_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
const CAMP_END_DATE = new Date('2024-08-31'); // À ajuster selon la date réelle de fin du camp

async function cleanupData() {
  try {
    console.log('🧹 Démarrage du nettoyage des données RGPD...\n');

    // Connexion MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB\n');

    // 1. Supprimer les comptes non vérifiés > 30 jours
    console.log('📧 Nettoyage des comptes non vérifiés...');
    const unverifiedUsers = await User.find({
      isEmailVerified: false,
      createdAt: { $lt: THIRTY_DAYS_AGO },
      accountDeletionRequestedAt: null, // Ne pas toucher aux comptes déjà marqués pour suppression
    });

    let deletedUnverifiedCount = 0;
    for (const user of unverifiedUsers) {
      // Supprimer les inscriptions associées
      await Registration.deleteMany({ user: user._id });
      
      // Supprimer le compte
      await User.deleteOne({ _id: user._id });
      deletedUnverifiedCount++;
    }
    console.log(`   ✓ ${deletedUnverifiedCount} comptes non vérifiés supprimés\n`);

    // 2. Supprimer les données de santé après le camp
    if (Date.now() > CAMP_END_DATE) {
      console.log('🏥 Nettoyage des données de santé post-camp...');
      const result = await Registration.updateMany(
        { 
          hasAllergies: true,
          allergyDetails: { $exists: true, $ne: '', $ne: 'Données de santé supprimées' }
        },
        {
          $set: { 
            allergyDetails: 'Données de santé supprimées',
            hasAllergies: false 
          }
        }
      );
      console.log(`   ✓ ${result.modifiedCount} enregistrements d'allergies anonymisés\n`);
    } else {
      console.log('🏥 Nettoyage données de santé: le camp n\'est pas encore terminé\n');
    }

    // 3. Anonymiser les inscriptions > 3 ans (conserver données financières)
    console.log('📋 Anonymisation des inscriptions > 3 ans...');
    const oldRegistrations = await Registration.find({
      createdAt: { $lt: THREE_YEARS_AGO },
      firstName: { $ne: 'Utilisateur' }, // Éviter de traiter 2x
    });

    let anonymizedRegistrationsCount = 0;
    for (const reg of oldRegistrations) {
      reg.firstName = 'Utilisateur';
      reg.lastName = 'Anonymisé';
      reg.email = `anonymized_${reg._id}@deleted.local`;
      reg.address = 'Adresse supprimée';
      reg.phone = 'Téléphone supprimé';
      reg.allergyDetails = reg.hasAllergies ? 'Données supprimées' : '';
      
      await reg.save({ validateBeforeSave: false });
      anonymizedRegistrationsCount++;
    }
    console.log(`   ✓ ${anonymizedRegistrationsCount} inscriptions anonymisées\n`);

    // 4. Supprimer les logs de consentement > 3 ans (sauf ceux liés à suppression de compte)
    console.log('📜 Nettoyage des logs de consentement > 3 ans...');
    const deletedLogs = await ConsentLog.deleteMany({
      consentDate: { $lt: THREE_YEARS_AGO },
      consentType: { $ne: 'retrait_consentement' }, // Garder les preuves de suppression
    });
    console.log(`   ✓ ${deletedLogs.deletedCount} logs de consentement supprimés\n`);

    // 5. Rapport de synthèse
    console.log('📊 Rapport de nettoyage:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Comptes non vérifiés supprimés: ${deletedUnverifiedCount}`);
    console.log(`   Inscriptions anonymisées: ${anonymizedRegistrationsCount}`);
    console.log(`   Logs de consentement supprimés: ${deletedLogs.deletedCount}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 6. Statistiques générales
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const deletedAccounts = await User.countDocuments({ accountDeletionRequestedAt: { $ne: null } });
    const activeRegistrations = await Registration.countDocuments();

    console.log('📈 Statistiques actuelles:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total utilisateurs: ${totalUsers}`);
    console.log(`   Utilisateurs vérifiés: ${verifiedUsers}`);
    console.log(`   Comptes supprimés (anonymisés): ${deletedAccounts}`);
    console.log(`   Inscriptions actives: ${activeRegistrations}`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Nettoyage terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le nettoyage
cleanupData()
  .then(() => {
    console.log('\n👋 Script terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
