import { Injectable, NgZone } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class MemoryLeakDetectorService {
  private destroy$ = new Subject<void>();
  private memoryHistory: MemoryStats[] = [];
  private readonly MAX_HISTORY = 50;
  private readonly MEMORY_THRESHOLD = 100 * 1024 * 1024; // 100MB
  private isMonitoring = false;

  constructor(private ngZone: NgZone) {}

  /**
   * 🔧 Démarre la surveillance de la mémoire
   */
  startMonitoring(): void {
    if (this.isMonitoring || !this.isMemoryAPIAvailable()) {
      return;
    }

    this.isMonitoring = true;
    
    this.ngZone.runOutsideAngular(() => {
      interval(5000) // Vérification toutes les 5 secondes
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.checkMemoryUsage();
        });
    });
  }

  /**
   * 🔧 Arrête la surveillance
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.destroy$.next();
  }

  /**
   * 🔧 Vérifie l'utilisation de la mémoire
   */
  private checkMemoryUsage(): void {
    if (!this.isMemoryAPIAvailable()) return;

    const memory = (performance as any).memory;
    const stats: MemoryStats = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now()
    };

    this.memoryHistory.push(stats);
    
    // Garder seulement les dernières mesures
    if (this.memoryHistory.length > this.MAX_HISTORY) {
      this.memoryHistory.shift();
    }

    // Détecter les fuites potentielles
    this.detectMemoryLeaks(stats);
  }

  /**
   * 🔧 Détecte les fuites mémoire potentielles
   */
  private detectMemoryLeaks(currentStats: MemoryStats): void {
    if (this.memoryHistory.length < 10) return;

    const recentHistory = this.memoryHistory.slice(-10);
    const memoryGrowth = this.calculateMemoryGrowth(recentHistory);
    
    // Alerte si croissance constante > seuil
    if (memoryGrowth > this.MEMORY_THRESHOLD) {
      this.ngZone.run(() => {
        console.warn('🚨 Fuite mémoire potentielle détectée!', {
          currentUsage: this.formatBytes(currentStats.usedJSHeapSize),
          growth: this.formatBytes(memoryGrowth),
          timestamp: new Date().toISOString()
        });
        
        // Déclencher un garbage collection si possible
        this.triggerGarbageCollection();
      });
    }
  }

  /**
   * 🔧 Calcule la croissance mémoire
   */
  private calculateMemoryGrowth(history: MemoryStats[]): number {
    if (history.length < 2) return 0;
    
    const first = history[0];
    const last = history[history.length - 1];
    
    return last.usedJSHeapSize - first.usedJSHeapSize;
  }

  /**
   * 🔧 Déclenche le garbage collection si possible
   */
  private triggerGarbageCollection(): void {
    try {
      // Forcer le garbage collection (Chrome DevTools)
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      // Nettoyer les références circulaires potentielles
      this.cleanupPotentialLeaks();
      
    } catch (error) {
      console.warn('Impossible de déclencher le GC:', error);
    }
  }

  /**
   * 🔧 Nettoie les fuites potentielles
   */
  private cleanupPotentialLeaks(): void {
    // Nettoyer les event listeners orphelins
    this.cleanupEventListeners();
    
    // Nettoyer les timers oubliés
    this.cleanupTimers();
    
    // Nettoyer les observables non fermés
    this.cleanupObservables();
  }

  /**
   * 🔧 Nettoie les event listeners
   */
  private cleanupEventListeners(): void {
    // Supprimer les listeners sur window qui pourraient être oubliés
    const events = ['resize', 'scroll', 'click', 'touchstart', 'touchend'];
    events.forEach(event => {
      // Note: Ceci est un exemple, dans un vrai cas il faudrait tracker les listeners
      try {
        window.removeEventListener(event, () => {});
      } catch (e) {
        // Ignore
      }
    });
  }

  /**
   * 🔧 Nettoie les timers
   */
  private cleanupTimers(): void {
    // Nettoyer les intervalles et timeouts potentiellement oubliés
    // Note: Ceci est un exemple basique
    for (let i = 1; i < 10000; i++) {
      try {
        clearTimeout(i);
        clearInterval(i);
      } catch (e) {
        // Ignore
      }
    }
  }

  /**
   * 🔧 Nettoie les observables
   */
  private cleanupObservables(): void {
    // Émettre un signal de destruction global
    this.destroy$.next();
  }

  /**
   * 🔧 Vérifie si l'API Memory est disponible
   */
  private isMemoryAPIAvailable(): boolean {
    return !!(performance as any).memory;
  }

  /**
   * 🔧 Formate les bytes en format lisible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 🔧 Obtient les statistiques mémoire actuelles
   */
  getCurrentMemoryStats(): MemoryStats | null {
    if (!this.isMemoryAPIAvailable()) return null;
    
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now()
    };
  }

  /**
   * 🔧 Obtient l'historique mémoire
   */
  getMemoryHistory(): MemoryStats[] {
    return [...this.memoryHistory];
  }

  /**
   * 🔧 Nettoie le service
   */
  ngOnDestroy(): void {
    this.stopMonitoring();
    this.destroy$.complete();
  }
}