# 🚀 Guide de Déploiement - GJ Camp

## 📌 Déploiement sur Railway (Recommandé)

Railway est une plateforme moderne qui simplifie le déploiement d'applications Docker.

### Étape 1 : Préparation

1. **Compte GitHub**
   - Assurez-vous que votre code est sur GitHub
   - Repository : https://github.com/Jas185/GJ-Camp-Website

2. **Pousser les derniers changements**
   ```bash
   git add .
   git commit -m "Prêt pour le déploiement"
   git push origin main
   ```

### Étape 2 : Créer un compte Railway

1. Allez sur https://railway.app
2. Cliquez sur "Start a New Project"
3. Connectez-vous avec GitHub
4. Autorisez Railway à accéder à vos repositories

### Étape 3 : Déployer MongoDB

1. **Nouveau Projet** → "Deploy MongoDB"
2. Railway créera automatiquement une base MongoDB
3. **Notez les variables d'environnement** :
   - `MONGO_URL` (sera générée automatiquement)

### Étape 4 : Déployer le Backend

1. **Add Service** → "GitHub Repo"
2. Sélectionnez `GJ-Camp-Website`
3. **Root Directory** : `/backend`
4. Railway détectera automatiquement le Dockerfile

**Variables d'environnement à configurer** :
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_ici
FRONTEND_URL=https://votre-domaine.com

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=gjcontactgj0@gmail.com
EMAIL_PASSWORD=eofu vfga tjxe xibi
EMAIL_FROM=gjcontactgj0@gmail.com

DPO_EMAIL=dpo@gj-camp.fr
CONTACT_EMAIL=contact@gj-camp.fr
```

5. Cliquez sur "Deploy"
6. Railway générera une URL : `https://backend-xxxx.railway.app`

### Étape 5 : Déployer le Frontend

1. **Add Service** → "GitHub Repo"
2. Sélectionnez `GJ-Camp-Website`
3. **Root Directory** : `/frontend`
4. **Dockerfile** : `Dockerfile.frontend`

**Variables d'environnement** :
```env
REACT_APP_API_URL=https://backend-xxxx.railway.app
```

5. Cliquez sur "Deploy"
6. Railway générera une URL : `https://frontend-xxxx.railway.app`

### Étape 6 : Configurer le CORS

Mettez à jour la variable `FRONTEND_URL` du backend avec l'URL du frontend :
```env
FRONTEND_URL=https://frontend-xxxx.railway.app
```

### Étape 7 : Créer un compte Admin

1. Connectez-vous à la base MongoDB Railway
2. Utilisez Railway CLI ou MongoDB Compass
3. Exécutez le script createAdmin.js

---

## 📌 Déploiement sur Render

### Étape 1 : Créer un compte

1. Allez sur https://render.com
2. Connectez-vous avec GitHub

### Étape 2 : Déployer MongoDB

1. **New** → "PostgreSQL" (gratuit) OU utilisez MongoDB Atlas
2. Pour MongoDB Atlas :
   - Créez un cluster gratuit sur https://cloud.mongodb.com
   - Whitelist IP : `0.0.0.0/0`
   - Copiez l'URI de connexion

### Étape 3 : Déployer le Backend

1. **New** → "Web Service"
2. Connectez le repo GitHub
3. Configuration :
   - **Name** : gj-camp-backend
   - **Environment** : Docker
   - **Dockerfile Path** : Dockerfile.backend
   - **Docker Context** : .

**Variables d'environnement** : (mêmes que Railway)

### Étape 4 : Déployer le Frontend

1. **New** → "Static Site"
2. Configuration :
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`

**Variables d'environnement** :
```env
REACT_APP_API_URL=https://gj-camp-backend.onrender.com
```

---

## 📌 Déploiement sur VPS (DigitalOcean / Linode)

### Étape 1 : Créer un Droplet

1. Créez un compte sur https://digitalocean.com
2. Créez un Droplet Ubuntu 22.04 (5$/mois minimum)
3. Notez l'adresse IP

### Étape 2 : Installer Docker

Connectez-vous via SSH :
```bash
ssh root@VOTRE_IP
```

Installez Docker :
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Installez Docker Compose :
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Étape 3 : Cloner le projet

```bash
git clone https://github.com/Jas185/GJ-Camp-Website.git
cd GJ-Camp-Website
```

### Étape 4 : Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

Modifiez les valeurs de production.

### Étape 5 : Lancer l'application

```bash
docker-compose up -d
```

### Étape 6 : Configurer Nginx + HTTPS

Installez Certbot pour SSL gratuit :
```bash
apt update
apt install nginx certbot python3-certbot-nginx -y
```

Configurez Nginx :
```bash
nano /etc/nginx/sites-available/gj-camp
```

Contenu :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez le site :
```bash
ln -s /etc/nginx/sites-available/gj-camp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

Obtenez un certificat SSL :
```bash
certbot --nginx -d votre-domaine.com
```

---

## 📌 Configuration du Nom de Domaine

### Acheter un domaine

1. **Namecheap** : https://namecheap.com (~10€/an)
2. **OVH** : https://ovh.com
3. **Google Domains** : https://domains.google

### Configurer les DNS

Ajoutez un enregistrement A :
```
Type: A
Host: @
Value: VOTRE_IP_SERVEUR
TTL: Automatic
```

Pour un sous-domaine (www) :
```
Type: CNAME
Host: www
Value: votre-domaine.com
TTL: Automatic
```

---

## 🔒 Sécurité en Production

### Checklist

- ✅ Changez tous les mots de passe par défaut
- ✅ Utilisez des secrets JWT complexes (min 32 caractères)
- ✅ Activez HTTPS obligatoire
- ✅ Configurez un firewall
- ✅ Limitez l'accès MongoDB (pas 0.0.0.0/0 en production)
- ✅ Activez les backups automatiques
- ✅ Configurez les logs
- ✅ Testez la récupération après erreur

### Variables sensibles

Générer un JWT secret sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 💰 Coûts estimés

| Service | Coût | Recommandation |
|---------|------|----------------|
| **Railway** | Gratuit puis ~5$/mois | ⭐ Meilleur pour débuter |
| **Render** | Gratuit (limité) | ⭐ Bon pour prototypes |
| **VPS DigitalOcean** | 5-10$/mois | ⭐⭐ Bon pour production |
| **Domaine** | ~10€/an | Tous |
| **MongoDB Atlas** | Gratuit 512MB | ⭐ Recommandé |

---

## 🆘 Support et Dépannage

### Logs

**Railway** : Cliquez sur le service → Onglet "Logs"
**Render** : Service → "Logs"
**VPS** : `docker-compose logs -f`

### Problèmes communs

**Backend ne démarre pas**
- Vérifiez les variables d'environnement
- Vérifiez la connexion MongoDB
- Regardez les logs

**Frontend ne charge pas**
- Vérifiez REACT_APP_API_URL
- Vérifiez le CORS du backend
- Regardez la console navigateur (F12)

**Erreur CORS**
- Mettez à jour FRONTEND_URL dans le backend
- Redéployez le backend

---

**Quelle option préférez-vous ? Je peux vous guider étape par étape !** 🚀
