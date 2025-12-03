# 🎨 Charte Graphique - Site GJ Camp

## 📐 Document de référence pour le design du site

---

## 🎯 Palette de couleurs

### Couleurs principales
```css
/* Rouge principal (GJ Red) */
--color-primary: #a01e1e;
--color-primary-light: #e74c3c;
--color-primary-dark: #7a1515;

/* Or/Doré (GJ Gold) */
--color-secondary: #d4af37;
--color-gold-light: #f3d87c;
--color-gold-dark: #b8942a;

/* Bleu marine (Header/Footer) */
--color-navy: #001a4d;
--color-navy-light: #3b5998;
--color-navy-dark: #000d26;
```

### Couleurs secondaires
```css
/* Fond et conteneurs */
--bg-white: #ffffff;
--bg-light: #f8f9fa;
--bg-cream: #fffaf0;

/* Texte */
--text-primary: #333333;
--text-secondary: #666666;
--text-light: #999999;

/* Bordures et séparateurs */
--border-color: #e0e0e0;
--border-light: #f0f0f0;
```

### Couleurs de statut
```css
/* Succès */
--success: #28a745;
--success-light: #20c997;

/* Attention */
--warning: #ffc107;
--warning-light: #fff3cd;

/* Erreur */
--error: #dc3545;
--error-light: #ff3366;

/* Info */
--info: #17a2b8;
--info-light: #5bc0de;
```

---

## 📝 Typographie

### Familles de polices
```css
/* Police principale (Interface) */
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Police alternative (Titres) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Police monospace (Code) */
font-family: 'Courier New', Courier, monospace;
```

### Tailles de police

#### Titres (Headings)
```css
h1 {
  font-size: 2.3rem;        /* 36.8px */
  font-weight: 800;
  line-height: 1.2;
  color: #764ba2;           /* Titre principal gradient */
}

h2 {
  font-size: 1.8rem;        /* 28.8px */
  font-weight: 700;
  line-height: 1.3;
  color: #001a4d;
}

h3 {
  font-size: 1.4rem;        /* 22.4px */
  font-weight: 600;
  line-height: 1.4;
  color: #3b5998;
}

h4 {
  font-size: 1.2rem;        /* 19.2px */
  font-weight: 600;
  line-height: 1.4;
}

h5 {
  font-size: 1rem;          /* 16px */
  font-weight: 600;
}

h6 {
  font-size: 0.875rem;      /* 14px */
  font-weight: 600;
}
```

#### Texte courant
```css
/* Texte normal */
body {
  font-size: 1rem;          /* 16px - Base */
  line-height: 1.6;
}

/* Texte large */
.text-lg {
  font-size: 1.125rem;      /* 18px */
}

/* Texte petit */
.text-sm {
  font-size: 0.875rem;      /* 14px */
}

/* Texte très petit */
.text-xs {
  font-size: 0.75rem;       /* 12px */
}
```

#### Navigation & Boutons
```css
/* Menu navigation */
.nav-menu a {
  font-size: 0.8rem;        /* 12.8px */
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Boutons */
button, .btn {
  font-size: 0.9rem;        /* 14.4px */
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Petits boutons */
.btn-sm {
  font-size: 0.75rem;       /* 12px */
  padding: 0.5rem 1rem;
}

/* Grands boutons */
.btn-lg {
  font-size: 1rem;          /* 16px */
  padding: 0.875rem 2rem;
}
```

---

## 🖼️ Composants UI

### 1. Carrousel (Homepage)

#### Dimensions
```css
.carousel {
  height: 520px;            /* Desktop */
  max-width: 100vw;
}

/* Responsive */
@media (max-width: 768px) {
  .carousel {
    height: 380px;          /* Tablet */
  }
}

@media (max-width: 480px) {
  .carousel {
    height: 280px;          /* Mobile */
  }
}
```

