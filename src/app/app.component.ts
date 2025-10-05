import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventhub';
  isDarkMode: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onThemeChanged(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
    
    // Appliquer la classe au body (seulement côté client)
    if (isPlatformBrowser(this.platformId)) {
      if (isDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }
}
