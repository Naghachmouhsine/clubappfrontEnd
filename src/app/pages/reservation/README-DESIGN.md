# Design Commun pour les Pages de Réservation

Ce document explique comment utiliser le design commun avec dégradé doré-bleu pour toutes les pages de réservation.

## 🎨 Caractéristiques du Design

- **Dégradé de fond** : `linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(63, 167, 255, 0.3))`
- **Effet glassmorphism** : Arrière-plans translucides avec effet de flou
- **Support mode sombre/clair** : Adaptation automatique selon le thème
- **Animations fluides** : Transitions et animations d'entrée
- **Design responsive** : Adaptation mobile et desktop

## 📁 Structure des Fichiers

```
src/app/pages/reservation/
├── shared-reservation-styles.scss    # Styles communs
├── reservation-date/
│   ├── reservation-date.page.scss   # Import + styles spécifiques
│   └── reservation-date.page.html
├── activite-r/
│   ├── activite-r.page.scss         # Import + styles spécifiques
│   └── activite-r.page.html
└── README-DESIGN.md                 # Ce fichier
```

## 🚀 Comment Appliquer le Design

### 1. Dans le fichier SCSS de votre page

```scss
// Import des styles communs pour les réservations
@import '../shared-reservation-styles.scss';

:host {
  --ion-background-color: transparent;
  --ion-text-color: var(--ion-color-primary-contrast);
}

// Styles spécifiques à cette page (si nécessaire)
// Les styles communs sont maintenant dans shared-reservation-styles.scss
```

### 2. Dans le fichier HTML de votre page

Utilisez les classes CSS prédéfinies :

```html
<ion-content class="reservation-content">
  
  <!-- Nom du club -->
  <div class="club-name">
    <ion-chip>
      <ion-label>Mon Club Sportif</ion-label>
    </ion-chip>
  </div>

  <!-- Sélecteur de dates -->
  <div class="date-carousel">
    <ion-icon name="chevron-back-outline" (click)="prevDates()"></ion-icon>
    <div class="date-list">
      <div *ngFor="let date of weekDates" 
           [class.active]="selectedDate === date" 
           (click)="selectDate(date)"
           class="date-item">
        <div class="day">{{ date | date: 'dd' }}</div>
        <div class="weekday">{{ date | date: 'EEE' }}</div>
      </div>
    </div>
    <ion-icon name="chevron-forward-outline" (click)="nextDates()"></ion-icon>
  </div>

  <!-- Titre de section -->
  <div class="subtitle">
    {{ selectedDate | date: 'fullDate' }}
  </div>

  <!-- Détail activité -->
  <p class="activite-detail">Activité sélectionnée : {{ reservation.activite }}</p>

  <!-- Instructions -->
  <div class="instruction-text" *ngIf="sessions.length > 0">
    <ion-icon name="hand-left-outline"></ion-icon>
    Cliquez sur un créneau disponible pour réserver
  </div>

  <!-- Cartes de session -->
  <ion-item *ngFor="let session of sessions" 
            lines="none" 
            class="session-card"
            (click)="reserverSession(session)">
    
    <ion-label>
      <div class="session-detail">
        <ion-icon name="time-outline"></ion-icon>
        <span>{{ session.heure_debut }} - {{ session.heure_fin }}</span>
      </div>
      
      <div class="session-detail">
        <ion-icon name="people-outline"></ion-icon>
        <span>Capacité : {{ session.capacite }}</span>
      </div>
    </ion-label>

    <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
  </ion-item>

  <!-- Message d'alerte -->
  <ion-item *ngIf="sessions.length === 0">
    <ion-label class="ion-text-center">
      <ion-icon name="alert-circle-outline" color="medium"></ion-icon>
      Aucun créneau disponible pour le moment
    </ion-label>
  </ion-item>

</ion-content>
```

## 🎯 Classes CSS Disponibles

### Conteneurs
- `.reservation-content` : Conteneur principal avec dégradé de fond
- `.club-name` : Container pour le nom du club
- `.date-carousel` : Carrousel de sélection de dates

### Éléments de date
- `.date-list` : Liste des dates
- `.date-item` : Item de date individuel
- `.date-item.active` : Date sélectionnée
- `.day` : Jour du mois
- `.weekday` : Jour de la semaine

### Textes et titres
- `.subtitle` : Titre de section
- `.activite-detail` : Détails de l'activité
- `.instruction-text` : Texte d'instruction

