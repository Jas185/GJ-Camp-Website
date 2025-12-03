# 🐳 Guide de Déploiement Docker - GJ Camp

## Vue d'ensemble

L'application GJ Camp est maintenant entièrement dockerisée avec :
- **Backend** : Node.js + Express (port 5000)
- **Frontend** : React + Nginx (port 80/443)
- **Base de données** : MongoDB 7.0 (port 27017)

## 📋 Prérequis

- Docker Desktop (Windows/Mac) ou Docker Engine (Linux)
- Docker Compose v2.0+
- 4 GB RAM minimum
- 10 GB espace disque

## 🚀 Démarrage rapide

### 1. Configuration initiale

```bash
# Copier le fichier d'environnement
cp .env.docker.example .env.docker

# Éditer les variables (IMPORTANT!)
# Modifier au minimum:
# - MONGO_ROOT_PASSWORD
# - JWT_SECRET
notepad .env.docker  # Windows
nano .env.docker     # Linux/Mac
```

### 2. Lancer l'application

```bash
# Build et démarrage de tous les services
docker-compose --env-file .env.docker up -d --build

# Vérifier que tout fonctionne
docker-compose ps
```

### 3. Accéder à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:5000
- **MongoDB** : localhost:27017

## 📦 Architecture des conteneurs

```
┌─────────────────────────────────────────┐
│          Navigateur Web                 │
└────────────────┬────────────────────────┘
                 │ HTTP (Port 80)
┌────────────────▼────────────────────────┐
│   Frontend (Nginx + React Build)        │
│   - Sert les fichiers statiques         │
│   - Proxy /api → backend                │
└────────────────┬────────────────────────┘
                 │ HTTP (Port 5000)
┌────────────────▼────────────────────────┐
│   Backend (Node.js + Express)           │
│   - API REST                            │
│   - Authentification JWT                │
│   - Gestion RGPD                        │
└────────────────┬────────────────────────┘
                 │ MongoDB Protocol
┌────────────────▼────────────────────────┐
│   MongoDB 7.0                           │
│   - Base de données                     │
│   - Volumes persistants                 │
└─────────────────────────────────────────┘
```

## 🔧 Commandes utiles

### Gestion des services

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart backend

# Voir les logs
docker-compose logs -f
docker-compose logs -f backend  # Logs backend uniquement
docker-compose logs -f frontend # Logs frontend uniquement

# État des conteneurs
docker-compose ps

# Statistiques d'utilisation
docker stats
```

### Build et rebuild

```bash
# Rebuild après modification du code
docker-compose up -d --build

# Rebuild un service spécifique
docker-compose build backend
docker-compose up -d backend

# Rebuild sans cache
docker-compose build --no-cache
```

### Accès aux conteneurs

```bash
# Shell dans le backend
docker-compose exec backend sh

# Shell dans MongoDB
docker-compose exec mongodb mongosh -u admin -p

# Shell dans le frontend (Nginx)
docker-compose exec frontend sh
```

### Nettoyage

```bash
# Arrêter et supprimer les conteneurs (garde les volumes)
docker-compose down

# Supprimer conteneurs + volumes (ATTENTION: perte de données!)
docker-compose down -v

# Nettoyer les images non utilisées
docker system prune -a

# Nettoyer tout (conteneurs, images, volumes)
docker system prune -a --volumes
```

## 📊 Volumes et données persistantes

Les données sont stockées dans des volumes Docker :

```bash
# Lister les volumes
docker volume ls | grep gj-camp

# Inspecter un volume
docker volume inspect gj-camp-website_mongodb_data

# Backup de MongoDB
docker-compose exec mongodb mongodump --out /data/backup
docker cp gj-camp-mongodb:/data/backup ./backup

# Restore de MongoDB
docker cp ./backup gj-camp-mongodb:/data/restore
docker-compose exec mongodb mongorestore /data/restore
```

## 🔒 Sécurité en production

### Fichier .env.docker pour production

```env
# MongoDB - Mot de passe FORT
MONGO_ROOT_PASSWORD=VotreMotDePasseTresSecurise123!@#

# JWT - Secret unique et complexe
JWT_SECRET=votre_secret_jwt_unique_genere_avec_openssl_rand_base64_32

# URLs de production
FRONTEND_URL=https://votre-domaine.fr
REACT_APP_API_URL=https://api.votre-domaine.fr

# Email - Configuration réelle
EMAIL_SERVICE=brevo
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=votre_email@brevo.com
EMAIL_PASSWORD=votre_mot_de_passe_brevo
EMAIL_FROM=noreply@votre-domaine.fr

