import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, delayWhen, take, concat } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // 🔧 Retry automatique pour les erreurs réseau
      retryWhen(errors => 
        errors.pipe(
          delayWhen((error: HttpErrorResponse, index: number) => {
            // Retry seulement pour les erreurs réseau (5xx, timeout, etc.)
            if (this.shouldRetry(error) && index < this.MAX_RETRIES) {
              console.warn(`Tentative ${index + 1}/${this.MAX_RETRIES} pour ${req.url}`, error);
              return timer(this.RETRY_DELAY * (index + 1));
            }
            return throwError(error);
          }),
          take(this.MAX_RETRIES),
          concat(throwError('Max retries exceeded'))
        )
      ),
      
      // 🔧 Gestion globale des erreurs
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, req);
        return throwError(error);
      })
    );
  }

  /**
   * 🔧 Détermine si une erreur doit être retentée
   */
  private shouldRetry(error: HttpErrorResponse): boolean {
    // Retry pour les erreurs serveur (5xx) et les timeouts
    return error.status >= 500 || 
           error.status === 0 || 
           error.message.includes('timeout');
  }

  /**
   * 🔧 Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse, req: HttpRequest<any>): void {
    const errorInfo = {
      url: req.url,
      method: req.method,
      status: error.status,
      message: error.message,
      timestamp: new Date().toISOString()
    };

    // Log différent selon le type d'erreur
    if (error.status === 0) {
      console.error('🌐 Erreur réseau ou CORS:', errorInfo);
    } else if (error.status >= 500) {
      console.error('🔥 Erreur serveur:', errorInfo);
    } else if (error.status === 401) {
      console.warn('🔐 Non autorisé:', errorInfo);
      this.handleUnauthorized();
    } else if (error.status === 403) {
      console.warn('🚫 Accès interdit:', errorInfo);
    } else if (error.status === 404) {
      console.warn('❓ Ressource non trouvée:', errorInfo);
    } else {
      console.error('❌ Erreur HTTP:', errorInfo);
    }
  }

  /**
   * 🔧 Gère les erreurs d'authentification
   */
  private handleUnauthorized(): void {
    // Nettoyer le localStorage et rediriger vers login
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    
    // Redirection vers login (éviter les boucles infinies)
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
}