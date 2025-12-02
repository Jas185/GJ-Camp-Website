# 🚀 Passage en Production - PayPal

## ⚠️ IMPORTANT : Changer le Client ID pour la production

### Actuellement (Environnement de TEST - Sandbox)
```env
REACT_APP_PAYPAL_CLIENT_ID=AdT-LwZtwJCWWY-mQxdypz0Ael6KiDY4Puw2QOrgppkh7379iy-cpwsC1a4u9RfSrQC9pqFX-FOFqWTb
```
☝️ Ce Client ID est pour les **tests uniquement** (aucun argent réel)

## 📋 Étapes pour passer en PRODUCTION

### 1. Créer/Configurer l'application en mode Live

1. **Se connecter à PayPal Developer** : https://developer.paypal.com/
2. **Aller dans "My Apps & Credentials"**
3. **Basculer en mode "Live"** (en haut de la page)
4. **Cliquer sur "Create App"** ou sélectionner une app existante
5. **Copier le "Client ID" LIVE** (il sera différent du sandbox)

### 2. Mettre à jour le fichier .env

Dans `frontend/.env`, remplacer par le **Client ID Live** :
```env
REACT_APP_PAYPAL_CLIENT_ID=<VOTRE_CLIENT_ID_LIVE>
```

### 3. Vérifier le compte PayPal Business

**IMPORTANT** : Pour recevoir des paiements en production, vous devez avoir :
- ✅ Un compte **PayPal Business** (pas un compte personnel)
- ✅ Compte **vérifié** (pièce d'identité, coordonnées bancaires)
- ✅ Limites de paiement **levées**

### 4. Tester en production

Avant le lancement officiel :
1. **Faire un test avec un vrai petit montant** (ex: 20€)
2. **Vérifier que le paiement arrive** sur le compte PayPal Business
3. **Vérifier que l'inscription est bien enregistrée** dans MongoDB

### 5. Rebuilder et déployer

```bash
cd frontend
npm run build
```

Déployer le dossier `build/` sur votre serveur de production.

## 🔐 Sécurité

### Variables d'environnement selon l'environnement

#### Développement (local)
```env
# frontend/.env
REACT_APP_PAYPAL_CLIENT_ID=<CLIENT_ID_SANDBOX>
```

#### Production (serveur)
```env
# Sur le serveur de production
REACT_APP_PAYPAL_CLIENT_ID=<CLIENT_ID_LIVE>
```

### Secret PayPal (si vous utilisez des appels backend)

Si vous devez faire des appels API PayPal côté serveur :

**Backend .env** :
```env
PAYPAL_CLIENT_ID=<CLIENT_ID_LIVE>
PAYPAL_SECRET=<SECRET_LIVE>
PAYPAL_MODE=live
```

⚠️ **Ne JAMAIS exposer le Secret dans le frontend**

## 📊 Tableau récapitulatif

| Environnement | Client ID | Paiements | Compte PayPal |
|---------------|-----------|-----------|---------------|
| **Sandbox (Test)** | AdT-LwZtwJCWWY... | Simulés (argent fictif) | Comptes sandbox |
| **Live (Production)** | <votre_client_id_live> | Réels | Compte Business vérifié |

## ✅ Checklist avant mise en production

- [ ] Compte PayPal Business créé et vérifié
- [ ] Application créée en mode Live sur PayPal Developer
- [ ] Client ID Live récupéré
- [ ] Fichier `frontend/.env` mis à jour avec le Client ID Live
- [ ] Frontend rebuilder (`npm run build`)
- [ ] Test de paiement réel effectué (petit montant)
- [ ] Vérification que les paiements arrivent sur le bon compte
- [ ] Vérification que les inscriptions sont enregistrées

## 🆘 Support

Si vous rencontrez des problèmes :
- **Documentation PayPal** : https://developer.paypal.com/docs/
- **Support PayPal** : https://www.paypal.com/smarthelp/contact-us

## 💡 Conseil

Gardez l'environnement sandbox configuré sur une branche Git séparée ou un fichier `.env.local` pour pouvoir tester facilement sans toucher à la production.

---

**Résumé** : Pour passer en production, il suffit de remplacer le Client ID sandbox par le Client ID live dans le fichier `.env` et de rebuilder le frontend. C'est tout ! 🚀