# RGPD
DPO_EMAIL=dpo@votre-domaine.fr
CONTACT_EMAIL=contact@votre-domaine.fr
```

### Recommandations

- ✅ Changer TOUS les mots de passe par défaut
- ✅ Activer HTTPS avec Let's Encrypt
- ✅ Configurer un firewall
- ✅ Limiter l'accès MongoDB (ne pas exposer le port 27017 en production)
- ✅ Utiliser des secrets Docker pour les données sensibles
- ✅ Mettre en place des sauvegardes automatiques

## 🌐 Configuration HTTPS avec Let's Encrypt

### Mise à jour du docker-compose.yml

Ajouter un service Certbot :

```yaml
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

### Obtenir le certificat

```bash
# Première fois
docker-compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d votre-domaine.fr \
  -d www.votre-domaine.fr \
  --email votre@email.fr \
  --agree-tos
```

## 📈 Monitoring et logs

### Logs applicatifs

```bash
# Suivre les logs en temps réel
docker-compose logs -f --tail=100

# Logs avec timestamp
docker-compose logs -f -t

# Logs d'un service sur les dernières 24h
docker-compose logs --since 24h backend
```

### Health checks

Tous les services ont des health checks configurés :

```bash
# Vérifier la santé des services
docker-compose ps

# Détails du health check
docker inspect gj-camp-backend | grep -A 10 Health
```

## 🔄 Mise à jour de l'application

### Déploiement d'une nouvelle version

```bash
# 1. Récupérer les derniers changements
git pull

# 2. Rebuild les images
docker-compose build

# 3. Redémarrer avec les nouvelles images (sans downtime)
docker-compose up -d

# 4. Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f --tail=50
```

### Rollback en cas de problème

```bash
# Revenir à la version précédente du code
git checkout HEAD~1

# Rebuild et redémarrer
docker-compose up -d --build
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Problèmes communs:
# - MongoDB pas prêt → attendre ou vérifier healthcheck
# - Variables d'environnement manquantes → vérifier .env.docker
# - Port 5000 déjà utilisé → arrêter l'autre processus
```

### MongoDB ne se connecte pas

```bash
# Vérifier que MongoDB est démarré
docker-compose ps mongodb

# Tester la connexion
docker-compose exec mongodb mongosh -u admin -p

# Vérifier les logs
docker-compose logs mongodb
```

### Frontend affiche une page blanche

```bash
# Vérifier les logs Nginx
docker-compose logs frontend

# Vérifier que le build s'est bien passé
docker-compose exec frontend ls /usr/share/nginx/html

# Rebuild le frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Espace disque saturé

```bash
# Nettoyer les images inutilisées
docker system prune -a

# Voir l'espace utilisé
docker system df

# Supprimer les volumes non utilisés (ATTENTION!)
docker volume prune
```

## 📝 Script de nettoyage RGPD avec Docker

```bash
# Exécuter le script de nettoyage RGPD
docker-compose exec backend node scripts/dataRetentionCleanup.js

# Configurer un cron dans le conteneur backend
docker-compose exec backend sh -c 'echo "0 2 * * * node /app/scripts/dataRetentionCleanup.js" | crontab -'
```

## 🚢 Déploiement en production

### Sur un VPS / Serveur dédié

```bash
# 1. Installer Docker et Docker Compose sur le serveur
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Cloner le repository
git clone https://github.com/Jas185/GJ-Camp-Website.git
cd GJ-Camp-Website

# 3. Configurer l'environnement
cp .env.docker.example .env.docker
nano .env.docker  # Configurer pour la production

# 4. Lancer l'application
docker-compose --env-file .env.docker up -d --build

# 5. Configurer le firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 📊 Checklist de déploiement

- [ ] Variables d'environnement configurées (.env.docker)
- [ ] Mots de passe forts pour MongoDB et JWT
- [ ] HTTPS configuré avec certificat SSL
- [ ] Firewall activé et configuré
- [ ] Sauvegardes automatiques de MongoDB configurées
- [ ] Monitoring des logs configuré
- [ ] Health checks validés
- [ ] Email de production configuré (Brevo/SendGrid)
- [ ] Cron job RGPD configuré
- [ ] Tests effectués en environnement de staging

## 🆘 Support

En cas de problème :

1. Consulter les logs : `docker-compose logs -f`
2. Vérifier les health checks : `docker-compose ps`
3. Tester chaque service individuellement
4. Consulter la documentation Docker : https://docs.docker.com

---

**Version Docker** : 1.0  
**Date** : 28 novembre 2025  
**Compatibilité** : Docker Engine 20.10+, Docker Compose v2.0+
