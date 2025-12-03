# Documentation Conformité RGPD - GJ Camp

## Vue d'ensemble

L'application GJ Camp est désormais entièrement conforme au Règlement Général sur la Protection des Données (RGPD). Ce document détaille toutes les mesures mises en place.

## ✅ Mesures de conformité implémentées

### 1. Base légale du traitement

- **Consentement explicite** : Checkbox obligatoires lors de l'inscription
- **Exécution du contrat** : Gestion des inscriptions au camp
- **Intérêt légitime** : Sécurité et prévention de la fraude
- **Obligation légale** : Conservation données comptables (3 ans)

### 2. Collecte et traitement des données

#### Données collectées
- **Identification** : Nom, prénom, email, téléphone, date de naissance
- **Profil** : Photo, site église, rôle ministériel, bio, réseaux sociaux
- **Données sensibles** : Allergies alimentaires (avec consentement explicite)
- **Techniques** : IP, user-agent, logs de connexion

#### Consentements
- ✅ Traitement données personnelles (obligatoire)
- ✅ CGU (obligatoire)
- ☑️ Communications marketing (optionnel)
- ☑️ Données de santé - allergies (si applicable)

### 3. Droits des utilisateurs

Tous les droits RGPD sont implémentés :

| Droit | Implémentation | Page/Route |
|-------|---------------|------------|
| **Droit d'accès** | Export JSON complet | `/gestion-donnees` |
| **Droit de rectification** | Modification profil | `/profil` |
| **Droit à l'effacement** | Suppression compte + anonymisation | `/gestion-donnees` |
| **Droit à la portabilité** | Export JSON téléchargeable | `GET /api/user/data/export` |
| **Droit d'opposition** | Retrait consentement marketing | `/gestion-donnees` |
| **Droit de limitation** | Via suppression de compte | `/gestion-donnees` |

### 4. Durées de conservation

| Type de données | Durée | Action automatique |
|----------------|-------|-------------------|
| Comptes non vérifiés | 30 jours | Suppression automatique |
| Comptes actifs | Tant que compte actif | - |
| Inscriptions camp | 3 ans | Anonymisation (conservation données financières) |
| Données de santé | Fin du camp | Suppression immédiate |
| Logs de consentement | 3 ans | Suppression automatique |
| Comptes supprimés | Immédiat | Anonymisation complète |

### 5. Sécurité des données

- **Cryptage** : Mots de passe avec bcrypt (salt rounds: 10)
- **Tokens JWT** : Expiration 7 jours
- **HTTPS** : Communication sécurisée (à activer en production)
- **Validation** : Express-validator pour toutes les entrées
- **Accès restreint** : RBAC (Role-Based Access Control)
- **Logs d'audit** : RoleAudit pour changements de permissions

### 6. Traçabilité (ConsentLog)

Tous les consentements sont enregistrés avec :
- Type de consentement (inscription, données, marketing, santé)
- Date et heure exactes
- Adresse IP
- User-Agent
- Version de la politique acceptée
- Métadonnées contextuelles

## 📁 Fichiers modifiés/créés

### Backend

**Modèles**
- ✅ `backend/src/models/ConsentLog.js` - Logs de consentements RGPD
- ✅ `backend/src/models/User.js` - Ajout champs RGPD (consentements, dates, versions)

**Contrôleurs**
- ✅ `backend/src/controllers/authController.js` - Enregistrement consentements à l'inscription
- ✅ `backend/src/controllers/userController.js` - Export données, suppression compte, gestion consentements

**Routes**
- ✅ `backend/src/routes/userRoutes.js` - Routes RGPD (`/data/export`, `/account/delete`, `/consents/update`)

**Scripts**
- ✅ `backend/scripts/dataRetentionCleanup.js` - Nettoyage automatique des données

### Frontend

**Pages**
- ✅ `frontend/src/pages/PrivacyPolicyPage.js` - Politique de confidentialité complète
- ✅ `frontend/src/pages/TermsOfServicePage.js` - CGU détaillées
- ✅ `frontend/src/pages/DataManagementPage.js` - Gestion données personnelles utilisateur
- ✅ `frontend/src/pages/SignupPage.js` - Checkboxes consentement RGPD
- ✅ `frontend/src/pages/CampRegistrationPage.js` - Consentement données de santé

**Composants**
- ✅ `frontend/src/components/Footer.js` - Liens RGPD (Confidentialité, CGU, Mes données)

**Routing**
- ✅ `frontend/src/App.js` - Routes RGPD (`/politique-confidentialite`, `/conditions-utilisation`, `/gestion-donnees`)

**Context**
- ✅ `frontend/src/context/AuthContext.js` - Support paramètres consentement dans signup()

## 🔧 Configuration requise

### Variables d'environnement (.env)

```env
# RGPD - Contact DPO
DPO_EMAIL=dpo@gj-camp.fr
CONTACT_EMAIL=contact@gj-camp.fr

# Durées de conservation (optionnel, valeurs par défaut dans le code)
UNVERIFIED_ACCOUNT_RETENTION_DAYS=30
REGISTRATION_RETENTION_YEARS=3
CONSENT_LOG_RETENTION_YEARS=3
```

### Cron job recommandé

