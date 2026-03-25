import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'pw-theme-pref';
  private isLightModeSubject = new BehaviorSubject<boolean>(false);
  isLightMode$ = this.isLightModeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    // Default to dark mode if no saved preference
    const isLight = savedTheme === 'light';
    this.isLightModeSubject.next(isLight);
    this.updateBodyClass(isLight);
  }

  toggleTheme() {
    const currentMode = this.isLightModeSubject.value;
    const newMode = !currentMode;
    
    this.isLightModeSubject.next(newMode);
    localStorage.setItem(this.themeKey, newMode ? 'light' : 'dark');
    this.updateBodyClass(newMode);
  }

  private updateBodyClass(isLight: boolean) {
    if (isLight) {
      this.document.body.classList.add('light-theme');
    } else {
      this.document.body.classList.remove('light-theme');
    }
  }
}
