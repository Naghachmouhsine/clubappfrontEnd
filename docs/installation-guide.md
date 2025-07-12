# 🚀 Guide d'Installation - Royal Tennis Club de Fès Frontend

## 📋 Table des Matières

- [Prérequis](#-prérequis)
- [Installation Rapide](#-installation-rapide)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Build et Déploiement](#-build-et-déploiement)
- [Dépannage](#-dépannage)

---

## 🔧 Prérequis

### Versions Requises

| Outil | Version Minimale | Version Recommandée | Vérification |
|-------|------------------|-------------------|--------------|
| **Node.js** | 18.0.0 | 20.x LTS | `node --version` |
| **npm** | 9.0.0 | 10.x | `npm --version` |
| **Git** | 2.30.0 | Dernière | `git --version` |

### Installation des Prérequis

#### **🟢 Node.js et npm**

**Windows :**
```powershell
# Via Chocolatey
choco install nodejs

# Ou télécharger depuis https://nodejs.org/
```

**macOS :**
```bash
# Via Homebrew
brew install node

# Ou via nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

**Linux (Ubuntu/Debian) :**
```bash
# Via apt
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ou via snap
sudo snap install node --classic
```

#### **🔧 Outils Globaux**

```bash
# Ionic CLI
npm install -g @ionic/cli

# Angular CLI
npm install -g @angular/cli

# Capacitor CLI
npm install -g @capacitor/cli

# Outils optionnels
npm install -g typescript
npm install -g eslint
npm install -g prettier
```

### Vérification de l'Installation

```bash
# Vérifier toutes les versions
node --version    # v20.x.x
npm --version     # 10.x.x
ionic --version   # 7.x.x
ng version        # 19.x.x
```

---

## ⚡ Installation Rapide

### 1. Cloner le Repository

```bash
# HTTPS
git clone https://github.com/Naghachmouhsine/clubappfrontEnd.git

# SSH (si configuré)
git clone git@github.com:Naghachmouhsine/clubappfrontEnd.git

# Entrer dans le dossier
cd clubappfrontEnd
```

### 2. Installer les Dépendances

```bash
# Installation standard
npm install

# Installation avec cache nettoyé (si problèmes)
npm ci

# Installation rapide (si package-lock.json existe)
npm ci --only=production
```

### 3. Vérification de l'Installation

```bash
# Vérifier les dépendances
npm list --depth=0

# Audit de sécurité
npm audit

# Corriger les vulnérabilités automatiquement
npm audit fix
```

### 4. Premier Démarrage

```bash
# Démarrer le serveur de développement
ionic serve

# Ou avec npm
npm start

# L'application sera accessible sur http://localhost:4200
```

---

## ⚙️ Configuration

### Variables d'Environnement

#### **Développement**

Créer `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Royal Tennis Club de Fès',
  version: '2.1.0',
  
  // Configuration Stripe (clés de test)
  stripe: {
    publicKey: 'pk_test_...',
    currency: 'MAD'
  },
  
  // Configuration Firebase (optionnel)
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id'
  },
  
  // Configuration des fonctionnalités
  features: {
    enablePush: true,
    enableAnalytics: false,
    enableDebugMode: true
  }
};
```

#### **Production**

Créer `src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.royaltennisclub-fes.ma',
  appName: 'Royal Tennis Club de Fès',
  version: '2.1.0',
  
  // Configuration Stripe (clés de production)
  stripe: {
    publicKey: 'pk_live_...',
    currency: 'MAD'
  },
  
  // Configuration Firebase
  firebase: {
    apiKey: 'your-prod-api-key',
    authDomain: 'your-prod-project.firebaseapp.com',
    projectId: 'your-prod-project-id'
  },
  
  // Configuration des fonctionnalités
  features: {
    enablePush: true,
    enableAnalytics: true,
    enableDebugMode: false
  }
};
```

### Configuration Capacitor

#### **capacitor.config.ts**

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ma.royaltennisclub.fes',
  appName: 'Royal Tennis Club de Fès',
  webDir: 'www',
  bundledWebRuntime: false,
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#d4af37',
      showSpinner: false
    },
    
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    
    StatusBar: {
      style: 'dark',
      backgroundColor: '#d4af37'
    }
  },
  
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### Configuration Ionic

#### **ionic.config.json**

```json
{
  "name": "Royal Tennis Club de Fès",
  "integrations": {
    "capacitor": {}
  },
  "type": "angular-standalone",
  "proxies": [
    {
      "path": "/api",
      "proxyUrl": "http://localhost:3000/api"
    }
  ]
}
```

---

## 💻 Développement

### Scripts Disponibles

```bash
# Développement
npm start                 # Démarrer le serveur de développement
npm run serve            # Alias pour ionic serve
ionic serve --lab       # Interface multi-plateforme

# Build
npm run build            # Build de développement
npm run build:prod       # Build de production
ionic build --prod      # Build optimisé

# Tests
npm test                 # Tests unitaires
npm run test:coverage    # Tests avec couverture
npm run e2e             # Tests end-to-end
npm run lint            # Vérification du code

# Mobile
ionic capacitor add ios     # Ajouter plateforme iOS
ionic capacitor add android # Ajouter plateforme Android
ionic capacitor run ios     # Lancer sur iOS
ionic capacitor run android # Lancer sur Android
```

### Configuration de l'IDE

#### **VS Code Extensions**

Créer `.vscode/extensions.json` :

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ionic.ionic",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### **VS Code Settings**

Créer `.vscode/settings.json` :

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.html": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  }
}
```

