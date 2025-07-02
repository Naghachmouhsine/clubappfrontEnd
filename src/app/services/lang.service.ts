import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type LangType = 'fr' | 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LangService {
  private langSubject = new BehaviorSubject<LangType>(this.getInitialLang());
  lang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.getLang());
    this.translate.use(this.getLang());
  }

  setLang(lang: LangType) {
    this.langSubject.next(lang);
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    window.location.reload();
  }

  getLang(): LangType {
    return (localStorage.getItem('lang') as LangType) || 'fr';
  }

  t(key: string): string {
    let value = '';
    this.translate.get(key).subscribe((res: string) => {
      value = res;
    });
    return value || key;
  }

  private getInitialLang(): LangType {
    const saved = localStorage.getItem('lang') as LangType | null;
    if (saved) return saved;
    return 'fr';
  }
}
