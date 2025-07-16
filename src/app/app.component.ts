import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { IonicModule, MenuController, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ProfileMenuComponent } from './pages/profile-menu/profile-menu.component';
import { DiagnosticPanelComponent } from './components/diagnostic-panel/diagnostic-panel.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ThemeService, ThemeType } from './services/theme.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RecempenseService } from './services/recempense.service';
import { AuthService } from './services/auth.service';
import { OverlayManagerService } from './services/overlay-manager.service';
import { MemoryLeakDetectorService } from './services/memory-leak-detector.service';
import { GlobalEventManagerService } from './services/global-event-manager.service';
import { DiagnosticService } from './services/diagnostic.service';
import { Subscription, Subject, interval } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    AppHeaderComponent,
    DiagnosticPanelComponent,
    TranslateModule
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  user: any = null;
  isDashboardOpen = false;
  theme: ThemeType = 'auto';
  loginIn: boolean = false;
  
  // 🔧 Gestion améliorée des subscriptions
  private destroy$ = new Subject<void>();
  public navigationInProgress = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private popoverController: PopoverController,
    private themeService: ThemeService,
    private translate: TranslateService,
    private http: HttpClient,
    private servicePoints: RecempenseService,
    private serviceAuth: AuthService,
    private overlayManager: OverlayManagerService,
    private memoryDetector: MemoryLeakDetectorService,
    private globalEventManager: GlobalEventManagerService,
    private diagnosticService: DiagnosticService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    const lang = localStorage.getItem('lang') || 'fr';
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  ngOnInit() {
    // 🔧 Initialiser la gestion des événements globaux
    this.globalEventManager.initialize();
    
    // 🔧 Démarrer la surveillance mémoire
    this.memoryDetector.startMonitoring();
    
    // 🔧 Démarrer la surveillance diagnostique
    this.startHealthMonitoring();
    
    // 🔧 Auth reactive avec gestion des erreurs améliorée
    this.serviceAuth.isLoggedIn$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(100)
      )
      .subscribe({
        next: (isLoggedIn) => {
          this.ngZone.run(() => {
            this.loginIn = isLoggedIn;
            if (isLoggedIn) {
              this.loadUserData();
            } else {
              this.user = null;
            }
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error('Erreur auth stream:', err)
      });

    // 🔧 Navigation avec protection contre les blocages
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(50)
      )
      .subscribe({
        next: (event) => {
          this.ngZone.run(() => {
            if (event instanceof NavigationEnd) {
              this.navigationInProgress = false;
              this.forceCloseMenuOnNavigation();
            }
          });
        },
        error: (err) => console.error('Erreur navigation:', err)
      });
  }

  /**
   * 🔧 Force la fermeture du menu lors de la navigation
   */
  private forceCloseMenuOnNavigation(): void {
    this.menuCtrl.close('main-menu').catch(() => {
      // Ignore les erreurs de fermeture
    });
  }

  /**
   * 🔧 Démarre la surveillance de santé de l'application
   */
  private startHealthMonitoring(): void {
    // Surveillance périodique toutes les 30 secondes
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.performHealthCheck();
      });

    // Surveillance immédiate en cas de problème détecté
    this.setupEmergencyHealthCheck();
  }

  /**
   * 🔧 Effectue une vérification de santé
   */
  private performHealthCheck(): void {
    this.ngZone.runOutsideAngular(() => {
      const diagnostic = this.diagnosticService.performAutoDiagnostic();
      
      if (diagnostic.critical) {
        console.error('🚨 Problème critique détecté:', diagnostic.actions);
        this.handleCriticalIssue(diagnostic.actions);
      } else if (diagnostic.actions.length > 0) {
        console.warn('⚠️ Actions de récupération recommandées:', diagnostic.actions);
        this.performRecoveryActions(diagnostic.actions);
      }
    });
  }

  /**
   * 🔧 Configure la vérification d'urgence
   */
  private setupEmergencyHealthCheck(): void {
    // Vérification lors des événements critiques
    const criticalEvents = ['error', 'unhandledrejection'];
    
    criticalEvents.forEach(eventType => {
      window.addEventListener(eventType, () => {
        setTimeout(() => {
          this.performHealthCheck();
        }, 1000);
      });
    });
  }

  /**
   * 🔧 Gère les problèmes critiques
   */
  private handleCriticalIssue(actions: string[]): void {
    this.ngZone.run(() => {
      console.error('🚨 PROBLÈME CRITIQUE DÉTECTÉ - Actions requises:', actions);
      
      // Afficher un diagnostic détaillé
      this.diagnosticService.logDiagnosticSummary();
      
      // Tentative de récupération automatique
      this.performEmergencyRecovery();
    });
  }

  /**
   * 🔧 Effectue une récupération d'urgence
   */
  private async performEmergencyRecovery(): Promise<void> {
    try {
      console.log('🔧 Tentative de récupération d\'urgence...');
      
      // 1. Fermer tous les overlays
      await this.overlayManager.dismissAllOverlays();
      
      // 2. Nettoyer les event listeners
      this.globalEventManager.destroy();
      this.globalEventManager.initialize();
      
      // 3. Forcer la détection de changements
      this.cdr.detectChanges();
      
      // 4. Réinitialiser l'état de navigation
      this.navigationInProgress = false;
      
      console.log('✅ Récupération d\'urgence terminée');
      
    } catch (error) {
      console.error('❌ Échec de la récupération d\'urgence:', error);
      this.showReloadRecommendation();
    }
  }

  /**
   * 🔧 Effectue les actions de récupération
   */
  private async performRecoveryActions(actions: string[]): Promise<void> {
    for (const action of actions) {
      try {
        if (action.includes('Fermer tous les overlays')) {
          await this.overlayManager.dismissAllOverlays();
        } else if (action.includes('Nettoyer les overlays orphelins')) {
          await this.cleanupOrphanedOverlays();
        } else if (action.includes('Déclencher le garbage collection')) {
          this.triggerGarbageCollection();
        }
      } catch (error) {
        console.warn(`Erreur lors de l'action "${action}":`, error);
      }
    }
  }

  /**
   * 🔧 Nettoie les overlays orphelins
   */
  private async cleanupOrphanedOverlays(): Promise<void> {
    const orphanedSelectors = [
      'ion-modal:not(.ion-page)',
      'ion-popover:not(.ion-page)',
      'ion-backdrop:not([style*="opacity"])',
      '.modal-backdrop:not(.show)'
    ];

    orphanedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        try {
          element.remove();
        } catch (e) {
          // Ignore
        }
      });
    });
  }

  /**
   * 🔧 Déclenche le garbage collection
   */
  private triggerGarbageCollection(): void {
    try {
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      // Forcer la libération de références
      this.cdr.detectChanges();
      
    } catch (error) {
      console.warn('Impossible de déclencher le GC:', error);
    }
  }

  /**
   * 🔧 Affiche une recommandation de rechargement
   */
  private showReloadRecommendation(): void {
    console.error(`
    🚨 RECOMMANDATION CRITIQUE 🚨
    
    L'application semble avoir des problèmes persistants.
    Actions recommandées:
    
    1. Appuyez sur F5 pour recharger la page
    2. Si le problème persiste, videz le cache du navigateur
    3. Contactez le support technique
    
    Diagnostic complet disponible dans la console.
    `);
    
    // Exporter le diagnostic pour le débogage
    const diagnosticReport = this.diagnosticService.exportDiagnosticReport();
    console.log('📋 Rapport de diagnostic complet:', diagnosticReport);
  }

  /**
   * 🔧 Charge les données utilisateur
   */
  private loadUserData(): void {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        this.user = JSON.parse(userInfo);
      }
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    }
  }

  /**
   * 🔧 Navigation sécurisée
   */
  async navigateTo(route: string): Promise<void> {
    if (this.navigationInProgress) {
      return;
    }
    
    this.navigationInProgress = true;
    this.isDashboardOpen = false;
    
    try {
      // 🎯 Fermeture sécurisée du menu et overlays
      await this.overlayManager.dismissAllOverlays();
      await this.safeCloseMenu();
      
      // 🎯 Navigation avec timeout
      const navigationPromise = this.router.navigate([route]);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Navigation timeout')), 5000)
      );
      
      await Promise.race([navigationPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('Erreur navigation vers', route, ':', error);
      this.navigationInProgress = false;
      
      // Récupération d'urgence
      if ((error as Error).message === 'Navigation timeout') {
        window.location.href = route;
      }
    }
  }

  /**
   * 🔧 Fermeture sécurisée du menu
   */
  private async safeCloseMenu(): Promise<void> {
    try {
      await this.menuCtrl.close('main-menu');
    } catch (error) {
      // Force la fermeture via DOM si nécessaire
      const menu = document.querySelector('ion-menu[menu-id="main-menu"]');
      if (menu) {
        menu.classList.remove('show-menu', 'menu-open');
        menu.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /**
   * 🔧 Toggle du sous-menu dashboard
   */
  toggleDashboardSubmenu(): void {
    this.isDashboardOpen = !this.isDashboardOpen;
  }

  /**
   * 🔧 Ouverture sécurisée du menu profil
   */
  async openProfileMenu(event: MouseEvent): Promise<void> {
    try {
      // 🔧 Vérifier qu'aucune modale n'est déjà ouverte
      const existingPopover = await this.popoverController.getTop();
      if (existingPopover) {
        await existingPopover.dismiss();
      }

      const menu = document.querySelector('ion-menu[menu-id="main-menu"]') as HTMLElement;
      if (menu) {
        menu.classList.remove('show-menu', 'menu-open');
        menu.setAttribute('aria-hidden', 'true');
      }

      const popover = await this.popoverController.create({
        component: ProfileMenuComponent,
        event: event,
        translucent: true,
        showBackdrop: true,
        backdropDismiss: true
      });

      // 🔧 Enregistrer l'overlay pour surveillance
      this.overlayManager.registerOverlay(popover);

      await popover.present();

      // 🔧 Nettoyage automatique à la fermeture
      popover.onDidDismiss().then(() => {
        this.overlayManager.unregisterOverlay(popover);
      });

    } catch (error) {
      console.error('Erreur ouverture menu profil:', error);
    }
  }

  /**
   * 🔧 Changement de langue sécurisé
   */
  async changeLanguage(lang: string): Promise<void> {
    try {
      await this.translate.use(lang).toPromise();
      localStorage.setItem('lang', lang);
      
      // Forcer la détection de changements
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('Erreur changement langue:', error);
      // Fallback
      window.location.reload();
    }
  }

  ngOnDestroy() {
    // 🔧 Nettoyer le gestionnaire d'événements globaux
    this.globalEventManager.destroy();
    
    // 🔧 Arrêter la surveillance mémoire
    this.memoryDetector.stopMonitoring();
    
    // 🔧 Nettoyage complet des subscriptions
    this.destroy$.next();
    this.destroy$.complete();
    
    // 🔧 Nettoyage des overlays via le service
    this.overlayManager.dismissAllOverlays();
  }
}