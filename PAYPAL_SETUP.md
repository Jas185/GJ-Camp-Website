# 🔐 Configuration Sécurité PayPal

## ✅ Modifications Appliquées

Les modifications de sécurité suivantes ont été implémentées :

### 1. Service de Vérification PayPal
- ✅ Créé `backend/src/services/paypalService.js`
- ✅ Vérification côté serveur de chaque transaction
- ✅ Protection anti-replay (pas de transactions dupliquées)
- ✅ Validation des montants PayPal vs formulaire

### 2. Modèle TransactionLog
- ✅ Créé `backend/src/models/TransactionLog.js`
- ✅ Logging de toutes les transactions
- ✅ Traçabilité complète (IP, User-Agent, timestamps)

### 3. Contrôleurs Sécurisés
- ✅ `createRegistration()` : Vérification PayPal obligatoire
- ✅ `addAdditionalPayment()` : Vérification PayPal obligatoire
- ✅ Logging automatique dans TransactionLog

---

## 🔑 Configuration Requise - Client Secret PayPal

### Étape 1 : Obtenir le Client Secret

1. Aller sur https://developer.paypal.com/dashboard/
2. Se connecter avec votre compte PayPal
3. **Applications** → Sélectionner votre application
4. Cliquer sur **"Show"** à côté de "Secret"
5. Copier le Client Secret

### Étape 2 : Ajouter dans .env

Ouvrir `backend/.env` et remplacer :
```bash
PAYPAL_CLIENT_SECRET=
```

Par :
```bash
PAYPAL_CLIENT_SECRET=votre_client_secret_ici
```

### ⚠️ IMPORTANT - Mode Dégradé

**Actuellement, le site fonctionne en MODE DÉGRADÉ :**
- Si `PAYPAL_CLIENT_SECRET` est vide → Pas de vérification PayPal
- ⚠️ **DANGEREUX** : N'importe qui peut créer une inscription sans payer
- ✅ **Acceptable UNIQUEMENT en développement local**
- 🔴 **INTERDIT en production**

### Mode Développement vs Production

#### Développement (Sandbox)
```bash
NODE_ENV=development
PAYPAL_CLIENT_ID=AdT-LwZtwJCWWY-mQxdypz0Ael6KiDY4Puw2QOrgppkh7379iy-cpwsC1a4u9RfSrQC9pqFX-FOFqWTb
PAYPAL_CLIENT_SECRET=votre_sandbox_secret
```
- URL API: `https://api-m.sandbox.paypal.com`
- Paiements factices (test)

#### Production
```bash
NODE_ENV=production
PAYPAL_CLIENT_ID=votre_client_id_production
PAYPAL_CLIENT_SECRET=votre_client_secret_production
```
- URL API: `https://api.paypal.com`
- Paiements réels
- ⚠️ Créer une nouvelle application PayPal pour la production

---

## 🧪 Tester la Vérification

### Test 1 : Transaction Valide
```bash
# Frontend : Effectuer un paiement PayPal sandbox
# Backend : Vérifier les logs
✅ Paiement PayPal vérifié avec succès: { orderID: 'XXX', amount: 20, status: 'COMPLETED' }
✅ Transaction loggée: XXX
```

### Test 2 : Transaction Dupliquée
```bash
# Essayer de réutiliser le même orderID
❌ Erreur: 409 Conflict
Message: "Cette transaction a déjà été utilisée pour une inscription"
```

### Test 3 : Montant Falsifié
```bash
# Modifier le montant dans DevTools
Frontend: amountPaid = 120€
PayPal: Paiement réel = 20€
❌ Erreur: 400 Bad Request
Message: "Le montant payé ne correspond pas (PayPal: 20€, Formulaire: 120€)"
```

---

## 📊 Vérifier les Transactions Loggées

### Via MongoDB Compass
```javascript
// Rechercher dans la collection "transactionlogs"
db.transactionlogs.find().sort({ createdAt: -1 })
```

### Via Node.js (Script Test)
```javascript
// backend/test-transactions.js
const mongoose = require('mongoose');
const TransactionLog = require('./src/models/TransactionLog');

mongoose.connect(process.env.MONGODB_URI);

async function listTransactions() {
  const transactions = await TransactionLog.find()
    .sort({ createdAt: -1 })
    .limit(10);
  
  console.log('📊 Dernières transactions:');
  transactions.forEach(t => {
    console.log(`- ${t.orderID}: ${t.amount}€ (${t.status}) - ${t.payerEmail}`);
  });
}

listTransactions();
```

---

## 🚨 Checklist Avant Production

- [ ] ✅ `PAYPAL_CLIENT_SECRET` configuré (pas vide)
- [ ] ✅ Créer application PayPal Production
- [ ] ✅ Tester paiements sandbox avec vérification
- [ ] ✅ Tester anti-replay
- [ ] ✅ Tester validation montants
- [ ] ✅ Vérifier logs TransactionLog
- [ ] ✅ Configurer HTTPS (obligatoire PayPal)
- [ ] ✅ Variables d'environnement serveur (pas .env commité)
- [ ] ✅ Backup MongoDB activé
- [ ] ✅ Alertes email anomalies configurées

---

## 🔍 Dépannage

### Erreur "Impossible d'obtenir le token PayPal"
```bash
# Vérifier les credentials
echo $PAYPAL_CLIENT_ID
echo $PAYPAL_CLIENT_SECRET

# Tester manuellement
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### Mode Dégradé Activé (Warning)
```bash
⚠️ PAYPAL_CLIENT_SECRET manquant - Mode dégradé (DÉVELOPPEMENT UNIQUEMENT)
```
**Solution :** Ajouter le Client Secret dans `.env`

### Transaction Non Vérifiée
```bash
❌ Paiement non vérifié: Paiement non complété (statut: CREATED)
```
**Cause :** L'utilisateur a créé l'ordre mais n'a pas finalisé le paiement
**Solution :** L'utilisateur doit compléter le paiement PayPal

---

## 📚 Documentation Complémentaire

- **Analyse Sécurité Complète :** `PAYMENT_SECURITY_AUDIT.md`
- **Audit Sécurité Global :** `SECURITY_AUDIT.md`
- **Documentation PayPal :** https://developer.paypal.com/docs/api/orders/v2/

---

## 🆘 Support

**Problème de sécurité identifié ?**
- Email : security@gj-camp.fr
- Logs : `backend/logs/security.log`
- MongoDB : Collection `transactionlogs`

---

*Document créé le 1er décembre 2025*
