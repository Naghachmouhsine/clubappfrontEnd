import { Injectable, NgZone } from '@angular/core';
import { OverlayManagerService } from './overlay-manager.service';
import { MemoryLeakDetectorService } from './memory-leak-detector.service';

interface DiagnosticReport {
  timestamp: string;
  applicationHealth: {
    canInteractWithDOM: boolean;
    hasActiveOverlays: boolean;
    overlayCount: number;
    memoryUsage?: any;
    navigationInProgress: boolean;
  };
  domHealth: {
    ionAppExists: boolean;
    ionAppInteractive: boolean;
    orphanedOverlays: string[];
    eventListenersCount: number;
  };
  performanceMetrics: {
    memoryStats?: any;
    renderingTime: number;
    lastInteractionTime: number;
  };
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  private lastInteractionTime = Date.now();
  private diagnosticHistory: DiagnosticReport[] = [];
  private readonly MAX_HISTORY = 20;

  constructor(
    private overlayManager: OverlayManagerService,
    private memoryDetector: MemoryLeakDetectorService,
    private ngZone: NgZone
  ) {
    this.setupInteractionTracking();
  }

  /**
   * 🔧 Configure le suivi des interactions
   */
  private setupInteractionTracking(): void {
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    
    events.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.lastInteractionTime = Date.now();
      }, { passive: true });
    });
  }

  /**
   * 🔧 Génère un rapport de diagnostic complet
   */
  generateDiagnosticReport(): DiagnosticReport {
    const report: DiagnosticReport = {
      timestamp: new Date().toISOString(),
      applicationHealth: this.checkApplicationHealth(),
      domHealth: this.checkDOMHealth(),
      performanceMetrics: this.getPerformanceMetrics(),
      recommendations: []
    };

    // Générer des recommandations basées sur le diagnostic
    report.recommendations = this.generateRecommendations(report);

    // Ajouter à l'historique
    this.diagnosticHistory.push(report);
    if (this.diagnosticHistory.length > this.MAX_HISTORY) {
      this.diagnosticHistory.shift();
    }

    return report;
  }

  /**
   * 🔧 Vérifie la santé de l'application
   */
  private checkApplicationHealth(): DiagnosticReport['applicationHealth'] {
    return {
      canInteractWithDOM: this.canInteractWithDOM(),
      hasActiveOverlays: this.overlayManager.hasActiveOverlays(),
      overlayCount: this.overlayManager.getActiveOverlaysCount(),
      memoryUsage: this.memoryDetector.getCurrentMemoryStats(),
      navigationInProgress: this.isNavigationInProgress()
    };
  }

  /**
   * 🔧 Vérifie la santé du DOM
   */
  private checkDOMHealth(): DiagnosticReport['domHealth'] {
    const ionApp = document.querySelector('ion-app');
    
    return {
      ionAppExists: !!ionApp,
      ionAppInteractive: this.isElementInteractive(ionApp),
      orphanedOverlays: this.findOrphanedOverlays(),
      eventListenersCount: this.estimateEventListenersCount()
    };
  }

  /**
   * 🔧 Obtient les métriques de performance
   */
  private getPerformanceMetrics(): DiagnosticReport['performanceMetrics'] {
    return {
      memoryStats: this.memoryDetector.getCurrentMemoryStats(),
      renderingTime: this.measureRenderingTime(),
      lastInteractionTime: this.lastInteractionTime
    };
  }

  /**
   * 🔧 Vérifie si on peut interagir avec le DOM
   */
  private canInteractWithDOM(): boolean {
    try {
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.top = '-9999px';
      
      document.body.appendChild(testElement);
      const canAppend = document.body.contains(testElement);
      document.body.removeChild(testElement);
      
      return canAppend;
    } catch (error) {
      return false;
    }
  }

  /**
   * 🔧 Vérifie si un élément est interactif
   */
  private isElementInteractive(element: Element | null): boolean {
    if (!element) return false;
    
    try {
      const computedStyle = window.getComputedStyle(element);
      return computedStyle.pointerEvents !== 'none' && 
             computedStyle.visibility !== 'hidden' &&
             computedStyle.display !== 'none';
    } catch (error) {
      return false;
    }
  }

  /**
   * 🔧 Trouve les overlays orphelins
   */
  private findOrphanedOverlays(): string[] {
    const overlaySelectors = [
      'ion-modal:not(.ion-page)',
      'ion-popover:not(.ion-page)', 
      'ion-loading:not(.ion-page)',
      'ion-alert:not(.ion-page)',
      'ion-backdrop:not([style*="opacity"])',
      '.modal-backdrop:not(.show)',
      '.popover-backdrop:not(.show)'
    ];

    const orphaned: string[] = [];
    
    overlaySelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        orphaned.push(`${selector} (${elements.length})`);
      }
    });

    return orphaned;
  }

  /**
   * 🔧 Estime le nombre d'event listeners
   */
  private estimateEventListenersCount(): number {
    // Note: Il n'y a pas de moyen direct de compter les event listeners
    // Ceci est une estimation basée sur les éléments avec des attributs d'événements
    const elementsWithEvents = document.querySelectorAll('[onclick], [onchange], [onsubmit], [onload]');
    return elementsWithEvents.length;
  }

  /**
   * 🔧 Vérifie si une navigation est en cours
   */
  private isNavigationInProgress(): boolean {
    // Vérifier s'il y a des éléments avec l'attribut disabled="navigationInProgress"
    const disabledElements = document.querySelectorAll('[disabled]');
    return disabledElements.length > 0;
  }

  /**
   * 🔧 Mesure le temps de rendu
   */
  private measureRenderingTime(): number {
    const start = performance.now();
    
    // Forcer un reflow
    document.body.offsetHeight;
    
    return performance.now() - start;
  }

  /**
   * 🔧 Génère des recommandations basées sur le diagnostic
   */
  private generateRecommendations(report: DiagnosticReport): string[] {
    const recommendations: string[] = [];

    // Recommandations basées sur la santé de l'application
    if (!report.applicationHealth.canInteractWithDOM) {
      recommendations.push('🚨 CRITIQUE: Impossible d\'interagir avec le DOM - Redémarrage recommandé');
    }

    if (report.applicationHealth.hasActiveOverlays && report.applicationHealth.overlayCount > 3) {
      recommendations.push('⚠️ Trop d\'overlays actifs - Nettoyer les modales/popovers');
    }

    if (report.applicationHealth.memoryUsage) {
      const memUsage = report.applicationHealth.memoryUsage;
      const usagePercent = (memUsage.used / memUsage.limit) * 100;
      
      if (usagePercent > 80) {
        recommendations.push('🧠 Utilisation mémoire élevée - Vérifier les fuites mémoire');
      }
    }

    // Recommandations basées sur la santé du DOM
    if (!report.domHealth.ionAppExists) {
      recommendations.push('🚨 CRITIQUE: ion-app manquant - Structure DOM corrompue');
    }

    if (!report.domHealth.ionAppInteractive) {
      recommendations.push('🚨 CRITIQUE: ion-app non interactif - Interface bloquée');
    }

    if (report.domHealth.orphanedOverlays.length > 0) {
      recommendations.push(`🧹 Nettoyer les overlays orphelins: ${report.domHealth.orphanedOverlays.join(', ')}`);
    }

    // Recommandations basées sur les performances
    const timeSinceLastInteraction = Date.now() - report.performanceMetrics.lastInteractionTime;
    if (timeSinceLastInteraction > 30000) { // 30 secondes
      recommendations.push('⏰ Aucune interaction depuis 30s - Application potentiellement figée');
    }

    if (report.performanceMetrics.renderingTime > 16) { // 60fps = 16ms par frame
      recommendations.push('🐌 Rendu lent détecté - Optimiser les performances');
    }

    return recommendations;
  }

  /**
   * 🔧 Effectue un diagnostic automatique et retourne les actions recommandées
   */
  performAutoDiagnostic(): { critical: boolean; actions: string[] } {
    const report = this.generateDiagnosticReport();
    
    const criticalIssues = report.recommendations.filter(r => r.includes('🚨 CRITIQUE'));
    const isCritical = criticalIssues.length > 0;
    
    const actions: string[] = [];
    
    if (isCritical) {
      actions.push('Redémarrer l\'application (F5)');
    } else {
      // Actions de récupération automatique
      if (report.applicationHealth.hasActiveOverlays) {
        actions.push('Fermer tous les overlays');
      }
      
      if (report.domHealth.orphanedOverlays.length > 0) {
        actions.push('Nettoyer les overlays orphelins');
      }
      
      if (report.performanceMetrics.memoryStats) {
        const memUsage = report.performanceMetrics.memoryStats;
        const usagePercent = (memUsage.used / memUsage.limit) * 100;
        
        if (usagePercent > 70) {
          actions.push('Déclencher le garbage collection');
        }
      }
    }

    return { critical: isCritical, actions };
  }

  /**
   * 🔧 Obtient l'historique des diagnostics
   */
  getDiagnosticHistory(): DiagnosticReport[] {
    return [...this.diagnosticHistory];
  }

  /**
   * 🔧 Exporte le rapport de diagnostic pour le débogage
   */
  exportDiagnosticReport(): string {
    const report = this.generateDiagnosticReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * 🔧 Affiche un résumé du diagnostic dans la console
   */
  logDiagnosticSummary(): void {
    const report = this.generateDiagnosticReport();
    
    console.group('🔍 Diagnostic de l\'application');
    console.log('⏰ Timestamp:', report.timestamp);
    
    console.group('🏥 Santé de l\'application');
    console.log('DOM interactif:', report.applicationHealth.canInteractWithDOM ? '✅' : '❌');
    console.log('Overlays actifs:', report.applicationHealth.overlayCount);
    console.log('Navigation en cours:', report.applicationHealth.navigationInProgress ? '🔄' : '✅');
    console.groupEnd();
    
    console.group('🌐 Santé du DOM');
    console.log('ion-app existe:', report.domHealth.ionAppExists ? '✅' : '❌');
    console.log('ion-app interactif:', report.domHealth.ionAppInteractive ? '✅' : '❌');
    console.log('Overlays orphelins:', report.domHealth.orphanedOverlays);
    console.groupEnd();
    
    if (report.recommendations.length > 0) {
      console.group('💡 Recommandations');
      report.recommendations.forEach(rec => console.log(rec));
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}