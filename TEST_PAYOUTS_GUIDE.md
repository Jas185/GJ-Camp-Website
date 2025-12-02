# Guide de Test - Système de Redistribution PayPal Payouts

## 🚀 Étape 1 : Configuration PayPal Sandbox

### Créer un compte Sandbox PayPal
1. Aller sur https://developer.paypal.com/
2. Se connecter avec votre compte PayPal
3. Aller dans **Dashboard** → **Apps & Credentials**
4. Sélectionner **Sandbox** (en haut)
5. Cliquer **Create App**
   - Nom : "GJ Camp Payouts Test"
   - Type : Merchant
6. Copier **Client ID** et **Secret**

### Créer des comptes test Sandbox
1. Dans Dashboard → **Sandbox** → **Accounts**
2. Créer 2 comptes :
   - **Business Account** (pour recevoir les paiements) → Votre compte principal
   - **Personal Accounts** (pour les campus) → 5 comptes pour chaque refuge

## 📝 Étape 2 : Configuration Backend

### Mettre à jour `.env`
```env
# MongoDB
MONGODB_URI=votre_mongodb_uri

# JWT
JWT_SECRET=votre_secret

# PayPal Payouts (SANDBOX)
PAYPAL_CLIENT_ID=votre_client_id_sandbox
PAYPAL_CLIENT_SECRET=votre_secret_sandbox
PAYPAL_MODE=sandbox

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Installer les dépendances
```bash
cd backend
npm install
```

## 🧪 Étape 3 : Script de Test

Créer `backend/test-payouts.js` pour tester sans interface :

```javascript
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
    const campusData = [
      { name: 'Lorient', paypalEmail: 'sb-lorient@personal.example.com' },
      { name: 'Laval', paypalEmail: 'sb-laval@personal.example.com' },
      { name: 'Amiens', paypalEmail: 'sb-amiens@personal.example.com' },
      { name: 'Nantes', paypalEmail: 'sb-nantes@personal.example.com' },
      { name: 'Autres', paypalEmail: 'sb-autres@personal.example.com' },
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
        console.log(`✅ Campus créé: ${data.name}`);
      } else {
        console.log(`ℹ️  Campus existe: ${data.name}`);
      }
    }

    // 2. Trouver des inscriptions payées sans payout
    console.log('\n💰 Recherche d\'inscriptions payées...');
    const paidRegistrations = await Registration.find({
      paymentStatus: 'paid',
    }).limit(3);

    console.log(`Trouvé ${paidRegistrations.length} inscription(s) payée(s)`);

    if (paidRegistrations.length === 0) {
      console.log('⚠️  Aucune inscription payée trouvée. Créez-en une d\'abord.');
      process.exit(0);
    }

    // 3. Créer des payouts pour test
    console.log('\n🔄 Création des payouts...');
    for (const registration of paidRegistrations) {
      try {
        const payout = await payoutService.createPayoutForRegistration(
          registration._id.toString()
        );
        console.log(`✅ Payout créé: ${payout.amount}€ pour ${payout.campus}`);
      } catch (error) {
        console.log(`⚠️  ${error.message}`);
      }
    }

    // 4. Lister les payouts en attente
    console.log('\n📊 Payouts en attente:');
    const pendingPayouts = await Payout.find({ status: 'pending' })
      .populate('registration', 'firstName lastName refuge amountPaid');

    pendingPayouts.forEach((payout, index) => {
      console.log(`${index + 1}. ${payout.campus} - ${payout.amount}€ → ${payout.recipientEmail}`);
      console.log(`   Inscription: ${payout.registration.firstName} ${payout.registration.lastName}`);
    });

    // 5. Exécuter les payouts (COMMENTÉ pour sécurité)
    console.log('\n⚠️  Pour exécuter les payouts PayPal:');
    console.log('Décommentez la section ci-dessous et assurez-vous que:');
    console.log('1. Les emails PayPal Sandbox sont corrects');
    console.log('2. Votre compte Business a du crédit');
    console.log('3. PAYPAL_MODE=sandbox dans .env\n');

    // DÉCOMMENTER POUR TESTER L'ENVOI RÉEL
    /*
    const result = await payoutService.executePendingPayouts(5);
    console.log('\n✅ Redistribution terminée:');
    console.log(`   Succès: ${result.success}`);
    console.log(`   Échecs: ${result.failed}`);
    if (result.errors && result.errors.length > 0) {
      console.log('   Erreurs:', result.errors);
    }
    */

    // 6. Afficher les statistiques
    console.log('\n📈 Statistiques:');
    const stats = await payoutService.getStatistics();
    
    console.log('\nPar statut:');
    stats.byStatus.forEach(s => {
      console.log(`  ${s._id}: ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€`);
    });

    console.log('\nPar campus:');
    stats.byCampus.forEach(s => {
      console.log(`  ${s._id}: ${s.count} payout(s) - ${s.totalAmount.toFixed(2)}€`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test terminé');
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

testPayouts();
```

## 🔧 Étape 4 : Exécution des Tests

### Test 1 : Vérifier la configuration
```bash
cd backend
node test-payouts.js
```

**Résultat attendu :**
- ✅ Connexion MongoDB
- ✅ Campus créés/vérifiés
- ✅ Inscriptions trouvées
- ✅ Payouts créés en statut "pending"
- 📊 Statistiques affichées

### Test 2 : Tester l'envoi PayPal (Sandbox)

1. **Mettre à jour les emails dans `test-payouts.js`** avec vos vrais emails Sandbox
2. **Décommenter la section d'exécution** dans le script
3. **Vérifier le crédit** du compte Business Sandbox
4. **Exécuter** :
```bash
node test-payouts.js
```

5. **Vérifier sur PayPal Sandbox** :
   - Connexion sur https://www.sandbox.paypal.com/
   - Se connecter avec chaque compte Personal
   - Vérifier la réception de l'argent

## 🌐 Étape 5 : Test via Interface Frontend

### Ajouter la route dans `App.js`
```javascript
import PayoutManagementPage from './pages/PayoutManagementPage';

// Dans les routes
<Route path="/admin/payouts" element={<PayoutManagementPage />} />
```

### Tester l'interface
1. Démarrer le backend : `cd backend && npm run dev`
2. Démarrer le frontend : `cd frontend && npm start`
3. Se connecter en tant qu'admin
4. Aller sur `/admin/payouts`

### Tests à effectuer :
- ✅ **Onglet Redistributions** : Voir la liste, filtrer par campus/statut
- ✅ **Onglet Campus** : Configurer les emails PayPal
- ✅ **Bouton "Redistribuer maintenant"** : Exécuter les payouts
- ✅ **Onglet Statistiques** : Vérifier les montants

## 🔍 Étape 6 : Vérification des Résultats

### Dans MongoDB
```javascript
// Vérifier les payouts créés
db.payouts.find().pretty()

// Payouts par statut
db.payouts.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

### Dans PayPal Sandbox
1. Se connecter avec compte Business → Voir les paiements sortants
2. Se connecter avec comptes Personal → Voir les paiements entrants

### Dans les logs backend
```bash
# Voir les logs en temps réel
cd backend
npm run dev

# Chercher dans les logs :
# ✅ Payout créé
# ✅ Batch PayPal créé
# ✅ Redistribution terminée
```

## ⚠️ Troubleshooting

### Erreur : "AUTHENTICATION_FAILURE"
- Vérifier PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET
- Vérifier PAYPAL_MODE=sandbox

### Erreur : "RECEIVER_UNREGISTERED"
- L'email PayPal du campus n'existe pas
- Créer le compte sur sandbox.paypal.com

### Erreur : "INSUFFICIENT_FUNDS"
- Le compte Business Sandbox n'a pas assez d'argent
- Ajouter du crédit virtuel dans le dashboard

### Aucune inscription trouvée
- Créer une inscription test avec `paymentStatus: 'paid'`
- Ou utiliser l'interface d'inscription

## 📊 Checklist Complète

- [ ] Compte PayPal Developer créé
- [ ] App Sandbox créée (Client ID + Secret)
- [ ] 5 comptes Personal Sandbox créés
- [ ] Variables .env configurées
- [ ] Packages npm installés
- [ ] Script test-payouts.js exécuté
- [ ] Campus configurés dans DB
- [ ] Au moins 1 inscription payée existe
- [ ] Payouts créés en statut pending
- [ ] Test d'envoi PayPal réussi (optionnel)
- [ ] Interface frontend accessible
- [ ] Statistiques affichées correctement

## 🎯 Résultat Final

Si tout fonctionne :
1. ✅ Payouts créés automatiquement pour chaque inscription payée
2. ✅ Envoi par lots via PayPal Payouts API
3. ✅ Suivi des statuts (pending → processing → success)
4. ✅ Dashboard admin avec statistiques
5. ✅ Redistribution automatique par campus

**Prêt pour la production !** 🚀
