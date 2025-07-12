# 🎾 Royal Tennis Club de Fès - Frontend

[![Ionic](https://img.shields.io/badge/Ionic-8.0.0-blue.svg)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-yellow.svg)](#license)

Application mobile et web moderne pour la gestion complète du Royal Tennis Club de Fès. Interface utilisateur intuitive développée avec Ionic et Angular pour offrir une expérience premium aux membres du club.

## 📱 Aperçu

Cette application frontend offre une interface complète pour :
- **Membres** : Réservation de courts, participation aux événements, suivi des activités
- **Personnel** : Gestion des réservations, administration des membres
- **Administrateurs** : Tableau de bord complet, statistiques, gestion globale

## ✨ Fonctionnalités Principales

### 🏠 **Accueil & Navigation**
- Page d'accueil élégante avec présentation du club
- Menu de navigation intuitif avec sidebar responsive
- Interface multilingue (Français, Anglais, Arabe)
- Thème royal avec design premium

### 👤 **Gestion des Utilisateurs**
- Inscription et connexion sécurisées
- Profils utilisateur personnalisables
- Gestion des rôles (Adhérent, Personnel, Admin)
- Récupération de mot de passe

### 📅 **Système de Réservation**
- Réservation de courts en temps réel
- Sélection d'activités et créneaux horaires
- Confirmation et historique des réservations
- Système de paiement intégré (Stripe)

### 🏆 **Événements & Activités**
- Calendrier des événements du club
- Inscription aux tournois et activités
- Historique de participation
- Système de récompenses et points de fidélité

### 📊 **Tableau de Bord Administratif**
- Gestion des utilisateurs et adhérents
- Administration des activités et installations
- Gestion des créneaux horaires
- Statistiques détaillées et rapports

### 🎨 **Expérience Utilisateur**
- Design responsive (mobile, tablette, desktop)
- Animations fluides et transitions élégantes
- Mode sombre/clair
- Interface accessible et intuitive

## 🛠️ Technologies Utilisées

### **Framework Principal**
- **Ionic 8.0.0** - Framework mobile hybride
- **Angular 19.0.0** - Framework frontend moderne
- **Capacitor 7.2.0** - Runtime natif pour applications mobiles

### **Langages & Outils**
- **TypeScript 5.6.3** - Langage de programmation typé
- **SCSS/CSS** - Styles et animations
- **HTML5** - Structure et contenu

### **Bibliothèques Clés**
- **@ngx-translate** - Internationalisation (i18n)
- **@swimlane/ngx-charts** - Graphiques et visualisations
- **Chart.js** - Graphiques interactifs
- **Bootstrap 5.3.7** - Framework CSS
- **Font Awesome** - Icônes
- **@stripe/stripe-js** - Paiements en ligne

### **Outils de Développement**
- **Angular CLI 19.0.0** - Outils de développement
- **ESLint** - Linting et qualité du code
- **Karma & Jasmine** - Tests unitaires

## 🚀 Installation et Configuration

### **Prérequis**
```bash
Node.js >= 18.x
npm >= 9.x
Ionic CLI >= 7.x
Angular CLI >= 19.x
```

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/Naghachmouhsine/clubappfrontEnd.git
cd clubappfrontEnd

# Installer les dépendances
npm install

# Installer Ionic CLI (si nécessaire)
npm install -g @ionic/cli

# Installer Angular CLI (si nécessaire)
npm install -g @angular/cli
```

### **Configuration**
1. **Variables d'environnement** : Configurer les fichiers dans `src/environments/`
2. **API Backend** : Modifier l'URL de l'API dans les services
3. **Stripe** : Configurer les clés Stripe pour les paiements
4. **Capacitor** : Configurer `capacitor.config.ts` pour le déploiement mobile

## 🏃‍♂️ Démarrage Rapide

### **Développement Web**
```bash
# Démarrer le serveur de développement
npm start
# ou
ionic serve

# L'application sera accessible sur http://localhost:4200
```

### **Développement Mobile**
```bash
# Ajouter les plateformes
ionic capacitor add ios
ionic capacitor add android

# Build et synchronisation
ionic capacitor build ios
ionic capacitor build android

# Ouvrir dans l'IDE natif
ionic capacitor open ios
ionic capacitor open android
```

### **Build de Production**
```bash
# Build optimisé pour la production
npm run build
# ou
ionic build --prod

# Les fichiers seront générés dans le dossier www/
```

## 📁 Structure du Projet

```
clubappfrontEnd/
├── src/
│   ├── app/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── app-header/      # En-tête de l'application
│   │   │   ├── hero-section/    # Section héro de l'accueil
│   │   │   └── ...
│   │   ├── pages/               # Pages de l'application
│   │   │   ├── home/            # Page d'accueil
│   │   │   ├── login/           # Authentification
│   │   │   ├── dashboard/       # Tableaux de bord
│   │   │   ├── reservation/     # Système de réservation
│   │   │   └── ...
│   │   ├── services/            # Services Angular
│   │   │   ├── auth.service.ts  # Authentification
│   │   │   ├── reservation.service.ts
│   │   │   └── ...
│   │   ├── modals/              # Modales réutilisables
│   │   └── shared/              # Modules partagés
│   ├── assets/                  # Ressources statiques
│   │   ├── images/              # Images et logos
│   │   ├── i18n/                # Fichiers de traduction
│   │   │   ├── fr.json          # Français
│   │   │   ├── en.json          # Anglais
│   │   │   └── ar.json          # Arabe
│   │   └── styles/              # Styles globaux
│   ├── environments/            # Configuration d'environnement
│   └── theme/                   # Thèmes et variables CSS
├── www/                         # Build de production
├── capacitor.config.ts          # Configuration Capacitor
├── ionic.config.json            # Configuration Ionic
└── package.json                 # Dépendances et scripts
```

## 🌍 Internationalisation

L'application supporte 3 langues :
- **🇫🇷 Français** (par défaut)
- **🇬🇧 Anglais**
- **🇸🇦 Arabe** (avec support RTL)

### **Ajouter une nouvelle traduction**
1. Ajouter le fichier de langue dans `src/assets/i18n/`
2. Configurer la langue dans le service de traduction
3. Utiliser le pipe `translate` dans les templates

```html
<!-- Exemple d'utilisation -->
<ion-title>{{ 'menu.title' | translate }}</ion-title>
```

## 🎨 Thèmes et Personnalisation

### **Variables CSS Principales**
```scss
:root {
  --color-primary: #d4af37;      // Or royal
  --color-secondary: #1a1a1a;    // Noir élégant
  --color-accent: #f8f9fa;       // Blanc cassé
  --color-success: #28a745;      // Vert succès
  --color-warning: #ffc107;      // Orange attention
  --color-danger: #dc3545;       // Rouge erreur
}
```

### **Mode Sombre**
L'application supporte automatiquement le mode sombre selon les préférences système.

## 🔐 Sécurité

- **Authentification JWT** - Tokens sécurisés pour l'API
- **Guards de route** - Protection des pages selon les rôles
- **Validation des formulaires** - Validation côté client et serveur
- **HTTPS** - Communication chiffrée en production

## 📱 Compatibilité

### **Navigateurs Web**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### **Plateformes Mobile**
- iOS 13+
- Android 8+ (API 26+)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run e2e

# Linting
npm run lint
```

## 📦 Déploiement

### **Web (PWA)**
```bash
# Build de production
ionic build --prod

# Déployer sur un serveur web
# Les fichiers sont dans le dossier www/
```

### **Mobile**
```bash
# iOS
ionic capacitor build ios
# Ouvrir Xcode et publier sur l'App Store

# Android
ionic capacitor build android
# Ouvrir Android Studio et publier sur Google Play
```

## 🤝 Contribution

### **Équipe de Développement**
- **Youssouf Tangara** - Développeur Principal
  - Email: ytangara2003@gmail.com
  - Responsable: Architecture frontend, UI/UX, Intégration
- **Naghach Mouhsine** - Développeur Principal
  - Responsable: Backend API, Base de données, Sécurité

### **Processus de Contribution**
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### **Standards de Code**
- Suivre les conventions Angular/Ionic
- Utiliser TypeScript strict
- Documenter les fonctions complexes
- Tester les nouvelles fonctionnalités

## 📄 License

**Licence Propriétaire** - Ce projet est la propriété exclusive du Royal Tennis Club de Fès et de ses développeurs. Tous droits réservés.

### **Restrictions**
- ❌ Utilisation commerciale interdite sans autorisation
- ❌ Redistribution interdite
- ❌ Modification interdite sans accord préalable
- ✅ Utilisation autorisée pour le Royal Tennis Club de Fès uniquement

### **Contact Légal**
Pour toute question concernant la licence ou l'utilisation :
- **Email**: ytangara2003@gmail.com
- **Projet**: Royal Tennis Club de Fès - Application de Gestion

## 📞 Support

### **Support Technique**
- **Email**: ytangara2003@gmail.com
- **Repository**: [GitHub - clubappfrontEnd](https://github.com/Naghachmouhsine/clubappfrontEnd)

### **Documentation**
- **Guide Utilisateur**: Voir `docs/user-guide.md`
- **API Documentation**: Voir le repository backend
- **Changelog**: Voir `CHANGELOG.md`

## 🏆 Remerciements

- **Royal Tennis Club de Fès** - Pour la confiance accordée
- **Équipe Ionic** - Pour le framework exceptionnel
- **Communauté Angular** - Pour les ressources et le support

---

<div align="center">
  <img src="src/assets/images/club-logo.png" alt="Royal Tennis Club de Fès" width="64" height="64">
  <br>
  <strong>Royal Tennis Club de Fès</strong>
  <br>
  <em>L'excellence sportive dans un cadre royal</em>
</div>