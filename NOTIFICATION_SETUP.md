# Configuration des Notifications Multi-Canal

## 📧 Email (Nodemailer) - ✅ DÉJÀ CONFIGURÉ

Les notifications email utilisent votre configuration existante dans `backend/src/config/email.js`.

Aucune installation supplémentaire nécessaire !

---

## 📱 SMS (Twilio) - Configuration requise

### 1. Installation
```bash
cd backend
npm install twilio
```

### 2. Créer un compte Twilio
1. Aller sur https://www.twilio.com/
2. Créer un compte (essai gratuit : 15.50$ de crédit)
3. Obtenir un numéro de téléphone Twilio

### 3. Variables d'environnement
Ajouter dans `backend/.env` :
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33612345678
```

### 4. Trouver vos identifiants
- Console Twilio : https://console.twilio.com/
- Account SID et Auth Token : Dashboard principal
- Phone Number : Phone Numbers > Manage Numbers

---

## 🔔 Push Notifications (OneSignal) - Configuration requise

### Option 1 : OneSignal (Recommandé - Gratuit)

#### Installation
```bash
cd backend
npm install onesignal-node
```

#### Configuration
1. Créer un compte sur https://onesignal.com/
2. Créer une nouvelle app
3. Configurer pour Web Push
4. Obtenir App ID et API Key

Ajouter dans `backend/.env` :
```env
ONESIGNAL_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ONESIGNAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Frontend (à ajouter dans `public/index.html`)
```html
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>
<script>
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "VOTRE_ONESIGNAL_APP_ID",
      notifyButton: {
        enable: true,
      }
    });
  });
</script>
```

### Option 2 : Firebase Cloud Messaging (Alternative)

#### Installation
```bash
cd backend
npm install firebase-admin
```

#### Configuration
1. Firebase Console : https://console.firebase.google.com/
2. Créer un projet
3. Project Settings > Service Accounts > Generate private key
4. Télécharger le fichier JSON

Ajouter dans `backend/.env` :
```env
FIREBASE_PROJECT_ID=votre-projet-id
FIREBASE_PRIVATE_KEY_PATH=./firebase-service-account.json
```

---

## 🚀 Activation des Notifications

### 1. Backend déjà configuré ✅
Le service `notificationService.js` est prêt et s'exécute automatiquement à chaque nouveau post.

### 2. Ajouter la route dans App.js
```javascript
import NotificationSettingsPage from './pages/NotificationSettingsPage';

// Dans <Routes>
<Route path="/notifications" element={<NotificationSettingsPage />} />
```

### 3. Ajouter un lien dans le Header/Footer
```javascript
<Link to="/notifications">Notifications</Link>
```

---

## 📊 Test des Notifications

### Test Email
```bash
# Les emails fonctionnent déjà avec votre config existante
# Créez un post pour voir les notifications
```

### Test SMS (après config Twilio)
```bash
node backend/src/test-notifications.js
```

Créer `backend/src/test-notifications.js` :
```javascript
require('dotenv').config();
const { sendSMSNotification } = require('./services/notificationService');

const testPost = {
  author: { firstName: 'Test', lastName: 'User' },
  text: 'Ceci est un test de notification SMS'
};

const recipients = [{
  phoneNumber: '+33612345678', // VOTRE numéro
  smsNotifications: true
}];

sendSMSNotification(testPost, recipients).then(result => {
  console.log('Résultat:', result);
  process.exit(0);
});
```

### Test Push (après config OneSignal)
Créer un post depuis l'interface et vérifier dans la console OneSignal.

---

## 💰 Coûts

| Service | Gratuit | Payant |
|---------|---------|--------|
| **Email** (Nodemailer) | ✅ Illimité avec Gmail | Brevo/SendGrid dès 25€/mois |
| **SMS** (Twilio) | 15.50$ de crédit | ~0.05€ par SMS |
| **Push** (OneSignal) | ✅ 10,000 notifications/mois | 99$/mois pour plus |

---

## 🎯 Recommandations

### Pour commencer (Gratuit)
1. ✅ **Email** : Déjà actif
2. ✅ **Push** : Configurer OneSignal (gratuit)
3. ⏸️ **SMS** : Activer plus tard si besoin

### Pour production
- Email : Migrer vers Brevo/SendGrid pour meilleure délivrabilité
- Push : OneSignal gratuit suffit largement
- SMS : Utiliser uniquement pour alertes urgentes

---

## 🔧 Dépannage

### Emails non reçus
- Vérifier logs backend : `console.log` dans notificationService
- Vérifier dossier spam
- Tester avec test-email.js existant

### SMS non envoyés
- Vérifier crédit Twilio
- Vérifier format numéro (+33...)
- Vérifier logs : "SMS envoyés: X/Y"

### Push non reçus
- Vérifier permission navigateur
- Vérifier console OneSignal Dashboard
- Vérifier pushPlayerId enregistré dans User

---

## 📝 Variables d'environnement complètes

```env
# Email (DÉJÀ CONFIGURÉ)
EMAIL_SERVICE=gmail
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe

# SMS (OPTIONNEL)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33612345678

# Push (OPTIONNEL)
ONESIGNAL_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ONESIGNAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 📚 Documentation

- Twilio SMS : https://www.twilio.com/docs/sms
- OneSignal : https://documentation.onesignal.com/
- Firebase Cloud Messaging : https://firebase.google.com/docs/cloud-messaging
