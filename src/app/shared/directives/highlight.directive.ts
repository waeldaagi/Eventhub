import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'highlight');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, 'highlight');
  }

}
