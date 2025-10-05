import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PillNavItem } from '../../components/pill-nav/pill-nav.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  navItems: PillNavItem[] = [
    { label: 'Accueil', href: '/' },
    { label: 'Événements', href: '/events' },
    { label: 'Mes Tickets', href: '#' },
    { label: 'Feedback', href: '#' },
    { label: 'Se connecter', href: '#' }
  ];

  activeHref: string = '/';
  isDarkMode: boolean = false;

  @Output() themeChanged = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Écouter les changements de route pour mettre à jour l'élément actif
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeHref = event.url;
      });

    // Charger le thème sauvegardé (seulement côté client)
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
        this.themeChanged.emit(this.isDarkMode);
        
        // Émettre l'événement personnalisé pour les autres composants
        window.dispatchEvent(new CustomEvent('themeChanged', { 
          detail: { isDarkMode: this.isDarkMode } 
        }));
      }
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    
    // Sauvegarder le thème (seulement côté client)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { isDarkMode: this.isDarkMode } 
      }));
    }
    
    // Émettre le changement de thème
    this.themeChanged.emit(this.isDarkMode);
  }
}
