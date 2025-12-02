# 💳 Intégration PayPal - Camp GJ

## 📋 Vue d'ensemble

L'intégration PayPal permet aux utilisateurs de régler les frais d'inscription au camp (120€) en une ou plusieurs fois (minimum 20€).

## 🔧 Configuration

### 1. Variables d'environnement

**Frontend** (`frontend/.env`):
```env
REACT_APP_PAYPAL_CLIENT_ID=AdT-LwZtwJCWWY-mQxdypz0Ael6KiDY4Puw2QOrgppkh7379iy-cpwsC1a4u9RfSrQC9pqFX-FOFqWTb
```

> **Note**: Cet ID est pour l'environnement **sandbox** (test). Pour la production, remplacez-le par le Client ID **live**.

### 2. Basculer entre Sandbox et Live

#### Sandbox (Test):
- Utilisez le Client ID sandbox
- Les paiements sont simulés, aucun argent réel
- Créez des comptes de test sur https://developer.paypal.com/

#### Live (Production):
- Remplacez `REACT_APP_PAYPAL_CLIENT_ID` par le Client ID live
- Les paiements sont réels
- Nécessite un compte PayPal Business vérifié

## 🎯 Workflow utilisateur

### Inscription initiale

1. **L'utilisateur remplit le formulaire d'inscription** avec :
   - Informations personnelles
   - Coordonnées
   - Refuge et allergies
   - Montant à régler (20-120€)

2. **Clic sur "Valider mon inscription"** :
   - Validation du formulaire
   - Affichage du bouton PayPal

3. **Paiement via PayPal** :
   - Redirection vers PayPal
   - Authentification et confirmation du paiement
   - Retour sur le site

4. **Enregistrement de l'inscription** :
   - Si paiement = 120€ → statut `paid` (complet)
   - Si paiement < 120€ → statut `partial` (partiel)
   - Détails du paiement sauvegardés (ID transaction, email PayPal, etc.)

### Paiement du solde restant

1. **Accès au tableau de bord** (`/tableau-de-bord`)
2. **Affichage du solde** :
   - Montant payé
   - Montant restant
   - Bouton "Régler le solde" (si inscription partielle)

3. **Clic sur "Régler le solde"** :
   - Ouverture d'un modal
   - Affichage du montant restant
   - Bouton PayPal pour payer le solde

4. **Paiement du solde** :
   - Redirection vers PayPal
   - Confirmation du paiement
   - Mise à jour de l'inscription → statut `paid`

## 📁 Structure des fichiers

### Frontend

```
frontend/
├── .env                                    # Client ID PayPal
├── src/
│   ├── components/
│   │   └── PayPalButton.js                # Composant bouton PayPal réutilisable
│   ├── pages/
│   │   ├── CampRegistrationNewPage.js     # Page d'inscription avec PayPal
│   │   └── UserDashboard.js               # Tableau de bord avec paiement du solde
│   └── styles/
│       ├── RegistrationNew.css            # Styles inscription + PayPal
│       └── UserDashboard.css              # Styles dashboard + modal paiement
```

### Backend

```
backend/
├── src/
│   ├── models/
│   │   └── Registration.js                # Modèle avec champs paymentDetails
│   ├── controllers/
│   │   └── registrationController.js      # Logique métier (paiements)
│   └── routes/
│       └── registrationRoutes.js          # Routes API paiements
```

## 🔌 API Endpoints

### `POST /api/registration`
Créer une nouvelle inscription avec paiement initial.

**Body**:
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "sex": "M",
  "dateOfBirth": "2000-01-01",
  "address": "123 Rue Example",
  "phone": "0612345678",
  "refuge": "Lorient",
  "hasAllergies": false,
  "amountPaid": 60,
  "paymentDetails": {
    "orderId": "PAYPAL_ORDER_ID",
    "payerId": "PAYER_ID",
    "payerEmail": "buyer@example.com",
    "status": "COMPLETED",
    "amountPaid": 60
  }
}
```

**Response**:
```json
{
  "message": "✅ Inscription au camp enregistrée avec succès !",
  "registration": { ... }
}
```

### `GET /api/registration/mes-inscriptions`
Récupérer les inscriptions de l'utilisateur connecté.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "registrations": [
    {
      "_id": "...",
      "amountPaid": 60,
      "amountRemaining": 60,
      "paymentStatus": "partial",
      "paymentDetails": { ... }
    }
  ]
}
```

### `PUT /api/registration/:id/additional-payment`
Ajouter un paiement supplémentaire (payer le solde).

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "additionalAmount": 60,
  "paymentDetails": {
    "orderId": "PAYPAL_ORDER_ID_2",
    "payerId": "PAYER_ID",
    "payerEmail": "buyer@example.com",
    "status": "COMPLETED",
    "amountPaid": 60
  }
}
```

**Response**:
```json
{
  "message": "✅ Paiement supplémentaire enregistré avec succès",
  "registration": {
    "amountPaid": 120,
    "amountRemaining": 0,
    "paymentStatus": "paid"
  }
}
```

## 🔐 Sécurité

### Validation côté serveur
- Montant entre 20€ et 120€
- Vérification de l'utilisateur authentifié
- Validation du statut de paiement PayPal

### Protection des données
- Client ID public (frontend) - OK
- Secret PayPal jamais exposé (backend uniquement si nécessaire)
- Détails de paiement stockés de manière sécurisée

## 🧪 Tests

### En mode Sandbox (développement)

1. Créer un compte développeur PayPal : https://developer.paypal.com/
2. Créer des comptes sandbox (acheteur et vendeur) dans le dashboard
3. Utiliser le Client ID sandbox dans `.env`
4. Tester les paiements avec les comptes sandbox

### En mode Live (production)

1. Compte PayPal Business vérifié requis
2. Remplacer le Client ID par celui de production
3. Tester avec de vrais petits montants avant le lancement

## 📊 Statuts de paiement

| Statut | Description |
|--------|-------------|
| `unpaid` | Aucun paiement effectué (0€) |
| `partial` | Paiement partiel (entre 20€ et 119€) |
| `paid` | Paiement complet (120€) |

## 🚀 Déploiement

### Étapes pour passer en production

1. **Obtenir le Client ID live** :
   - Se connecter à https://developer.paypal.com/
   - Passer l'application en mode "Live"
   - Récupérer le Client ID live

2. **Mettre à jour la variable d'environnement** :
   ```env
   REACT_APP_PAYPAL_CLIENT_ID=<votre_client_id_live>
   ```

3. **Rebuilder le frontend** :
   ```bash
   cd frontend
   npm run build
   ```

4. **Déployer** sur votre serveur de production

## 🐛 Dépannage

### Le bouton PayPal ne s'affiche pas
- Vérifier que `REACT_APP_PAYPAL_CLIENT_ID` est défini dans `.env`
- Vérifier la console du navigateur pour les erreurs
- Redémarrer le serveur frontend après modification du `.env`

### Erreur "Client ID invalide"
- Vérifier que le Client ID est correct
- S'assurer d'utiliser le bon environnement (sandbox vs live)

### Paiement réussi mais inscription non enregistrée
- Vérifier les logs backend
- Vérifier que l'utilisateur est authentifié
- Vérifier la connexion à MongoDB

## 📞 Support

Pour toute question sur l'intégration PayPal :
- Documentation PayPal : https://developer.paypal.com/docs/
- Support technique : https://www.paypal.com/smarthelp/contact-us

---

✅ **Intégration PayPal complète et fonctionnelle !**
