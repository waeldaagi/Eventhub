import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

export interface PillNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

@Component({
  selector: 'app-pill-nav',
  templateUrl: './pill-nav.component.html',
  styleUrl: './pill-nav.component.css'
})
export class PillNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() logo: string = '';
  @Input() logoAlt: string = 'Logo';
  @Input() items: PillNavItem[] = [];
  @Input() activeHref?: string;
  @Input() className: string = '';
  @Input() ease: string = 'power3.easeOut';
  @Input() baseColor: string = '#fff';
  @Input() pillColor: string = '#060010';
  @Input() hoveredPillTextColor: string = '#060010';
  @Input() pillTextColor?: string;
  @Input() onMobileMenuClick?: () => void;
  @Input() initialLoadAnimation: boolean = true;

  @ViewChild('navItemsRef', { static: false }) navItemsRef?: ElementRef;
  @ViewChild('logoRef', { static: false }) logoRef?: ElementRef;
  @ViewChild('mobileMenuRef', { static: false }) mobileMenuRef?: ElementRef;
  @ViewChild('hamburgerRef', { static: false }) hamburgerRef?: ElementRef;

  isMobileMenuOpen: boolean = false;
  private circleRefs: Array<HTMLSpanElement | null> = [];
  private tlRefs: Array<gsap.core.Timeline | null> = [];
  private activeTweenRefs: Array<gsap.core.Tween | null> = [];
  private logoTweenRef: gsap.core.Tween | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.circleRefs = new Array(this.items.length).fill(null);
    this.tlRefs = new Array(this.items.length).fill(null);
    this.activeTweenRefs = new Array(this.items.length).fill(null);
  }

  ngAfterViewInit() {
    // Attendre que les éléments soient rendus et que GSAP soit disponible
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      
      this.setupCircleRefs();
      this.layout();
      this.setupInitialAnimation();
      
      // Vérifier les polices si disponibles
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          this.layout();
        }).catch(() => {});
      }
    }, 100); // Augmenter le délai pour s'assurer que tout est chargé
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
    this.cleanupAnimations();
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.layout();
    }
  }

  private layout() {
    if (typeof document === 'undefined') return;
    
    console.log('Layout called, circles:', this.circleRefs.length); // Debug
    
    this.circleRefs.forEach((circle, index) => {
      if (!circle?.parentElement) {
        console.log(`Circle ${index} has no parent`); // Debug
        return;
      }

      const pill = circle.parentElement as HTMLElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector<HTMLElement>('.pill-label');
      const white = pill.querySelector<HTMLElement>('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      this.tlRefs[index]?.kill();
      const tl = gsap.timeline({ paused: true });
      
      console.log(`Creating timeline for circle ${index}`); // Debug

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: this.ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 2, ease: this.ease, overwrite: 'auto' }, 0);
      }

      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 2, ease: this.ease, overwrite: 'auto' }, 0);
      }

      this.tlRefs[index] = tl;
    });
  }

  private setupInitialAnimation() {
    if (typeof document === 'undefined') return;
    
    if (this.initialLoadAnimation) {
      const logo = this.logoRef?.nativeElement;
      const navItems = this.navItemsRef?.nativeElement;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease: this.ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease: this.ease
        });
      }
    }

    const menu = this.mobileMenuRef?.nativeElement;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }
  }

  handleEnter(i: number) {
    if (typeof document === 'undefined') return;
    
    const tl = this.tlRefs[i];
    if (!tl) return;
    this.activeTweenRefs[i]?.kill();
    this.activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  handleLeave(i: number) {
    if (typeof document === 'undefined') return;
    
    const tl = this.tlRefs[i];
    if (!tl) return;
    this.activeTweenRefs[i]?.kill();
    this.activeTweenRefs[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  handleLogoEnter() {
    if (typeof document === 'undefined') return;
    
    const img = this.logoRef?.nativeElement?.querySelector('img');
    if (!img) return;
    this.logoTweenRef?.kill();
    gsap.set(img, { rotate: 0 });
    this.logoTweenRef = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  toggleMobileMenu() {
    if (typeof document === 'undefined') return;
    
    const newState = !this.isMobileMenuOpen;
    this.isMobileMenuOpen = newState;

    const hamburger = this.hamburgerRef?.nativeElement;
    const menu = this.mobileMenuRef?.nativeElement;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: this.ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: this.ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: this.ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease: this.ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    this.onMobileMenuClick?.();
  }

  isExternalLink(href: string): boolean {
    return href.startsWith('http://') ||
           href.startsWith('https://') ||
           href.startsWith('//') ||
           href.startsWith('mailto:') ||
           href.startsWith('tel:') ||
           href.startsWith('#');
  }

  isRouterLink(href?: string): boolean {
    return href ? !this.isExternalLink(href) : false;
  }

  getCssVars() {
    const resolvedPillTextColor = this.pillTextColor ?? this.baseColor;
    return {
      '--base': this.baseColor,
      '--pill-bg': this.pillColor,
      '--hover-text': this.hoveredPillTextColor,
      '--pill-text': resolvedPillTextColor
    };
  }

  private setupCircleRefs() {
    if (typeof document === 'undefined') return;
    
    // Attendre un peu plus pour s'assurer que le DOM est complètement rendu
    setTimeout(() => {
      const circles = document.querySelectorAll('.hover-circle[data-index]');
      console.log('Found circles:', circles.length); // Debug
      
      circles.forEach((circle, index) => {
        const dataIndex = circle.getAttribute('data-index');
        if (dataIndex) {
          const i = parseInt(dataIndex, 10);
          this.circleRefs[i] = circle as HTMLSpanElement;
          console.log(`Circle ${i} setup`); // Debug
        }
      });
      
      // Relancer le layout après avoir configuré les références
      this.layout();
    }, 50);
  }

  private cleanupAnimations() {
    this.tlRefs.forEach(tl => tl?.kill());
    this.activeTweenRefs.forEach(tween => tween?.kill());
    this.logoTweenRef?.kill();
  }
}