### Cartes et éléments
- `.session-card` : Carte de session/créneau
- `.session-detail` : Détail dans une session

## 🌓 Support Mode Sombre

Le design s'adapte automatiquement au mode sombre grâce aux sélecteurs `body.dark`.

### Variables CSS utilisées
- `--glass-light` : Arrière-plan translucide mode clair
- `--glass-dark` : Arrière-plan translucide mode sombre
- `--border-light` : Bordure mode clair
- `--border-dark` : Bordure mode sombre
- `--reservation-gold` : Couleur dorée
- `--reservation-blue` : Couleur bleue

## 📱 Responsive Design

Le design inclut des breakpoints pour :
- **Mobile** : `max-width: 480px`
- **Tablette** : `max-width: 768px`
- **Desktop** : Au-delà de 768px

## ✨ Animations Incluses

- **fadeInUp** : Animation d'entrée par le bas
- **slideInLeft** : Animation d'entrée par la gauche
- **pulse** : Pulsation pour les éléments actifs
- **Transitions** : Hover et interactions fluides

## 🔧 Personnalisation

Pour personnaliser le design d'une page spécifique, ajoutez vos styles après l'import :

```scss
@import '../shared-reservation-styles.scss';

// Personnalisation spécifique
.ma-classe-personnalisee {
  // Vos styles ici
}
```

## 📋 Pages Concernées

Ce design doit être appliqué à toutes les pages de réservation :

- ✅ **Tennis** 🏓
- ✅ **Padel** 🏓  
- ✅ **Piscine** 🏊
- ✅ **Football** ⚽
- ✅ **Fitness** 💪
- ✅ **Basket** 🏀
- ✅ **Volley** 🏐
- ✅ **Pétanque** 🪀
- ✅ **Athlétisme** 🏃‍♂️
- ✅ **Arts Martiaux** 🥋

**Exception** : La page `home-r` garde son design actuel car il est déjà bien fait.

## 🚨 Notes Importantes

1. **Ne pas modifier** `shared-reservation-styles.scss` sans tester sur toutes les pages
2. **Toujours tester** en mode clair ET sombre
3. **Vérifier la responsivité** sur mobile et desktop
4. **Maintenir la cohérence** entre toutes les pages de réservation

---

*Design créé pour une expérience utilisateur cohérente et moderne sur toutes les pages de réservation du club sportif.*# Design Commun pour les Pages de Réservation

Ce document explique comment utiliser le design commun avec dégradé doré-bleu pour toutes les pages de réservation.

## 🎨 Caractéristiques du Design

- **Dégradé de fond** : `linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(63, 167, 255, 0.3))`
- **Effet glassmorphism** : Arrière-plans translucides avec effet de flou
- **Support mode sombre/clair** : Adaptation automatique selon le thème
- **Animations fluides** : Transitions et animations d'entrée
- **Design responsive** : Adaptation mobile et desktop

## 📁 Structure des Fichiers

```
src/app/pages/reservation/
├── shared-reservation-styles.scss    # Styles communs
├── reservation-date/
│   ├── reservation-date.page.scss   # Import + styles spécifiques
│   └── reservation-date.page.html
├── activite-r/
│   ├── activite-r.page.scss         # Import + styles spécifiques
│   └── activite-r.page.html
└── README-DESIGN.md                 # Ce fichier
```

## 🚀 Comment Appliquer le Design

### 1. Dans le fichier SCSS de votre page

```scss
// Import des styles communs pour les réservations
@import '../shared-reservation-styles.scss';

:host {
  --ion-background-color: transparent;
  --ion-text-color: var(--ion-color-primary-contrast);
}

// Styles spécifiques à cette page (si nécessaire)
// Les styles communs sont maintenant dans shared-reservation-styles.scss
```

### 2. Dans le fichier HTML de votre page

Utilisez les classes CSS prédéfinies :

