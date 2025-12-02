# 🧪 Guide de test - Intégration PayPal

## Prérequis

1. ✅ Backend démarré sur `http://localhost:5000`
2. ✅ Frontend démarré sur `http://localhost:3000`
3. ✅ MongoDB connecté
4. ✅ Fichier `frontend/.env` avec le Client ID PayPal
5. ✅ Compte utilisateur créé et vérifié

## 📝 Test 1 : Inscription avec paiement initial

### Étapes :

1. **Se connecter** à l'application
2. **Accéder à** `/inscription` (http://localhost:3000/inscription)
3. **Remplir le formulaire** :
   - Nom, prénom, email
   - Date de naissance, sexe
   - Adresse, téléphone
   - Refuge CRPT
   - Allergies (si applicable)
   - **Montant à payer** : Tester avec 60€ (paiement partiel)
4. **Cliquer sur** "Valider mon inscription"
5. **Vérifier** :
   - ✅ Message de confirmation du formulaire
   - ✅ Apparition du bouton PayPal
6. **Cliquer sur le bouton PayPal**
7. **Se connecter avec un compte sandbox** PayPal
8. **Confirmer le paiement**
9. **Vérifier la redirection** vers `/tableau-de-bord`
10. **Vérifier dans le dashboard** :
    - ✅ Montant payé : 60€
    - ✅ Reste à payer : 60€
    - ✅ Statut : "Paiement Partiel"
    - ✅ Bouton "Régler le solde" visible

## 💰 Test 2 : Paiement du solde restant

### Étapes :

1. **Accéder au** `/tableau-de-bord` (http://localhost:3000/tableau-de-bord)
2. **Vérifier** l'affichage :
   - Montant payé : 60€
   - Reste à payer : 60€
3. **Cliquer sur** "Régler le solde (60€)"
4. **Vérifier** :
   - ✅ Ouverture du modal de paiement
   - ✅ Affichage du récapitulatif
   - ✅ Bouton PayPal dans le modal
5. **Cliquer sur le bouton PayPal** dans le modal
6. **Se connecter et confirmer** le paiement
7. **Vérifier après paiement** :
   - ✅ Fermeture du modal
   - ✅ Montant payé : 120€
   - ✅ Reste à payer : 0€
   - ✅ Statut : "Paiement Complet"
   - ✅ Bouton "Régler le solde" masqué

## 🎯 Test 3 : Inscription avec paiement complet

### Étapes :

1. **Créer un nouveau compte** utilisateur
2. **Accéder à** `/inscription`
3. **Remplir le formulaire**
4. **Montant à payer** : Sélectionner 120€ (paiement total)
5. **Valider et payer** via PayPal
6. **Vérifier dans le dashboard** :
   - ✅ Montant payé : 120€
   - ✅ Reste à payer : 0€
   - ✅ Statut : "Paiement Complet"
   - ✅ Pas de bouton "Régler le solde"

## 🔍 Vérifications backend

### Dans MongoDB :

```javascript
// Se connecter à MongoDB
use gj-camp-db

// Vérifier l'inscription créée
db.registrations.find().pretty()

// Vérifier les champs importants :
{
  amountPaid: 60,           // Montant payé
  amountRemaining: 60,      // Reste à payer
  paymentStatus: "partial", // Statut
  paymentDetails: {         // Détails PayPal
    orderId: "...",
    payerId: "...",
    payerEmail: "...",
    status: "COMPLETED"
  }
}
```

### Dans les logs backend :

```bash
# Terminal backend
✅ Inscription au camp enregistrée avec succès !
✅ Paiement supplémentaire enregistré avec succès
```

## ⚠️ Scénarios d'erreur à tester

### 1. Montant invalide
- Entrer un montant < 20€ ou > 120€
- **Résultat attendu** : Message d'erreur "Le montant doit être entre 20€ et 120€"

### 2. Annulation du paiement PayPal
- Lancer le paiement puis annuler sur PayPal
- **Résultat attendu** : Message "Paiement annulé" + possibilité de réessayer

### 3. Utilisateur non connecté
- Essayer d'accéder à `/inscription` sans être connecté
- **Résultat attendu** : Message "Vous devez être connecté" + bouton "Se connecter"

### 4. Tentative de payer le solde d'une autre personne
- Essayer de modifier l'ID de l'inscription dans l'URL
- **Résultat attendu** : Erreur 403 "Non autorisé"

## 📊 Checklist finale

- [ ] Paiement initial fonctionne (partial)
- [ ] Paiement complet fonctionne (paid)
- [ ] Paiement du solde fonctionne
- [ ] Bouton PayPal s'affiche correctement
- [ ] Détails du paiement enregistrés en DB
- [ ] Statut de paiement mis à jour correctement
- [ ] Modal de paiement fonctionne
- [ ] Redirection après paiement OK
- [ ] Messages de confirmation affichés
- [ ] Gestion des erreurs fonctionnelle

## 🐛 Debug

### Si le bouton PayPal ne s'affiche pas :

1. **Ouvrir la console du navigateur** (F12)
2. **Chercher les erreurs** JavaScript
3. **Vérifier** :
   - Le Client ID est bien défini dans `.env`
   - Le serveur frontend a été redémarré après modification du `.env`
   - Le SDK PayPal se charge correctement (Network tab)

### Si le paiement ne s'enregistre pas :

1. **Vérifier les logs backend**
2. **Vérifier la connexion** MongoDB
3. **Vérifier le token** JWT (Authorization header)
4. **Tester la route** directement avec Postman/Insomnia

## 📞 Comptes Sandbox PayPal

Pour tester, créer des comptes sandbox sur :
https://developer.paypal.com/dashboard/accounts

**Types de comptes** :
- **Business** : Compte vendeur (pour recevoir les paiements)
- **Personal** : Compte acheteur (pour payer)

---

✅ **Bonne chance pour les tests !**
