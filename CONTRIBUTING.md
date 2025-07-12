# 🤝 Guide de Contribution - Royal Tennis Club de Fès Frontend

Merci de votre intérêt pour contribuer au projet du Royal Tennis Club de Fès ! Ce guide vous aidera à comprendre comment participer efficacement au développement de l'application.

## 📋 Table des Matières

- [Code de Conduite](#-code-de-conduite)
- [Comment Contribuer](#-comment-contribuer)
- [Standards de Développement](#-standards-de-développement)
- [Processus de Développement](#-processus-de-développement)
- [Tests et Qualité](#-tests-et-qualité)
- [Documentation](#-documentation)
- [Support](#-support)

---

## 🤝 Code de Conduite

### Nos Engagements

En tant que contributeurs et mainteneurs de ce projet, nous nous engageons à :
- **🌟 Respecter** tous les participants, indépendamment de leur expérience, genre, identité, religion, ou origine
- **🎯 Maintenir** un environnement accueillant et inclusif
- **💡 Encourager** l'apprentissage et le partage de connaissances
- **🔧 Fournir** un feedback constructif et bienveillant

### Comportements Attendus

- ✅ Utiliser un langage accueillant et inclusif
- ✅ Respecter les différents points de vue et expériences
- ✅ Accepter gracieusement les critiques constructives
- ✅ Se concentrer sur ce qui est le mieux pour la communauté
- ✅ Faire preuve d'empathie envers les autres membres

### Comportements Inacceptables

- ❌ Langage ou imagerie sexualisés
- ❌ Commentaires insultants ou désobligeants
- ❌ Harcèlement public ou privé
- ❌ Publication d'informations privées sans permission
- ❌ Toute conduite inappropriée dans un contexte professionnel

---

## 🚀 Comment Contribuer

### Types de Contributions

Nous accueillons plusieurs types de contributions :

#### 🐛 Signalement de Bugs
- Utilisez les templates d'issues GitHub
- Fournissez des informations détaillées
- Incluez des captures d'écran si pertinent
- Testez sur différents appareils/navigateurs

#### ✨ Nouvelles Fonctionnalités
- Discutez d'abord de l'idée dans une issue
- Assurez-vous qu'elle s'aligne avec la vision du projet
- Proposez une implémentation détaillée
- Considérez l'impact sur l'UX existante

#### 📚 Documentation
- Améliorations du README
- Guides utilisateur
- Documentation technique
- Commentaires de code

#### 🎨 Design et UX
- Améliorations de l'interface
- Optimisations d'accessibilité
- Responsive design
- Animations et transitions

### Processus de Contribution

1. **🍴 Fork** le repository
2. **🌿 Créer** une branche feature
3. **💻 Développer** votre contribution
4. **🧪 Tester** vos modifications
5. **📝 Documenter** les changements
6. **🔄 Soumettre** une Pull Request

---

## 💻 Standards de Développement

### Technologies et Versions

#### Versions Requises
```json
{
  "node": ">=18.0.0",
  "npm": ">=9.0.0",
  "ionic": ">=7.0.0",
  "angular": ">=19.0.0"
}
```

#### Stack Technique
- **Frontend** : Ionic 8 + Angular 19 + TypeScript 5.6
- **Styling** : SCSS + Bootstrap 5 + Variables CSS
- **State Management** : Services Angular + RxJS
- **Testing** : Jasmine + Karma + Protractor
- **Build** : Angular CLI + Capacitor

### Standards de Code

#### TypeScript
```typescript
// ✅ Bon exemple
interface UserProfile {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private readonly apiUrl = 'https://api.example.com';
  
  async getUserProfile(userId: number): Promise<UserProfile> {
    try {
      const response = await this.http.get<UserProfile>(`${this.apiUrl}/users/${userId}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}
```

#### HTML/Templates
```html
<!-- ✅ Bon exemple -->
<ion-content class="ion-padding">
  <ion-card class="user-card">
    <ion-card-header>
      <ion-card-title>{{ 'user.profile.title' | translate }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item *ngFor="let user of users; trackBy: trackByUserId">
        <ion-avatar slot="start">
          <img [src]="user.avatar || 'assets/images/default-avatar.png'" 
               [alt]="user.name">
        </ion-avatar>
        <ion-label>
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
        </ion-label>
      </ion-item>
    </ion-card-content>
  </ion-card>
</ion-content>
```

#### SCSS
```scss
// ✅ Bon exemple
.user-card {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease-in-out;
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid var(--ion-color-primary);
  }
}
```

### Conventions de Nommage

#### Fichiers et Dossiers
```
src/
├── app/
│   ├── pages/
│   │   ├── user-profile/           # kebab-case
│   │   │   ├── user-profile.page.ts
│   │   │   ├── user-profile.page.html
│   │   │   └── user-profile.page.scss
│   ├── services/
│   │   ├── auth.service.ts         # kebab-case
│   │   └── user.service.ts
│   └── components/
│       ├── user-card/              # kebab-case
│       └── loading-spinner/
```

#### Variables et Fonctions
```typescript
// ✅ Bon exemple
const userProfileData = {};           // camelCase
const API_BASE_URL = '';             // SCREAMING_SNAKE_CASE pour les constantes
let isUserLoggedIn = false;          // camelCase avec préfixes descriptifs

function getUserProfile() {}         // camelCase
function validateEmailAddress() {}   // camelCase descriptif
```

#### Classes et Interfaces
```typescript
// ✅ Bon exemple
interface UserProfile {}            // PascalCase
class UserService {}                 // PascalCase
enum UserRole {}                     // PascalCase
type UserStatus = 'active' | 'inactive';  // PascalCase
```

---

## 🔄 Processus de Développement

### Workflow Git

#### Branches
```bash
main                    # Production stable
├── develop            # Intégration des features
├── feature/user-auth  # Nouvelles fonctionnalités
├── bugfix/login-error # Corrections de bugs
└── hotfix/security    # Corrections urgentes
```

#### Commits
Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types de commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, point-virgules manquants, etc.
refactor: refactoring du code
test: ajout de tests
chore: maintenance

# Exemples
feat(auth): ajouter authentification 2FA
fix(reservation): corriger bug de date
docs(readme): mettre à jour guide installation
style(user-profile): améliorer responsive design
```

#### Pull Requests

**Template de PR :**
```markdown
## 📝 Description
Brève description des changements

## 🎯 Type de Changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 💥 Breaking change
- [ ] 📚 Documentation

## 🧪 Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests e2e ajoutés/mis à jour
- [ ] Tests manuels effectués

## 📱 Compatibilité
- [ ] iOS testé
- [ ] Android testé
- [ ] Web testé
- [ ] Responsive testé

## 📸 Screenshots
[Ajouter des captures d'écran si pertinent]

## ✅ Checklist
- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Tests passent
- [ ] Pas de conflits de merge
```

### Environnements

#### Développement Local
```bash
# Installation
npm install

# Serveur de développement
ionic serve

# Tests
npm run test
npm run e2e
npm run lint
```

#### Staging
```bash
# Build de test
ionic build --configuration=staging

# Tests d'intégration
npm run test:integration
```

#### Production
```bash
# Build optimisé
ionic build --prod

# Tests de performance
npm run test:performance
```

---

## 🧪 Tests et Qualité

### Types de Tests

#### Tests Unitaires
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch user profile', () => {
    const mockUser = { id: 1, name: 'Test User' };
    
    service.getUserProfile(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

#### Tests d'Intégration
```typescript
// user-profile.page.spec.ts
describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfilePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
  });

  it('should display user information', () => {
    component.user = { name: 'Test User', email: 'test@example.com' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-name').textContent).toContain('Test User');
  });
});
```

### Outils de Qualité

#### ESLint Configuration
```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Scripts de Qualité
```bash
# Linting
npm run lint              # Vérifier le code
npm run lint:fix          # Corriger automatiquement

# Tests
npm run test              # Tests unitaires
npm run test:coverage     # Couverture de code
npm run e2e               # Tests end-to-end

# Build
npm run build             # Build de développement
npm run build:prod        # Build de production
```

---

## 📚 Documentation

### Documentation du Code

#### Commentaires TypeScript
```typescript
/**
 * Service pour gérer l'authentification des utilisateurs
 * 
 * @example
 * ```typescript
 * const authService = new AuthService();
 * const isLoggedIn = await authService.login('user@example.com', 'password');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  /**
   * Connecte un utilisateur avec email et mot de passe
   * 
   * @param email - L'adresse email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   * @returns Promise<boolean> - True si la connexion réussit
   * 
   * @throws {AuthError} Quand les identifiants sont invalides
   */
  async login(email: string, password: string): Promise<boolean> {
    // Implémentation...
  }
}
```

#### Documentation des Composants
```typescript
/**
 * Composant pour afficher et éditer le profil utilisateur
 * 
 * @component UserProfileComponent
 * 
 * @example
 * ```html
 * <app-user-profile 
 *   [user]="currentUser" 
 *   (userUpdated)="onUserUpdated($event)">
 * </app-user-profile>
 * ```
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  /** Données de l'utilisateur à afficher */
  @Input() user: User;
  
  /** Événement émis quand l'utilisateur est mis à jour */
  @Output() userUpdated = new EventEmitter<User>();
}
```

### README des Modules

Chaque module important doit avoir son README :

```markdown
# Module de Réservation

## Description
Ce module gère toutes les fonctionnalités liées aux réservations de courts.

## Composants
- `ReservationListComponent` - Liste des réservations
- `ReservationFormComponent` - Formulaire de réservation
- `ReservationDetailComponent` - Détails d'une réservation

## Services
- `ReservationService` - API des réservations
- `CalendarService` - Gestion du calendrier

## Usage
```typescript
import { ReservationModule } from './reservation/reservation.module';

@NgModule({
  imports: [ReservationModule]
})
export class AppModule {}
```
```

---

## 🔧 Outils de Développement

### Extensions VS Code Recommandées

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ionic.ionic",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Configuration Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Scripts Utiles

```json
{
  "scripts": {
    "start": "ionic serve",
    "build": "ionic build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "analyze": "npx webpack-bundle-analyzer www/static/js/*.js",
    "clean": "rm -rf www node_modules",
    "fresh-install": "npm run clean && npm install"
  }
}
```

---

## 🆘 Support

### Obtenir de l'Aide

#### Canaux de Communication
- **📧 Email** : ytangara2003@gmail.com // naghachmouhsine@gmail.com
- **💬 Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **📚 Documentation** : Consultez d'abord la documentation existante

#### Informations à Fournir
Quand vous demandez de l'aide, incluez :
- **🔧 Version** de l'application
- **📱 Environnement** (OS, navigateur, appareil)
- **📝 Description** détaillée du problème
- **🔄 Étapes** pour reproduire
- **📸 Captures d'écran** si pertinent
- **📋 Logs** d'erreur

### Signalement de Bugs

#### Template d'Issue
```markdown
**🐛 Description du Bug**
Description claire et concise du bug.

**🔄 Étapes pour Reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

**✅ Comportement Attendu**
Description de ce qui devrait se passer.

**📱 Environnement**
- OS: [ex. iOS 15, Android 12, Windows 11]
- Navigateur: [ex. Chrome 96, Safari 15]
- Version de l'app: [ex. 2.1.0]

**📸 Captures d'écran**
Si applicable, ajoutez des captures d'écran.

**📋 Logs**
```
Coller les logs d'erreur ici
```

**ℹ️ Informations Supplémentaires**
Tout autre contexte utile.
```

---

## 🏆 Reconnaissance

### Contributeurs

Nous remercions tous les contributeurs qui ont participé au développement :

- **Youssouf Tangara** - Développeur Principal Frontend
- **Naghach Mouhsine** - Développeur Principal Backend
- **Royal Tennis Club de Fès** - Client et sponsor du projet

### Comment Être Reconnu

- **📝 Contributions de code** : Votre nom sera ajouté aux contributeurs
- **🐛 Signalement de bugs** : Mention dans les notes de version
- **📚 Documentation** : Crédit dans la section documentation
- **🎨 Design** : Reconnaissance dans les crédits design

---

## 📄 Licence et Droits

### Licence Propriétaire

Ce projet est sous licence propriétaire. En contribuant, vous acceptez que :
- Vos contributions deviennent propriété du Royal Tennis Club de Fès
- Vous conservez le crédit de vos contributions
- Vous ne pouvez pas utiliser le code à des fins commerciales externes

### Accord de Contribution

En soumettant une contribution, vous certifiez que :
- Vous avez le droit de soumettre cette contribution
- Votre contribution est votre travail original
- Vous acceptez les termes de la licence du projet

---

## 🎯 Roadmap et Vision

### Vision du Projet
Créer l'application de gestion de club sportif la plus intuitive et complète du Maroc, offrant une expérience premium aux membres du Royal Tennis Club de Fès.

### Objectifs à Court Terme (3 mois)
- ✅ Multilingue complet
- ✅ Application mobile native
- 🔄 Système de paiement avancé
- 🔄 Notifications intelligentes

### Objectifs à Moyen Terme (6 mois)
- 🎯 Assistant IA personnalisé
- 🎯 Intégration IoT (courts connectés)
- 🎯 Réalité augmentée pour les visites
- 🎯 Système de coaching en ligne

### Objectifs à Long Terme (1 an)
- 🚀 Expansion vers d'autres clubs
- 🚀 Marketplace d'équipements sportifs
- 🚀 Réseau social des membres
- 🚀 Certification internationale

---

Merci de contribuer au succès du Royal Tennis Club de Fès ! 🎾

---

*Document mis à jour le : 12 juillet 2025*  
*© 2025 Royal Tennis Club de Fès - Tous droits réservés*