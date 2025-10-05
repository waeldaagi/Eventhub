import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCostumDir]'
})
export class CostumDirDirective {

  constructor(private element: ElementRef,private renderer: Renderer2) {
    
    
   }

}