### Configuration ESLint

#### **.eslintrc.json**

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["@angular-eslint/template/recommended"],
      "rules": {}
    }
  ]
}
```

### Configuration Prettier

#### **.prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## 🏗️ Build et Déploiement

### Build Web

#### **Développement**

```bash
# Build simple
ionic build

# Build avec configuration spécifique
ionic build --configuration=development

# Build avec watch mode
ionic build --watch
```

#### **Production**

```bash
# Build optimisé
ionic build --prod

# Build avec analyse du bundle
ionic build --prod --stats-json
npx webpack-bundle-analyzer www/stats.json

# Vérification du build
ls -la www/
```

### Build Mobile

#### **iOS**

```bash
# Prérequis : Xcode installé sur macOS
ionic capacitor add ios
ionic build --prod
ionic capacitor copy ios
ionic capacitor sync ios

# Ouvrir dans Xcode
ionic capacitor open ios

# Build depuis la ligne de commande
ionic capacitor run ios --device
```

#### **Android**

```bash
# Prérequis : Android Studio installé
ionic capacitor add android
ionic build --prod
ionic capacitor copy android
ionic capacitor sync android

# Ouvrir dans Android Studio
ionic capacitor open android

# Build depuis la ligne de commande
ionic capacitor run android --device
```

### Déploiement

#### **Serveur Web**

```bash
# Build de production
ionic build --prod

# Copier les fichiers vers le serveur
rsync -avz www/ user@server:/var/www/html/

# Ou avec SCP
scp -r www/* user@server:/var/www/html/
```

#### **Firebase Hosting**

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Initialiser Firebase
firebase init hosting

# Déployer
firebase deploy
```

#### **Netlify**

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir=www
```

---

## 🔧 Dépannage

### Problèmes Courants

#### **Erreur : "Cannot find module"**

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Ou avec cache nettoyé
npm cache clean --force
npm install
```

#### **Erreur : "Port 4200 is already in use"**

```bash
# Utiliser un autre port
ionic serve --port=4201

# Ou tuer le processus
lsof -ti:4200 | xargs kill -9
```

#### **Erreur de build Angular**

```bash
# Vérifier la version d'Angular
ng version

# Mettre à jour Angular
ng update @angular/core @angular/cli

# Mettre à jour Ionic
npm install @ionic/angular@latest
```

#### **Problèmes de permissions (macOS/Linux)**

```bash
# Changer le propriétaire du dossier npm
sudo chown -R $(whoami) ~/.npm

# Ou utiliser nvm pour éviter sudo
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Problèmes Spécifiques

#### **Capacitor iOS**

```bash
# Erreur de certificat
ionic capacitor run ios --livereload --external

# Problème de provisioning
# Ouvrir Xcode et configurer l'équipe de développement
```

#### **Capacitor Android**

```bash
# Erreur de SDK
# Vérifier ANDROID_HOME dans ~/.bashrc ou ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Problème de Gradle
cd android
./gradlew clean
cd ..
ionic capacitor sync android
```

### Logs et Debugging

#### **Logs de Développement**

```bash
# Logs détaillés
ionic serve --verbose

# Logs Capacitor
ionic capacitor run ios --livereload --consolelogs
ionic capacitor run android --livereload --consolelogs
```

#### **Debugging Mobile**

```bash
# iOS Safari Web Inspector
# Safari > Develop > [Device] > [App]

# Android Chrome DevTools
# Chrome > chrome://inspect > Remote Target
```

### Performance

#### **Optimisation du Build**

```bash
# Analyse du bundle
npm install -g webpack-bundle-analyzer
ionic build --prod --stats-json
webpack-bundle-analyzer www/stats.json
```

#### **Optimisation des Images**

```bash
# Installer imagemin
npm install -g imagemin-cli

# Optimiser les images
imagemin src/assets/images/* --out-dir=src/assets/images/optimized
```

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- **Ionic** : [https://ionicframework.com/docs](https://ionicframework.com/docs)
- **Angular** : [https://angular.io/docs](https://angular.io/docs)
- **Capacitor** : [https://capacitorjs.com/docs](https://capacitorjs.com/docs)
- **TypeScript** : [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### Communauté

- **Forum Ionic** : [https://forum.ionicframework.com](https://forum.ionicframework.com)
- **Stack Overflow** : Tag `ionic-framework`, `angular`
- **Discord Ionic** : [https://ionic.link/discord](https://ionic.link/discord)

### Outils Utiles

- **Ionic DevApp** : Test sur appareil sans build
- **Ionic Studio** : IDE visuel (payant)
- **Stencil** : Composants web réutilisables
- **Appflow** : CI/CD pour Ionic (payant)

---

## 🆘 Support

### Obtenir de l'Aide

Si vous rencontrez des problèmes :

1. **📚 Consultez la documentation** ci-dessus
2. **🔍 Recherchez dans les issues** GitHub existantes
3. **📧 Contactez l'équipe** :  Naghachmouhsine@gmail.com // ytangara2003@gmail.com
4. **💬 Créez une issue** avec les détails du problème

### Informations à Fournir

- **💻 Système d'exploitation** et version
- **🟢 Version de Node.js** (`node --version`)
- **📱 Version d'Ionic** (`ionic --version`)
- **🔧 Version d'Angular** (`ng version`)
- **📝 Message d'erreur** complet
- **🔄 Étapes** pour reproduire le problème

---

*Guide mis à jour le : 12 juillet 2025*  
*© 2025 Royal Tennis Club de Fès - Tous droits réservés*