#### Animations
```css
/* Transition entre slides */
transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);

/* Animation slideInPush */
@keyframes slideInPush {
  0% {
    transform: translateX(100%) scale(0.9);
    filter: brightness(0.7);
  }
  50% {
    transform: translateX(0) scale(1.05);
    filter: brightness(1.25);
  }
  100% {
    transform: translateX(0) scale(1);
    filter: brightness(1.18);
  }
}
```

#### Indicateurs
```css
.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #d4af37;      /* Or pour actif */
  opacity: 1;
  transform: scale(1.3);
}
```

### 2. Cartes (Cards)

```css
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

### 3. Boutons

#### Bouton Principal
```css
.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #f3d87c 100%);
  color: #102347;
  border: none;
  padding: 11px 26px;
  border-radius: 999px;     /* Complètement arrondi */
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 8px 18px rgba(212, 175, 55, 0.35);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(212, 175, 55, 0.4);
}
```

#### Bouton Secondaire
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 24px;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}
```

#### Bouton Danger
```css
.btn-danger {
  background: linear-gradient(135deg, #a01e1e 0%, #d4283c 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(160, 30, 30, 0.3);
}
```

### 4. Badges & Pills

```css
/* Badge de notification */
.badge {
  background: linear-gradient(135deg, #ff3366 0%, #ff5555 100%);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 5px;
  box-shadow: 0 2px 6px rgba(255, 51, 102, 0.4);
}

/* Animation pulse */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(255, 51, 102, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 3px 10px rgba(255, 51, 102, 0.6);
  }
}
```

### 5. Formulaires

```css
/* Input standard */
input[type="text"],
input[type="email"],
input[type="password"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #a01e1e;
  box-shadow: 0 0 0 3px rgba(160, 30, 30, 0.1);
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
/* Extra small devices (phones, <576px) */
@media (max-width: 575.98px) { }

/* Small devices (landscape phones, <768px) */
@media (max-width: 767.98px) { }

/* Medium devices (tablets, <992px) */
@media (max-width: 991.98px) { }

/* Large devices (desktops, <1200px) */
@media (max-width: 1199.98px) { }

/* Extra large devices (large desktops, >=1200px) */
@media (min-width: 1200px) { }
```

### Grid & Spacing
```css
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Espacement vertical */
.section {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .section {
    padding: 40px 0;
  }
}
```

---

## 🎭 Animations & Transitions

### Durées standards
```css
--transition-fast: 0.15s;
--transition-normal: 0.3s;
--transition-slow: 0.5s;

/* Courbes d'accélération */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Effets communs
```css
/* Hover lift */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale on hover */
.scale-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
```

---

## 🔤 Texte & Contenu

### Alignement
```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### Poids de police
```css
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
```

### Espacement des lettres
```css
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
```

---

## 🖼️ Images & Médias

### Tailles recommandées
```
Logo: 64x64px (rond avec border)
Photo profil: 150x150px minimum
Image carrousel: 1920x520px
Image activité: 800x450px
Bannière: 1200x400px
Icône: 24x24px ou 28x28px
```

### Optimisation
```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Lazy loading */
img[loading="lazy"] {
  opacity: 0;
  transition: opacity 0.3s;
}

img[loading="lazy"].loaded {
  opacity: 1;
}
```

---

