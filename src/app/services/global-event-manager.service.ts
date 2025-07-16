import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventManagerService {
  private destroy$ = new Subject<void>();
  private eventListeners = new Map<string, EventListener>();
  private isInitialized = false;

  constructor(private ngZone: NgZone) {}

  /**
   * 🔧 Initialise la gestion des événements globaux
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.setupGlobalEventListeners();
  }

  /**
   * 🔧 Configure les event listeners globaux
   */
  private setupGlobalEventListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      // 🔧 Gestion des erreurs JavaScript non capturées
      this.addGlobalListener('error', (event: Event) => {
        this.handleGlobalError(event as ErrorEvent);
      });

      // 🔧 Gestion des promesses rejetées non capturées
      this.addGlobalListener('unhandledrejection', (event: Event) => {
        this.handleUnhandledRejection(event as PromiseRejectionEvent);
      });

      // 🔧 Gestion des clics fantômes (ghost clicks)
      this.addGlobalListener('click', (event: Event) => {
        this.handleGlobalClick(event as MouseEvent);
      }, { passive: true });

      // 🔧 Gestion du focus perdu (peut indiquer un blocage)
      this.addGlobalListener('blur', () => {
        this.handleWindowBlur();
      });

      // 🔧 Gestion du retour de focus
      this.addGlobalListener('focus', () => {
        this.handleWindowFocus();
      });

      // 🔧 Gestion des changements de visibilité
      this.addGlobalListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
    });
  }

  /**
   * 🔧 Ajoute un event listener global avec nettoyage automatique
   */
  private addGlobalListener(
    event: string, 
    handler: EventListener, 
    options?: boolean | AddEventListenerOptions
  ): void {
    const wrappedHandler = (e: Event) => {
      try {
        handler(e);
      } catch (error) {
        console.error(`Erreur dans le handler ${event}:`, error);
      }
    };

    window.addEventListener(event, wrappedHandler, options);
    this.eventListeners.set(`${event}_${Date.now()}`, wrappedHandler);
  }

  /**
   * 🔧 Gère les erreurs JavaScript globales
   */
  private handleGlobalError(event: ErrorEvent): void {
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString()
    };

    console.error('🚨 Erreur JavaScript globale:', errorInfo);

    // Vérifier si c'est une erreur qui peut causer un blocage
    if (this.isBlockingError(event)) {
      this.handlePotentialBlockingError(errorInfo);
    }
  }

  /**
   * 🔧 Gère les promesses rejetées non capturées
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const errorInfo = {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString()
    };

    console.error('🚨 Promise rejetée non capturée:', errorInfo);
    event.preventDefault();

    if (this.isBlockingRejection(event)) {
      this.handlePotentialBlockingError(errorInfo);
    }
  }

  /**
   * 🔧 Gère les clics globaux pour détecter les problèmes
   */
  private handleGlobalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target && (
      target.hasAttribute('disabled') ||
      getComputedStyle(target).pointerEvents === 'none' ||
      getComputedStyle(target).visibility === 'hidden'
    )) {
      console.warn('🖱️ Clic sur élément non interactif:', {
        element: target.tagName,
        classes: target.className,
        disabled: target.hasAttribute('disabled')
      });
    }
  }

  /**
   * 🔧 Gère la perte de focus de la fenêtre
   */
  private handleWindowBlur(): void {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.cleanupStaleOverlays();
      }, 100);
    });
  }

  /**
   * 🔧 Gère le retour de focus
   */
  private handleWindowFocus(): void {
    this.ngZone.run(() => {
      this.checkApplicationHealth();
    });
  }

  /**
   * 🔧 Gère les changements de visibilité
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.cleanupOnHidden();
    } else {
      this.checkApplicationHealth();
    }
  }

  /**
   * 🔧 Détermine si une erreur peut causer un blocage
   */
  private isBlockingError(event: ErrorEvent): boolean {
    const blockingPatterns = [
      'Cannot read property',
      'Cannot read properties',
      'is not a function',
      'Maximum call stack',
      'Out of memory',
      'Script error'
    ];

    return blockingPatterns.some(pattern => 
      event.message.includes(pattern)
    );
  }

  /**
   * 🔧 Détermine si une promesse rejetée peut causer un blocage
   */
  private isBlockingRejection(event: PromiseRejectionEvent): boolean {
    const reason = String(event.reason);
    return reason.includes('timeout') || 
           reason.includes('network') ||
           reason.includes('abort');
  }

  /**
   * 🔧 Gère les erreurs potentiellement bloquantes
   */
  private handlePotentialBlockingError(errorInfo: any): void {
    console.error('🔥 Erreur potentiellement bloquante détectée:', errorInfo);
    
    this.ngZone.run(() => {
      setTimeout(() => {
        this.performRecoveryActions();
      }, 100);
    });
  }

  /**
   * 🔧 Effectue des actions de récupération
   */
  private performRecoveryActions(): void {
    try {
      this.cleanupStaleOverlays();
      this.forceChangeDetection();
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    }
  }

  /**
   * 🔧 Nettoie les overlays obsolètes
   */
  private cleanupStaleOverlays(): void {
    const staleSelectors = [
      'ion-backdrop:not([style*="opacity: 0.32"])',
      'ion-modal:not(.ion-page)',
      'ion-popover:not(.ion-page)',
      '.modal-backdrop:not(.show)'
    ];

    staleSelectors.forEach(selector => {
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
   * 🔧 Force la détection de changements
   */
  private forceChangeDetection(): void {
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * 🔧 Vérifie la santé de l'application
   */
  private checkApplicationHealth(): void {
    const healthCheck = {
      canInteract: this.canInteractWithDOM(),
      hasActiveOverlays: this.hasActiveOverlays(),
      timestamp: new Date().toISOString()
    };

    if (!healthCheck.canInteract) {
      console.warn('⚠️ Application potentiellement bloquée:', healthCheck);
      this.performRecoveryActions();
    }
  }

  /**
   * 🔧 Vérifie si on peut interagir avec le DOM
   */
  private canInteractWithDOM(): boolean {
    try {
      const testElement = document.createElement('div');
      document.body.appendChild(testElement);
      document.body.removeChild(testElement);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 🔧 Vérifie s'il y a des overlays actifs
   */
  private hasActiveOverlays(): boolean {
    const overlaySelectors = [
      'ion-modal',
      'ion-popover',
      'ion-loading',
      'ion-alert',
      'ion-backdrop'
    ];

    return overlaySelectors.some(selector => 
      document.querySelector(selector) !== null
    );
  }

  /**
   * 🔧 Nettoie lors du masquage de la page
   */
  private cleanupOnHidden(): void {
    this.cleanupStaleOverlays();
  }

  /**
   * 🔧 Nettoie le service
   */
  destroy(): void {
    this.eventListeners.forEach((handler, key) => {
      const eventType = key.split('_')[0];
      window.removeEventListener(eventType, handler);
    });
    
    this.eventListeners.clear();
    this.destroy$.next();
    this.destroy$.complete();
    this.isInitialized = false;
  }
}