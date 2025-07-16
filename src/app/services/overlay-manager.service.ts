import { Injectable, NgZone } from '@angular/core';
import { ModalController, PopoverController, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OverlayManagerService {
  private activeOverlays = new Set<any>();
  private isCleaningUp = false;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private ngZone: NgZone
  ) {}

  /**
   * 🔧 Enregistre un overlay actif
   */
  registerOverlay(overlay: any) {
    this.activeOverlays.add(overlay);
  }

  /**
   * 🔧 Désenregistre un overlay
   */
  unregisterOverlay(overlay: any) {
    this.activeOverlays.delete(overlay);
  }

  /**
   * 🔧 Ferme tous les overlays de manière sécurisée
   */
  async dismissAllOverlays(): Promise<void> {
    if (this.isCleaningUp) return;
    
    this.isCleaningUp = true;
    
    try {
      // Fermer les overlays Ionic
      await Promise.all([
        this.dismissAllModals(),
        this.dismissAllPopovers(),
        this.dismissAllLoadings(),
        this.dismissAllAlerts(),
        this.dismissAllToasts()
      ]);

      // Nettoyer les overlays DOM résiduels
      await this.cleanupDOMOverlays();
      
      // Vider le set des overlays actifs
      this.activeOverlays.clear();
      
    } catch (error) {
      console.warn('Erreur lors du nettoyage des overlays:', error);
    } finally {
      this.isCleaningUp = false;
    }
  }

  /**
   * 🔧 Ferme toutes les modales
   */
  private async dismissAllModals(): Promise<void> {
    try {
      let modal = await this.modalController.getTop();
      while (modal) {
        await modal.dismiss();
        modal = await this.modalController.getTop();
      }
    } catch (error) {
      console.warn('Erreur fermeture modales:', error);
    }
  }

  /**
   * 🔧 Ferme tous les popovers
   */
  private async dismissAllPopovers(): Promise<void> {
    try {
      let popover = await this.popoverController.getTop();
      while (popover) {
        await popover.dismiss();
        popover = await this.popoverController.getTop();
      }
    } catch (error) {
      console.warn('Erreur fermeture popovers:', error);
    }
  }

  /**
   * 🔧 Ferme tous les loadings
   */
  private async dismissAllLoadings(): Promise<void> {
    try {
      let loading = await this.loadingController.getTop();
      while (loading) {
        await loading.dismiss();
        loading = await this.loadingController.getTop();
      }
    } catch (error) {
      console.warn('Erreur fermeture loadings:', error);
    }
  }

  /**
   * 🔧 Ferme toutes les alertes
   */
  private async dismissAllAlerts(): Promise<void> {
    try {
      let alert = await this.alertController.getTop();
      while (alert) {
        await alert.dismiss();
        alert = await this.alertController.getTop();
      }
    } catch (error) {
      console.warn('Erreur fermeture alertes:', error);
    }
  }

  /**
   * 🔧 Ferme tous les toasts
   */
  private async dismissAllToasts(): Promise<void> {
    try {
      let toast = await this.toastController.getTop();
      while (toast) {
        await toast.dismiss();
        toast = await this.toastController.getTop();
      }
    } catch (error) {
      console.warn('Erreur fermeture toasts:', error);
    }
  }

  /**
   * 🔧 Nettoie les overlays DOM résiduels
   */
  private async cleanupDOMOverlays(): Promise<void> {
    return new Promise((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          try {
            // Sélecteurs pour tous les types d'overlays
            const overlaySelectors = [
              'ion-modal',
              'ion-popover', 
              'ion-loading',
              'ion-alert',
              'ion-toast',
              'ion-backdrop',
              '.modal-backdrop',
              '.popover-backdrop',
              '.loading-backdrop',
              '.alert-backdrop',
              '.toast-backdrop',
              'ion-menu-backdrop'
            ];

            overlaySelectors.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                try {
                  // Vérifier si l'élément est encore attaché au DOM
                  if (element.parentNode) {
                    element.remove();
                  }
                } catch (e) {
                  // Ignorer les erreurs de suppression
                }
              });
            });

            // Nettoyer les classes du body
            document.body.classList.remove(
              'modal-open',
              'popover-open', 
              'loading-open',
              'alert-open',
              'toast-open'
            );
            
            // Restaurer le scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
          } catch (error) {
            console.warn('Erreur nettoyage DOM:', error);
          }
          
          resolve();
        }, 50);
      });
    });
  }

  /**
   * 🔧 Vérifie s'il y a des overlays actifs
   */
  hasActiveOverlays(): boolean {
    return this.activeOverlays.size > 0;
  }

  /**
   * 🔧 Obtient le nombre d'overlays actifs
   */
  getActiveOverlaysCount(): number {
    return this.activeOverlays.size;
  }
}