## 📊 Tableaux

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th {
  background: linear-gradient(135deg, #a01e1e 0%, #d4283c 100%);
  color: white;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 10px 8px;
  border-bottom: 1px solid #e0e0e0;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #fff3cd;
}
```

---

## ✨ Effets spéciaux

### Ombres (Box Shadow)
```css
/* Légère */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

/* Normale */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Moyenne */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Forte */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Or lumineux */
box-shadow: 0 8px 18px rgba(212, 175, 55, 0.35);
```

### Dégradés (Gradients)
```css
/* Rouge GJ */
background: linear-gradient(135deg, #a01e1e 0%, #d4283c 100%);

/* Or GJ */
background: linear-gradient(135deg, #d4af37 0%, #f3d87c 100%);

/* Bleu marine */
background: linear-gradient(180deg, #001a4d 0%, #000d26 100%);

/* Overlay subtil */
background: linear-gradient(90deg, 
  rgba(212, 175, 55, 0.2) 0%, 
  rgba(239, 91, 135, 0.18) 100%);
```

### Backdrop Filter
```css
/* Effet glassmorphism */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 🔒 Bonnes pratiques

### Accessibilité
- ✅ Contraste minimum 4.5:1 pour texte normal
- ✅ Contraste minimum 3:1 pour texte large
- ✅ Focus visible sur tous les éléments interactifs
- ✅ Texte alternatif sur toutes les images
- ✅ Navigation au clavier fonctionnelle

### Performance
- ✅ Utiliser `will-change` pour animations fréquentes
- ✅ Lazy loading pour images hors viewport
- ✅ Minimiser les reflows/repaints
- ✅ Préférer transforms et opacity pour animations

### Cohérence
- ✅ Espacements multiples de 4px (4, 8, 12, 16, 24, 32, 48, 64)
- ✅ Border-radius cohérents (4px, 8px, 12px, 24px, 50%)
- ✅ Palette de couleurs limitée
- ✅ Typographie hiérarchisée

---

## 📋 Checklist Design

### Avant validation d'une page
- [ ] Palette de couleurs respectée
- [ ] Typographie cohérente
- [ ] Espacements multiples de 4px
- [ ] Responsive testé (Mobile/Tablet/Desktop)
- [ ] Animations fluides (<300ms)
- [ ] Accessibilité validée
- [ ] Performance optimisée
- [ ] États hover/focus/active définis
- [ ] Messages d'erreur en français
- [ ] Loading states implémentés

---

**Version**: 1.0  
**Dernière mise à jour**: 2 décembre 2025  
**Auteur**: Équipe GJ Camp

---

## 🚀 Features Modernes Avancées

### Dark Mode / Mode Sombre

#### Variables CSS pour thème dual
```css
:root {
  /* Light mode (défaut) */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark mode */
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #eaeaea;
  --text-secondary: #b0b0b0;
  --border-color: #2d3748;
  --shadow-color: rgba(0, 0, 0, 0.4);
  
  /* Couleurs GJ ajustées pour dark mode */
  --color-primary: #e74c3c;
  --color-secondary: #f3d87c;
}

/* Toggle dark mode */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 60px;
  height: 32px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

---

### Micro-interactions & Animations Avancées

#### Skeleton Loading (Chargement)
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton pour différents éléments */
.skeleton-text {
  height: 16px;
  margin: 8px 0;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-card {
  height: 200px;
  border-radius: 12px;
}
```

#### Ripple Effect (Effet d'ondulation)
```css
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}
```

#### Parallax Scrolling
```css
.parallax-container {
  position: relative;
  overflow: hidden;
  height: 500px;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background-size: cover;
  background-position: center;
  transform: translateY(calc(var(--scroll) * 0.5px));
  will-change: transform;
}

/* JavaScript requis pour update --scroll */
```

#### Morphing Shapes (Formes morphing)
```css
.morphing-blob {
  background: linear-gradient(135deg, #d4af37, #f3d87c);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 8s ease-in-out infinite;
  filter: blur(40px);
  opacity: 0.7;
}

@keyframes morph {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
  }
}
```

---

### Effets de texte avancés

#### Text Gradient
```css
.gradient-text {
  background: linear-gradient(135deg, #a01e1e 0%, #d4af37 50%, #e74c3c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 3rem;
}
```

#### Text Glow
```css
.glow-text {
  color: #fff;
  text-shadow: 
    0 0 10px rgba(212, 175, 55, 0.8),
    0 0 20px rgba(212, 175, 55, 0.6),
    0 0 30px rgba(212, 175, 55, 0.4),
    0 0 40px rgba(212, 175, 55, 0.2);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.8); }
  50% { text-shadow: 0 0 20px rgba(212, 175, 55, 1); }
}
```

#### Typing Animation
```css
.typing-effect {
  overflow: hidden;
  border-right: 3px solid #d4af37;
  white-space: nowrap;
  animation: 
    typing 3.5s steps(40, end),
    blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #d4af37; }
}
```

---

### Effets de survol avancés

#### 3D Card Flip
```css
.flip-card {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.flip-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #a01e1e, #d4283c);
}
```

#### Tilt Effect (Inclinaison 3D)
```css
.tilt-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.tilt-card:hover {
  transform: 
    perspective(1000px)
    rotateX(var(--rotate-x, 0deg))
    rotateY(var(--rotate-y, 0deg))
    scale3d(1.05, 1.05, 1.05);
}

/* JavaScript requis pour calculer --rotate-x et --rotate-y */
```

#### Magnetic Button (Bouton magnétique)
```css
.magnetic-btn {
  position: relative;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.magnetic-btn:hover {
  transform: translate(var(--x, 0), var(--y, 0)) scale(1.1);
}

/* JavaScript pour calculer --x et --y selon position souris */
```

---

### Glassmorphism & Neumorphism

#### Glassmorphism (Effet verre)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.glass-card-dark {
  background: rgba(26, 26, 46, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Neumorphism (Soft UI)
```css
.neomorph-card {
  background: #f0f0f0;
  border-radius: 20px;
  box-shadow: 
    12px 12px 24px #d1d1d1,
    -12px -12px 24px #ffffff;
  padding: 2rem;
}

.neomorph-card:hover {
  box-shadow: 
    inset 12px 12px 24px #d1d1d1,
    inset -12px -12px 24px #ffffff;
}

.neomorph-button {
  background: #f0f0f0;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  box-shadow: 
    6px 6px 12px #d1d1d1,
    -6px -6px 12px #ffffff;
  transition: all 0.3s ease;
}

.neomorph-button:active {
  box-shadow: 
    inset 6px 6px 12px #d1d1d1,
    inset -6px -6px 12px #ffffff;
}
```

---

### Scroll Animations

#### Scroll-triggered Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: 
    opacity 0.8s cubic-bezier(0.5, 0, 0, 1),
    transform 0.8s cubic-bezier(0.5, 0, 0, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* Variations */
.reveal-left {
  transform: translateX(-50px);
}

.reveal-right {
  transform: translateX(50px);
}

.reveal-scale {
  transform: scale(0.8);
}
```

#### Progress Bar Scroll
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 4px;
  background: linear-gradient(90deg, #a01e1e, #d4af37);
  z-index: 9999;
  transition: width 0.1s ease;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
}
```

#### Sticky Header with Blur
```css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.sticky-header.scrolled {
  background: rgba(0, 26, 77, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

---

### Notifications & Toasts Modernes

#### Toast Notification
```css
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3s forwards;
  z-index: 10000;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(400px);
  }
}

.toast-success {
  border-left: 4px solid #28a745;
}

.toast-error {
  border-left: 4px solid #dc3545;
}

.toast-warning {
  border-left: 4px solid #ffc107;
}

.toast-info {
  border-left: 4px solid #17a2b8;
}
```

#### Snackbar
```css
.snackbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: #323232;
  color: white;
  padding: 14px 24px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10000;
}

.snackbar.active {
  transform: translateX(-50%) translateY(0);
}
```

---

### Loading States Modernes

#### Spinner avec gradient
```css
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(212, 175, 55, 0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-gradient {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    #d4af37 360deg
  );
  mask: radial-gradient(
    circle,
    transparent 60%,
    black 60%
  );
}
```

#### Dots Loading
```css
.dots-loading {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  background: #d4af37;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

#### Progress Circle
```css
.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-circle circle {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
}

.progress-bg {
  stroke: #e0e0e0;
}

.progress-bar {
  stroke: #d4af37;
  stroke-dasharray: 283;
  stroke-dashoffset: calc(283 - (283 * var(--progress)) / 100);
  transition: stroke-dashoffset 0.5s ease;
}
```

---

### Filtres & Effets d'image

#### Filtres CSS avancés
```css
/* Vintage */
.filter-vintage {
  filter: 
    sepia(50%)
    contrast(1.2)
    brightness(0.9)
    saturate(1.5);
}

/* Dramatic */
.filter-dramatic {
  filter: 
    contrast(1.5)
    brightness(0.9)
    saturate(1.3)
    drop-shadow(0 10px 20px rgba(0,0,0,0.4));
}

/* Noir et blanc avec accent couleur */
.filter-noir-accent {
  filter: grayscale(100%);
  position: relative;
}

.filter-noir-accent::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(160, 30, 30, 0.3),
    rgba(212, 175, 55, 0.3)
  );
  mix-blend-mode: color;
}
```

#### Hover Image Overlay
```css
.image-overlay-container {
  position: relative;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(160, 30, 30, 0.9),
    rgba(212, 175, 55, 0.9)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.image-overlay-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay-container:hover img {
  transform: scale(1.1);
  filter: blur(2px);
  transition: all 0.4s ease;
}
```

---

### Menu & Navigation Modernes

#### Mega Menu
```css
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

.nav-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

#### Circular Menu (Radial)
```css
.circular-menu {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
}

.menu-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a01e1e, #d4af37);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.menu-items {
  position: absolute;
  bottom: 70px;
  right: 0;
}

.menu-item {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.circular-menu.active .menu-item:nth-child(1) {
  transform: translateY(-80px) scale(1);
}

.circular-menu.active .menu-item:nth-child(2) {
  transform: translate(-60px, -60px) scale(1);
  transition-delay: 0.05s;
}

.circular-menu.active .menu-item:nth-child(3) {
  transform: translateX(-80px) scale(1);
  transition-delay: 0.1s;
}
```

#### Breadcrumbs Modernes
```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #a01e1e;
}

.breadcrumb-item.active {
  color: #a01e1e;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #ccc;
}

/* Version avec background */
.breadcrumbs-modern {
  background: linear-gradient(90deg, 
    rgba(212, 175, 55, 0.1) 0%,
    transparent 100%
  );
  border-left: 3px solid #d4af37;
  padding: 12px 20px;
  border-radius: 4px;
}
```

---

### Tooltips & Popovers Avancés

#### Tooltip moderne
```css
.tooltip {
  position: relative;
  cursor: help;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  background: #1a1a2e;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #1a1a2e;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tooltip:hover::before {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.tooltip:hover::after {
  opacity: 1;
}
```

---

### Variables CSS personnalisables

```css
:root {
  /* Spacing system */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.25);
  
  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-notification: 1080;
}
```

---

## 📊 Performance & Optimization

### Lazy Loading Images
```html
<img 
  src="placeholder.jpg" 
  data-src="image.jpg" 
  loading="lazy"
  class="lazy-image"
  alt="Description"
/>
```

```css
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}
```

### Critical CSS
```css
/* Above-the-fold (Critical CSS) */
.header,
.hero,
.nav-menu {
  /* Styles critiques inline */
}

/* Below-the-fold (Deferred) */
.footer,
.comments,
.related-posts {
  /* Chargé de manière asynchrone */
}
```

### GPU Acceleration
```css
.accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}
```

---

## 🎮 Interactions Gestuelles (Mobile)

### Swipe Gesture
```css
.swipeable {
  touch-action: pan-y;
  user-select: none;
}

.swipeable.swiping {
  transform: translateX(var(--swipe-distance));
  transition: none;
}

.swipeable.snap {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Pull to Refresh
```css
.pull-to-refresh {
  position: relative;
}

.refresh-indicator {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%) scale(var(--pull-scale, 0));
  transition: transform 0.3s ease;
}

.pulling .refresh-indicator {
  --pull-scale: 1;
}
```

---

**Fin des features modernes avancées** ✨