```html
<ion-content class="reservation-content">
  
  <!-- Nom du club -->
  <div class="club-name">
    <ion-chip>
      <ion-label>Mon Club Sportif</ion-label>
    </ion-chip>
  </div>

  <!-- Sélecteur de dates -->
  <div class="date-carousel">
    <ion-icon name="chevron-back-outline" (click)="prevDates()"></ion-icon>
    <div class="date-list">
      <div *ngFor="let date of weekDates" 
           [class.active]="selectedDate === date" 
           (click)="selectDate(date)"
           class="date-item">
        <div class="day">{{ date | date: 'dd' }}</div>
        <div class="weekday">{{ date | date: 'EEE' }}</div>
      </div>
    </div>
    <ion-icon name="chevron-forward-outline" (click)="nextDates()"></ion-icon>
  </div>

  <!-- Titre de section -->
  <div class="subtitle">
    {{ selectedDate | date: 'fullDate' }}
  </div>

  <!-- Détail activité -->
  <p class="activite-detail">Activité sélectionnée : {{ reservation.activite }}</p>

  <!-- Instructions -->
  <div class="instruction-text" *ngIf="sessions.length > 0">
    <ion-icon name="hand-left-outline"></ion-icon>
    Cliquez sur un créneau disponible pour réserver
  </div>

  <!-- Cartes de session -->
  <ion-item *ngFor="let session of sessions" 
            lines="none" 
            class="session-card"
            (click)="reserverSession(session)">
    
    <ion-label>
      <div class="session-detail">
        <ion-icon name="time-outline"></ion-icon>
        <span>{{ session.heure_debut }} - {{ session.heure_fin }}</span>
      </div>
      
      <div class="session-detail">
        <ion-icon name="people-outline"></ion-icon>
        <span>Capacité : {{ session.capacite }}</span>
      </div>
    </ion-label>

    <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
  </ion-item>

  <!-- Message d'alerte -->
  <ion-item *ngIf="sessions.length === 0">
    <ion-label class="ion-text-center">
      <ion-icon name="alert-circle-outline" color="medium"></ion-icon>
      Aucun créneau disponible pour le moment
    </ion-label>
  </ion-item>

</ion-content>
```

## 🎯 Classes CSS Disponibles

### Conteneurs
- `.reservation-content` : Conteneur principal avec dégradé de fond
- `.club-name` : Container pour le nom du club
- `.date-carousel` : Carrousel de sélection de dates

### Éléments de date
- `.date-list` : Liste des dates
- `.date-item` : Item de date individuel
- `.date-item.active` : Date sélectionnée
- `.day` : Jour du mois
- `.weekday` : Jour de la semaine

### Textes et titres
- `.subtitle` : Titre de section
- `.activite-detail` : Détails de l'activité
- `.instruction-text` : Texte d'instruction

### Cartes et éléments
- `.session-card` : Carte de session/créneau
- `.session-detail` : Détail dans une session

## 🌓 Support Mode Sombre

Le design s'adapte automatiquement au mode sombre grâce aux sélecteurs `body.dark`.

### Variables CSS utilisées
- `--glass-light` : Arrière-plan translucide mode clair
- `--glass-dark` : Arrière-plan translucide mode sombre
- `--border-light` : Bordure mode clair
- `--border-dark` : Bordure mode sombre
- `--reservation-gold` : Couleur dorée
- `--reservation-blue` : Couleur bleue

## 📱 Responsive Design

Le design inclut des breakpoints pour :
- **Mobile** : `max-width: 480px`
- **Tablette** : `max-width: 768px`
- **Desktop** : Au-delà de 768px

## ✨ Animations Incluses

- **fadeInUp** : Animation d'entrée par le bas
- **slideInLeft** : Animation d'entrée par la gauche
- **pulse** : Pulsation pour les éléments actifs
- **Transitions** : Hover et interactions fluides

## 🔧 Personnalisation

Pour personnaliser le design d'une page spécifique, ajoutez vos styles après l'import :

```scss
@import '../shared-reservation-styles.scss';

// Personnalisation spécifique
.ma-classe-personnalisee {
  // Vos styles ici
}
```

## 📋 Pages Concernées

Ce design doit être appliqué à toutes les pages de réservation :

- ✅ **Tennis** 🏓
- ✅ **Padel** 🏓  
- ✅ **Piscine** 🏊
- ✅ **Football** ⚽
- ✅ **Fitness** 💪
- ✅ **Basket** 🏀
- ✅ **Volley** 🏐
- ✅ **Pétanque** 🪀
- ✅ **Athlétisme** 🏃‍♂️
- ✅ **Arts Martiaux** 🥋

**Exception** : La page `home-r` garde son design actuel car il est déjà bien fait.

## 🚨 Notes Importantes

1. **Ne pas modifier** `shared-reservation-styles.scss` sans tester sur toutes les pages
2. **Toujours tester** en mode clair ET sombre
3. **Vérifier la responsivité** sur mobile et desktop
4. **Maintenir la cohérence** entre toutes les pages de réservation

---

*Design créé pour une expérience utilisateur cohérente et moderne sur toutes les pages de réservation du club sportif.*