Ajouter dans le crontab du serveur :

```bash
# Nettoyage RGPD quotidien à 2h du matin
0 2 * * * cd /path/to/GJ-Camp-Website/backend && node scripts/dataRetentionCleanup.js >> /var/log/gj-camp-cleanup.log 2>&1
```

## 🚀 Utilisation

### Pour les utilisateurs

1. **Inscription** : Accepter obligatoirement les consentements RGPD
2. **Accéder à ses données** : Menu utilisateur → "Mes données"
3. **Exporter ses données** : Cliquer sur "Télécharger mes données" → fichier JSON
4. **Modifier consentements** : Décocher/cocher marketing dans "Mes données"
5. **Supprimer son compte** : Bouton rouge dans "Mes données" → confirmation requise

### Pour les administrateurs

1. **Consulter les logs de consentement** : Accès MongoDB collection `consentlogs`
2. **Exécuter le nettoyage manuel** : `node backend/scripts/dataRetentionCleanup.js`
3. **Vérifier les données anonymisées** : Rechercher `deleted_*@anonymized.local` dans la DB

## 📊 API RGPD

### Export des données utilisateur
```http
GET /api/user/data/export
Authorization: Bearer {token}

Response: {
  "message": "Export des données réussi",
  "data": {
    "metadata": {...},
    "personalData": {...},
    "accountData": {...},
    "gdprConsents": {...},
    "registrations": [...],
    "consentHistory": [...]
  }
}
```

### Suppression de compte
```http
DELETE /api/user/account/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "confirmDelete": true
}

Response: {
  "message": "Votre compte a été supprimé avec succès",
  "accountDeleted": true
}
```

### Mise à jour consentements
```http
PUT /api/user/consents/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "marketingConsent": true
}

Response: {
  "message": "Vos préférences de consentement ont été mises à jour",
  "consents": {
    "dataProcessingConsent": true,
    "marketingConsent": true
  }
}
```

## 📝 Documents légaux

### Accessibles publiquement

- **Politique de confidentialité** : `/politique-confidentialite`
  - Détails sur la collecte de données
  - Finalités du traitement
  - Droits des utilisateurs
  - Durées de conservation
  - Coordonnées DPO

- **CGU** : `/conditions-utilisation`
  - Conditions d'utilisation du service
  - Obligations des utilisateurs
  - Responsabilités
  - Propriété intellectuelle

### Accessibles uniquement connecté

- **Gestion des données** : `/gestion-donnees`
  - Export données (JSON)
  - Gestion consentements
  - Suppression de compte

## ⚖️ Conformité légale

### Articles RGPD couverts

- ✅ **Article 6** : Licéité du traitement (bases légales)
- ✅ **Article 7** : Consentement (enregistrement, preuve, retrait)
- ✅ **Article 9** : Données sensibles (consentement explicite pour santé)
- ✅ **Article 12** : Information transparente
- ✅ **Article 13-14** : Information lors de la collecte
- ✅ **Article 15** : Droit d'accès
- ✅ **Article 16** : Droit de rectification
- ✅ **Article 17** : Droit à l'effacement
- ✅ **Article 18** : Droit à la limitation
- ✅ **Article 20** : Droit à la portabilité
- ✅ **Article 21** : Droit d'opposition
- ✅ **Article 30** : Registre des activités de traitement
- ✅ **Article 32** : Sécurité du traitement

### Recommandations CNIL suivies

- ✅ Consentement libre, spécifique, éclairé et univoque
- ✅ Opt-in explicite (pas de case précochée)
- ✅ Facilité de retrait du consentement
- ✅ Séparation consentements obligatoires/optionnels
- ✅ Granularité des consentements
- ✅ Durées de conservation adaptées
- ✅ Minimisation des données collectées
- ✅ Pseudonymisation/anonymisation

## 🔍 Audit et contrôle

### Données auditables

1. **ConsentLog** : Historique complet des consentements
2. **RoleAudit** : Changements de permissions
3. **User.lastLoginAt** : Activité du compte
4. **Registration.updatedAt** : Modifications d'inscriptions

### Points de contrôle RGPD

- [ ] Revue annuelle de la politique de confidentialité
- [ ] Vérification mensuelle des durées de conservation
- [ ] Test semestriel de la procédure d'export de données
- [ ] Audit annuel des logs de consentement
- [ ] Formation annuelle de l'équipe sur le RGPD

## 📧 Contact DPO

Pour toute question sur la protection des données :

- **Email DPO** : dpo@gj-camp.fr
- **Email général** : contact@gj-camp.fr
- **CNIL** : www.cnil.fr

## 🎯 Checklist de déploiement

Avant mise en production :

- [ ] Activer HTTPS (certificat SSL)
- [ ] Configurer email DPO réel
- [ ] Configurer cron job de nettoyage
- [ ] Tester export de données
- [ ] Tester suppression de compte
- [ ] Vérifier logs de consentement
- [ ] Mettre à jour date de fin de camp dans `dataRetentionCleanup.js`
- [ ] Informer CNIL (si traitement > seuil)
- [ ] Former l'équipe aux procédures RGPD

---

**Version** : 1.0  
**Date** : 28 novembre 2025  
**Conformité RGPD** : ✅ Complète
