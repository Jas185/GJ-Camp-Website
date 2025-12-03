# 🔧 Guide de débogage - Problème ajout de slide

## Étapes de débogage :

### 1️⃣ Vérifier que vous êtes admin

**Dans le navigateur (F12 → Console) :**
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Rôle:', user.role);
console.log('Token:', localStorage.getItem('token'));
```

✅ **Résultat attendu :** `role: "admin"` et un token présent

❌ **Si "user" ou "membre" :** Vous devez promouvoir votre compte en admin dans MongoDB

---

### 2️⃣ Vérifier que le backend fonctionne

**Dans PowerShell :**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

✅ **Résultat attendu :** `✅ Backend fonctionnaire`

❌ **Si erreur :** Redémarrer le backend :
```powershell
cd backend
npm run dev
```

---

### 3️⃣ Tester l'API carousel

**Dans PowerShell :**
```powershell
cd backend
node test-carousel-api.js
```

✅ **Résultat attendu :** Slides chargées (même si count: 0)

---

### 4️⃣ Vérifier les logs frontend

**Dans la page Paramètres → Onglet Carrousel :**

1. Sélectionnez une image
2. Cliquez "Ajouter la slide"
3. Ouvrez F12 → Console
4. Cherchez les messages :
   - 📤 Envoi slide
   - 🔑 Token présent
   - 👤 Utilisateur

**Copiez tous les logs ici :**
```
[Collez les logs]
```

---

### 5️⃣ Messages d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `❌ Veuillez sélectionner une image` | Pas d'image | Sélectionnez un fichier image |
| `401 Unauthorized` | Token manquant/invalide | Reconnectez-vous |
| `403 Forbidden` | Pas admin | Promouvoir le compte en admin |
| `Pas de réponse du serveur` | Backend arrêté | `cd backend && npm run dev` |
| `500 Internal Server Error` | Erreur serveur | Vérifier logs backend |

---

### 6️⃣ Promouvoir un utilisateur en admin

**Option A - MongoDB Compass :**
1. Ouvrir MongoDB Compass
2. Se connecter à votre base
3. Collection `users`
4. Trouver votre utilisateur
5. Modifier `role: "admin"`
6. Sauvegarder

**Option B - Ligne de commande :**
```javascript
// Dans MongoDB shell ou Studio 3T
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

---

### 7️⃣ Vérifier les permissions du dossier uploads

**Dans PowerShell :**
```powershell
cd backend
# Créer le dossier si inexistant
New-Item -ItemType Directory -Force -Path uploads
# Vérifier qu'il existe
Test-Path uploads
```

✅ **Résultat attendu :** `True`

---

### 8️⃣ Test manuel avec Postman/Thunder Client

**Requête :**
- **Méthode :** POST
- **URL :** http://localhost:5000/api/carousel
- **Headers :**
  - `Authorization: Bearer VOTRE_TOKEN`
- **Body (form-data) :**
  - `image` : [Fichier]
  - `title` : "Test"
  - `description` : "Test description"
  - `imageSize` : "cover"
  - `page` : "home"
  - `order` : "0"

---

## 🆘 Besoin d'aide ?

Si le problème persiste, fournissez :

1. **Logs console frontend** (F12 → Console)
2. **Logs backend** (Terminal où tourne `npm run dev`)
3. **Votre rôle** : `JSON.parse(localStorage.getItem('user')).role`
4. **Message d'erreur exact**

---

## ✅ Solution rapide si tout échoue

```powershell
# 1. Arrêter tous les processus Node
Get-Process node | Stop-Process -Force

# 2. Redémarrer le backend
cd backend
npm run dev

# 3. Dans un autre terminal, redémarrer le frontend
cd frontend
npm start

# 4. Vider le cache navigateur (Ctrl+Shift+Delete)

# 5. Se reconnecter sur le site
```
