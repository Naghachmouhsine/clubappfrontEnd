# 🚀 Guide de Déploiement - Royal Tennis Club de Fès Frontend

## 📋 Table des Matières

- [Vue d'Ensemble](#-vue-densemble)
- [Déploiement Web](#-déploiement-web)
- [Déploiement Mobile](#-déploiement-mobile)
- [CI/CD](#-cicd)
- [Monitoring](#-monitoring)
- [Maintenance](#-maintenance)

---

## 🎯 Vue d'Ensemble

### Environnements de Déploiement

| Environnement | URL | Utilisation | Auto-Deploy |
|---------------|-----|-------------|-------------|
| **Développement** | `http://localhost:4200` | Tests locaux | ❌ |
| **Staging** | `https://staging.royaltennisclub-fes.ma` | Tests pré-production | lien à revoir  ✅ |
| **Production** | `https://app.royaltennisclub-fes.ma` | Utilisateurs finaux | lien à revoir✅ |

### Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Développeur   │───▶│   Repository    │───▶│   CI/CD         │
│                 │    │   GitHub        │    │   Pipeline      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Staging       │◀────────────┤
                       │   Environment   │             │
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │   Production    │◀────────────┘
                       │   Environment   │
                       └─────────────────┘
```

---

## 🌐 Déploiement Web

### Prérequis

#### **Serveur Web**
- **OS** : Ubuntu 20.04 LTS ou CentOS 8
- **RAM** : Minimum 2GB, Recommandé 4GB
- **Stockage** : Minimum 20GB SSD
- **Bande passante** : 100 Mbps

#### **Logiciels Requis**
- **Nginx** : 1.18+ (serveur web)
- **Node.js** : 18+ (pour le build)
- **PM2** : Gestionnaire de processus
- **Certbot** : Certificats SSL Let's Encrypt

### Configuration du Serveur

#### **1. Installation des Dépendances**

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de Nginx
sudo apt install nginx -y

# Installation de PM2
sudo npm install -g pm2

# Installation de Certbot
sudo apt install certbot python3-certbot-nginx -y
```

#### **2. Configuration Nginx**

Créer `/etc/nginx/sites-available/royaltennisclub-fes` :

```nginx
server {
    listen 80;
    server_name app.royaltennisclub-fes.ma;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.royaltennisclub-fes.ma;
    
    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/app.royaltennisclub-fes.ma/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.royaltennisclub-fes.ma/privkey.pem;
    
    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Racine du site
    root /var/www/royaltennisclub-fes;
    index index.html;
    
    # Configuration pour SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

#### **3. Activation du Site**

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/royaltennisclub-fes /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Activer au démarrage
sudo systemctl enable nginx
```

#### **4. Certificat SSL**

```bash
# Obtenir le certificat
sudo certbot --nginx -d app.royaltennisclub-fes.ma

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### Processus de Déploiement

#### **Script de Déploiement**

Créer `scripts/deploy.sh` :

```bash
#!/bin/bash

# Configuration
REPO_URL="https://github.com/Naghachmouhsine/clubappfrontEnd.git"
DEPLOY_DIR="/var/www/royaltennisclub-fes"
BACKUP_DIR="/var/backups/royaltennisclub-fes"
BRANCH="main"

echo "🚀 Début du déploiement..."

# Créer un backup
echo "📦 Création du backup..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $DEPLOY_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)

# Cloner ou mettre à jour le repository
if [ -d "/tmp/clubappfrontEnd" ]; then
    echo "🔄 Mise à jour du repository..."
    cd /tmp/clubappfrontEnd
    git pull origin $BRANCH
else
    echo "📥 Clonage du repository..."
    cd /tmp
    git clone $REPO_URL
    cd clubappfrontEnd
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Build de production
echo "🏗️ Build de production..."
npm run build:prod

# Déploiement
echo "🚀 Déploiement des fichiers..."
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r www/* $DEPLOY_DIR/

# Permissions
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# Test de la configuration Nginx
echo "🧪 Test de la configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    sudo systemctl reload nginx
else
    echo "❌ Erreur de configuration Nginx"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès!"
```

#### **Déploiement Manuel**

```bash
# 1. Build local
ionic build --prod

# 2. Upload vers le serveur
rsync -avz --delete www/ user@server:/var/www/royaltennisclub-fes/

# 3. Redémarrer Nginx
ssh user@server "sudo systemctl reload nginx"
```

### Déploiement avec Docker

#### **Dockerfile**

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés
COPY --from=build /app/www /usr/share/nginx/html

# Exposer le port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### **docker-compose.yml**

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./www:/usr/share/nginx/html
    depends_on:
      - frontend
    restart: unless-stopped
```

---

## 📱 Déploiement Mobile

### iOS App Store

#### **Prérequis**
- **Compte Apple Developer** : 99$/an
- **Xcode** : Dernière version
- **macOS** : Version supportée par Xcode

#### **Configuration**

1. **Certificats et Profils**
```bash
# Ouvrir Xcode
ionic capacitor open ios

# Dans Xcode :
# 1. Sélectionner le projet
# 2. Signing & Capabilities
# 3. Configurer l'équipe de développement
# 4. Choisir un Bundle Identifier unique
```

2. **Configuration App Store Connect**
```bash
# 1. Créer l'app sur App Store Connect
# 2. Configurer les métadonnées
# 3. Ajouter les captures d'écran
# 4. Définir les informations de prix
```

#### **Build et Soumission**

```bash
# 1. Build de production
ionic build --prod
ionic capacitor copy ios
ionic capacitor sync ios

# 2. Ouvrir dans Xcode
ionic capacitor open ios

# 3. Dans Xcode :
# - Product > Archive
# - Window > Organizer
# - Distribute App > App Store Connect
```

#### **Script de Build iOS**

```bash
#!/bin/bash

echo "🍎 Build iOS pour App Store..."

# Build de production
ionic build --prod

# Synchronisation Capacitor
ionic capacitor sync ios

# Ouvrir Xcode pour l'archive
ionic capacitor open ios

echo "📱 Continuez dans Xcode pour créer l'archive"
```

### Google Play Store

#### **Prérequis**
- **Compte Google Play Developer** : 25$ (unique)
- **Android Studio** : Dernière version
- **Java JDK** : 11 ou supérieur

#### **Configuration**

1. **Keystore de Production**
```bash
# Générer le keystore
keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000

# Configurer dans android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('../../release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'release'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

2. **Configuration Google Play Console**
```bash
# 1. Créer l'app sur Google Play Console
# 2. Configurer les détails de l'app
# 3. Ajouter les captures d'écran
# 4. Définir la classification du contenu
```

#### **Build et Soumission**

```bash
# 1. Build de production
ionic build --prod
ionic capacitor copy android
ionic capacitor sync android

# 2. Générer l'APK/AAB
cd android
./gradlew assembleRelease
# ou pour AAB (recommandé)
./gradlew bundleRelease

# 3. Upload sur Google Play Console
```

#### **Script de Build Android**

```bash
#!/bin/bash

echo "🤖 Build Android pour Google Play..."

# Build de production
ionic build --prod

# Synchronisation Capacitor
ionic capacitor sync android

# Build de l'AAB
cd android
./gradlew bundleRelease

echo "📦 AAB généré : android/app/build/outputs/bundle/release/app-release.aab"
```

### Déploiement Automatisé Mobile

#### **Fastlane Configuration**

Créer `fastlane/Fastfile` :

```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    build_app(
      scheme: "App",
      workspace: "ios/App/App.xcworkspace",
      export_method: "app-store"
    )
    upload_to_testflight
  end
  
  desc "Build and upload to App Store"
  lane :release do
    build_app(
      scheme: "App",
      workspace: "ios/App/App.xcworkspace",
      export_method: "app-store"
    )
    upload_to_app_store
  end
end

platform :android do
  desc "Build and upload to Play Store"
  lane :beta do
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: "internal",
      aab: "android/app/build/outputs/bundle/release/app-release.aab"
    )
  end
  
  desc "Build and upload to Play Store"
  lane :release do
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    upload_to_play_store(
      aab: "android/app/build/outputs/bundle/release/app-release.aab"
    )
  end
end
```

---

## 🔄 CI/CD

### GitHub Actions

#### **Workflow Principal**

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run build
      run: npm run build:prod

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for staging
      run: npm run build:staging
    
    - name: Deploy to staging
      run: |
        rsync -avz --delete www/ ${{ secrets.STAGING_USER }}@${{ secrets.STAGING_HOST }}:/var/www/staging/
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build:prod
    
    - name: Deploy to production
      run: |
        rsync -avz --delete www/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/production/
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
    
    - name: Notify deployment
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
        -H 'Content-type: application/json' \
        --data '{"text":"🚀 Déploiement réussi en production!"}'
```

#### **Workflow Mobile**

Créer `.github/workflows/mobile.yml` :

```yaml
name: Build Mobile Apps

on:
  push:
    tags:
      - 'v*'

jobs:
  build-ios:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build app
      run: npm run build:prod
    
    - name: Sync Capacitor
      run: npx cap sync ios
    
    - name: Build iOS
      run: |
        xcodebuild -workspace ios/App/App.xcworkspace \
        -scheme App \
        -configuration Release \
        -archivePath ios/App.xcarchive \
        archive
    
    - name: Upload to TestFlight
      run: |
        xcodebuild -exportArchive \
        -archivePath ios/App.xcarchive \
        -exportPath ios/ \
        -exportOptionsPlist ios/ExportOptions.plist

  build-android:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build app
      run: npm run build:prod
    
    - name: Sync Capacitor
      run: npx cap sync android
    
    - name: Build Android AAB
      run: |
        cd android
        ./gradlew bundleRelease
    
    - name: Upload to Play Store
      uses: r0adkll/upload-google-play@v1
      with:
        serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
        packageName: ma.royaltennisclub.fes
        releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
        track: internal
```

### Variables d'Environnement CI/CD

#### **Secrets GitHub**

```bash
# Serveur
STAGING_HOST=staging.royaltennisclub-fes.ma
STAGING_USER=deploy
PROD_HOST=app.royaltennisclub-fes.ma
PROD_USER=deploy
SSH_PRIVATE_KEY=<clé SSH privée>

# Mobile
GOOGLE_PLAY_SERVICE_ACCOUNT=<JSON du compte de service>
APPLE_ID=<Apple ID>
APPLE_PASSWORD=<Mot de passe spécifique à l'app>

# Notifications
SLACK_WEBHOOK=<URL du webhook Slack>
```

---

## 📊 Monitoring

### Monitoring Web

#### **Nginx Logs**

```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log

# Analyse des logs avec GoAccess
sudo goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED
```

#### **Monitoring avec Prometheus**

Créer `docker-compose.monitoring.yml` :

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

  nginx-exporter:
    image: nginx/nginx-prometheus-exporter
    ports:
      - "9113:9113"
    command:
      - -nginx.scrape-uri=http://nginx/nginx_status

volumes:
  grafana-storage:
```

### Monitoring Mobile

#### **Crash Reporting**

```typescript
// Intégration Sentry
import * as Sentry from '@sentry/capacitor';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: environment.production ? 'production' : 'development'
});

// Capture d'erreur personnalisée
try {
  // Code susceptible de générer une erreur
} catch (error) {
  Sentry.captureException(error);
}
```

#### **Analytics**

```typescript
// Intégration Google Analytics
import { GoogleAnalytics } from '@capacitor-community/google-analytics';

await GoogleAnalytics.initialize({
  measurementId: 'G-XXXXXXXXXX'
});

// Tracking d'événements
await GoogleAnalytics.logEvent({
  name: 'reservation_created',
  parameters: {
    court_type: 'tennis',
    duration: 60
  }
});
```

### Alertes

#### **Script de Monitoring**

Créer `scripts/health-check.sh` :

```bash
#!/bin/bash

# Configuration
URL="https://app.royaltennisclub-fes.ma"
WEBHOOK="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Test de disponibilité
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $HTTP_CODE -ne 200 ]; then
    # Envoyer une alerte
    curl -X POST $WEBHOOK \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 Site indisponible! Code HTTP: $HTTP_CODE\"}"
    
    exit 1
fi

echo "✅ Site disponible (HTTP $HTTP_CODE)"
```

#### **Cron Job de Monitoring**

```bash
# Ajouter au crontab
*/5 * * * * /path/to/health-check.sh
```

---

## 🔧 Maintenance

### Mises à Jour

#### **Dépendances**

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour les dépendances mineures
npm update

# Mettre à jour Angular
ng update @angular/core @angular/cli

# Mettre à jour Ionic
npm install @ionic/angular@latest
```

#### **Sécurité**

```bash
# Audit de sécurité
npm audit

# Correction automatique
npm audit fix

# Correction manuelle des vulnérabilités critiques
npm audit fix --force
```

### Sauvegarde

#### **Script de Sauvegarde**

Créer `scripts/backup.sh` :

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/royaltennisclub-fes"
DATE=$(date +%Y%m%d-%H%M%S)

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarder les fichiers web
tar -czf $BACKUP_DIR/web-$DATE.tar.gz /var/www/royaltennisclub-fes

# Sauvegarder la configuration Nginx
tar -czf $BACKUP_DIR/nginx-$DATE.tar.gz /etc/nginx/sites-available/royaltennisclub-fes

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ Sauvegarde terminée : $DATE"
```

#### **Automatisation**

```bash
# Ajouter au crontab
0 2 * * * /path/to/backup.sh
```

### Rollback

#### **Procédure de Rollback**

```bash
#!/bin/bash

# Script de rollback
BACKUP_DIR="/var/backups/royaltennisclub-fes"
DEPLOY_DIR="/var/www/royaltennisclub-fes"

echo "🔄 Rollback en cours..."

# Lister les sauvegardes disponibles
echo "Sauvegardes disponibles :"
ls -la $BACKUP_DIR/web-*.tar.gz

# Demander quelle sauvegarde restaurer
read -p "Entrez le nom de la sauvegarde à restaurer : " BACKUP_FILE

# Restaurer la sauvegarde
sudo rm -rf $DEPLOY_DIR/*
sudo tar -xzf $BACKUP_DIR/$BACKUP_FILE -C /

# Redémarrer Nginx
sudo systemctl reload nginx

echo "✅ Rollback terminé"
```

---

## 📚 Ressources

### Documentation

- **Nginx** : [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
- **Let's Encrypt** : [https://letsencrypt.org/docs/](https://letsencrypt.org/docs/)
- **GitHub Actions** : [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Fastlane** : [https://docs.fastlane.tools/](https://docs.fastlane.tools/)

### Outils

- **PM2** : Gestionnaire de processus Node.js
- **Docker** : Conteneurisation
- **Kubernetes** : Orchestration de conteneurs
- **Terraform** : Infrastructure as Code

---

*Guide mis à jour le :  12 juillet 2025*  
*© 2025 Royal Tennis Club de Fès - Tous droits réservés*