import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DiagnosticService } from '../../services/diagnostic.service';
import { OverlayManagerService } from '../../services/overlay-manager.service';
import { MemoryLeakDetectorService } from '../../services/memory-leak-detector.service';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-diagnostic-panel',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="showPanel" class="diagnostic-panel">
      <ion-card-header>
        <ion-card-title>
          <ion-icon name="pulse-outline"></ion-icon>
          Diagnostic de l'Application
          <ion-button fill="clear" size="small" (click)="togglePanel()" slot="end">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-card-title>
      </ion-card-header>
      
      <ion-card-content>
        <!-- Status général -->
        <div class="status-section">
          <h4>État Général</h4>
          <ion-chip [color]="getHealthColor()">
            <ion-icon [name]="getHealthIcon()"></ion-icon>
            <ion-label>{{ getHealthStatus() }}</ion-label>
          </ion-chip>
        </div>

        <!-- Métriques en temps réel -->
        <div class="metrics-section" *ngIf="currentReport">
          <h4>Métriques</h4>
          
          <ion-item lines="none">
            <ion-icon name="layers-outline" slot="start"></ion-icon>
            <ion-label>
              <h3>Overlays Actifs</h3>
              <p>{{ currentReport.applicationHealth.overlayCount }}</p>
            </ion-label>
            <ion-badge slot="end" [color]="currentReport.applicationHealth.overlayCount > 2 ? 'warning' : 'success'">
              {{ currentReport.applicationHealth.overlayCount }}
            </ion-badge>
          </ion-item>

          <ion-item lines="none" *ngIf="currentReport.applicationHealth.memoryUsage">
            <ion-icon name="hardware-chip-outline" slot="start"></ion-icon>
            <ion-label>
              <h3>Mémoire Utilisée</h3>
              <p>{{ formatBytes(currentReport.applicationHealth.memoryUsage.used) }} / {{ formatBytes(currentReport.applicationHealth.memoryUsage.limit) }}</p>
            </ion-label>
            <ion-badge slot="end" [color]="getMemoryColor()">
              {{ getMemoryPercentage() }}%
            </ion-badge>
          </ion-item>

          <ion-item lines="none">
            <ion-icon name="time-outline" slot="start"></ion-icon>
            <ion-label>
              <h3>Dernière Interaction</h3>
              <p>{{ getTimeSinceLastInteraction() }}</p>
            </ion-label>
          </ion-item>
        </div>

        <!-- Problèmes détectés -->
        <div class="issues-section" *ngIf="currentReport?.recommendations.length > 0">
          <h4>Problèmes Détectés</h4>
          <ion-list>
            <ion-item *ngFor="let recommendation of currentReport.recommendations" lines="none">
              <ion-icon [name]="getRecommendationIcon(recommendation)" slot="start" [color]="getRecommendationColor(recommendation)"></ion-icon>
              <ion-label class="ion-text-wrap">
                {{ recommendation }}
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

        <!-- Actions rapides -->
        <div class="actions-section">
          <h4>Actions Rapides</h4>
          <ion-button expand="block" fill="outline" (click)="runDiagnostic()">
            <ion-icon name="scan-outline" slot="start"></ion-icon>
            Lancer Diagnostic
          </ion-button>
          
          <ion-button expand="block" fill="outline" (click)="clearOverlays()">
            <ion-icon name="layers-outline" slot="start"></ion-icon>
            Nettoyer Overlays
          </ion-button>
          
          <ion-button expand="block" fill="outline" (click)="exportReport()">
            <ion-icon name="download-outline" slot="start"></ion-icon>
            Exporter Rapport
          </ion-button>
          
          <ion-button expand="block" color="warning" (click)="forceReload()">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            Recharger Application
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    <!-- Bouton flottant pour ouvrir le panel -->
    <ion-fab vertical="bottom" horizontal="end" *ngIf="!showPanel && isDevelopment">
      <ion-fab-button size="small" (click)="togglePanel()">
        <ion-icon name="pulse-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    .diagnostic-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }

    .status-section, .metrics-section, .issues-section, .actions-section {
      margin-bottom: 16px;
    }

    .status-section h4, .metrics-section h4, .issues-section h4, .actions-section h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--ion-color-medium);
    }

    ion-button {
      margin: 4px 0;
    }

    @media (max-width: 768px) {
      .diagnostic-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-height: 100vh;
        border-radius: 0;
      }
    }
  `]
})
export class DiagnosticPanelComponent implements OnInit, OnDestroy {
  showPanel = false;
  isDevelopment = isDevelopment;
  currentReport: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private diagnosticService: DiagnosticService,
    private overlayManager: OverlayManagerService,
    private memoryDetector: MemoryLeakDetectorService
  ) {}

  ngOnInit() {
    // Mise à jour automatique toutes les 5 secondes
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.showPanel) {
          this.updateReport();
        }
      });

    // Écouter les raccourcis clavier pour ouvrir le panel
    document.addEventListener('keydown', (event) => {
      // Ctrl + Shift + D pour ouvrir le diagnostic
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        this.togglePanel();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
    if (this.showPanel) {
      this.updateReport();
    }
  }

  updateReport() {
    this.currentReport = this.diagnosticService.generateDiagnosticReport();
  }

  getHealthStatus(): string {
    if (!this.currentReport) return 'Chargement...';
    
    const critical = this.currentReport.recommendations.some((r: string) => r.includes('🚨 CRITIQUE'));
    const warnings = this.currentReport.recommendations.length;
    
    if (critical) return 'CRITIQUE';
    if (warnings > 0) return 'ATTENTION';
    return 'SAIN';
  }

  getHealthColor(): string {
    const status = this.getHealthStatus();
    switch (status) {
      case 'CRITIQUE': return 'danger';
      case 'ATTENTION': return 'warning';
      case 'SAIN': return 'success';
      default: return 'medium';
    }
  }

  getHealthIcon(): string {
    const status = this.getHealthStatus();
    switch (status) {
      case 'CRITIQUE': return 'alert-circle';
      case 'ATTENTION': return 'warning';
      case 'SAIN': return 'checkmark-circle';
      default: return 'help-circle';
    }
  }

  getMemoryPercentage(): number {
    if (!this.currentReport?.applicationHealth.memoryUsage) return 0;
    const mem = this.currentReport.applicationHealth.memoryUsage;
    return Math.round((mem.used / mem.limit) * 100);
  }

  getMemoryColor(): string {
    const percentage = this.getMemoryPercentage();
    if (percentage > 80) return 'danger';
    if (percentage > 60) return 'warning';
    return 'success';
  }

  getTimeSinceLastInteraction(): string {
    if (!this.currentReport) return 'N/A';
    
    const timeDiff = Date.now() - this.currentReport.performanceMetrics.lastInteractionTime;
    const seconds = Math.floor(timeDiff / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }

  getRecommendationIcon(recommendation: string): string {
    if (recommendation.includes('🚨 CRITIQUE')) return 'alert-circle';
    if (recommendation.includes('⚠️')) return 'warning';
    if (recommendation.includes('🧹')) return 'trash';
    if (recommendation.includes('🧠')) return 'hardware-chip';
    if (recommendation.includes('⏰')) return 'time';
    if (recommendation.includes('🐌')) return 'speedometer';
    return 'information-circle';
  }

  getRecommendationColor(recommendation: string): string {
    if (recommendation.includes('🚨 CRITIQUE')) return 'danger';
    if (recommendation.includes('⚠️')) return 'warning';
    return 'primary';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  runDiagnostic() {
    this.updateReport();
    this.diagnosticService.logDiagnosticSummary();
  }

  async clearOverlays() {
    try {
      await this.overlayManager.dismissAllOverlays();
      this.updateReport();
    } catch (error) {
      console.error('Erreur lors du nettoyage des overlays:', error);
    }
  }

  exportReport() {
    const report = this.diagnosticService.exportDiagnosticReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  forceReload() {
    if (confirm('Êtes-vous sûr de vouloir recharger l\'application ?')) {
      window.location.reload();
    }
  }
}

// Vérification de l'environnement de développement
const isDevelopment = !window.location.hostname.includes('prod') && 
                     (window.location.hostname === 'localhost' || 
                      window.location.hostname.includes('dev'));