# 📊 Page de Suivi des Activités - Documentation

## Vue d'ensemble
La page de suivi des activités permet aux administrateurs et responsables de visualiser et gérer les inscriptions aux activités optionnelles du camp.

## ✅ Fonctionnalités implémentées

### 1. **Affichage des statistiques**
- Vue en grille de toutes les activités optionnelles
- Compteur d'inscrits pour chaque activité
- Image, description, horaires et référent de chaque activité
- Badge indiquant le jour de l'activité (Jour 1, 2, 3, 4)

### 2. **Visualisation des participants**
- Modal détaillé avec la liste complète des participants
- Tableau avec les informations suivantes :
  - Nom et prénom
  - Email
  - Téléphone
  - Refuge
  - Sexe
  - Âge (calculé automatiquement à partir de la date de naissance)

### 3. **Export CSV**
- Export des participants par activité au format CSV
- Fichier compatible avec Excel (encodage UTF-8 avec BOM)
- Nom de fichier automatique : `participants_<nom_activite>.csv`
- Colonnes : Prénom, Nom, Email, Téléphone, Refuge, Sexe, Date de naissance

### 4. **Sécurité**
- Route protégée : accessible uniquement aux rôles `responsable` et `admin`
- Token JWT requis pour toutes les requêtes
- Middleware `requireVerifiedEmail` : email vérifié obligatoire

## 🛣️ Routes Backend

### GET `/api/activity-tracking/statistics`
Récupère les statistiques de toutes les activités optionnelles.

**Réponse :**
```json
[
  {
    "activity": {
      "_id": "...",
      "titre": "Piscine",
      "description": "...",
      "jour": 2,
      "heureDebut": "14:00",
      "heureFin": "16:00",
      "image": "/uploads/...",
      "referent": {
        "_id": "...",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean@example.com"
      }
    },
    "inscritCount": 15,
    "inscrits": [
      {
        "_id": "...",
        "firstName": "Marie",
        "lastName": "Martin",
        "email": "marie@example.com",
        "phone": "0612345678",
        "refuge": "Paris",
        "sex": "F",
        "dateOfBirth": "2005-03-15"
      }
    ]
  }
]
```

### GET `/api/activity-tracking/:activityId/participants`
Récupère les participants d'une activité spécifique.

### GET `/api/activity-tracking/:activityId/export`
Exporte les participants en CSV.

**Réponse :** Fichier CSV avec en-tête BOM UTF-8

## 🎨 Interface utilisateur

### Éléments visuels
- **Couleurs** : Rouge (#a01e1e), Or (#d4af37), Bleu marine (#001a4d)
- **Cartes d'activité** : Image, titre, description, statistiques, actions
- **Modal responsive** : Tableau scrollable avec sticky header
- **Boutons désactivés** : Si aucun inscrit

### Design responsive
- Desktop : Grille multi-colonnes
- Mobile : Colonne unique, tableau scrollable horizontalement

## 📝 Utilisation

### Pour les administrateurs
1. Se connecter avec un compte `admin` ou `responsable`
2. Naviguer vers **📊 Suivi des activités** dans le menu
3. Consulter les statistiques en temps réel
4. Cliquer sur **👥 Voir les participants** pour voir le détail
5. Cliquer sur **📥 Exporter CSV** pour télécharger la liste

### Bouton Actualiser
- Recharge les données en temps réel
- Utile après de nouvelles inscriptions

## 🔧 Aspects techniques

### Frontend (React)
- **État local** : `useState` pour les statistiques, erreurs, modal
- **Effet** : `useEffect` pour charger les données au montage
- **Axios** : Requêtes HTTP avec token dans les headers
- **Export CSV** : Téléchargement avec `Blob` et `URL.createObjectURL`

### Backend (Express + MongoDB)
- **Agrégation** : `Promise.all` pour paralléliser les comptages
- **Population** : Mongoose populate pour les référents
- **Sélection** : `.select()` pour limiter les champs exposés

### Calcul de l'âge
```javascript
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
```

## 🚀 Déploiement

### Fichiers modifiés/créés
- ✅ `frontend/src/pages/ActivityTrackingPage.js` - Composant principal
- ✅ `frontend/src/styles/ActivityTrackingPage.css` - Styles
- ✅ `frontend/src/App.js` - Route décommentée
- ✅ Backend déjà configuré (`backend/src/routes/activityTrackingRoutes.js`)

### Pas de migration nécessaire
Le modèle `User` a déjà le champ `selectedActivities` qui stocke les IDs des activités sélectionnées.

## 📊 Exemple de données

### Activité avec inscriptions
```
Titre: Piscine
Jour: Jour 2
Horaire: 14:00 - 16:00
Inscrits: 15 participants
Référent: Jean Dupont
```

### Export CSV
```csv
Prénom,Nom,Email,Téléphone,Refuge,Sexe,Date de naissance
"Marie","Martin","marie@example.com","0612345678","Paris","F","15/03/2005"
"Paul","Durand","paul@example.com","0623456789","Lyon","M","22/07/2004"
```

## 🔐 Permissions requises

| Action | Rôle requis | Email vérifié |
|--------|-------------|---------------|
| Voir les statistiques | `responsable`, `admin` | ✅ Oui |
| Voir les participants | `responsable`, `admin` | ✅ Oui |
| Exporter CSV | `responsable`, `admin` | ✅ Oui |

## ✨ Améliorations futures possibles
- Filtres par jour, type d'activité
- Recherche de participants
- Graphiques et statistiques avancées
- Export PDF avec mise en forme
- Envoi d'emails groupés aux participants d'une activité
