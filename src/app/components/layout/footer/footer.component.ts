import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  isSmallScreen: boolean = false;
  isMediumScreen: boolean = false;
  isLargeScreen: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const windowWidth = window.innerWidth;

    // Adjust the breakpoints as needed
    this.isSmallScreen = windowWidth < 576; // Small screen (less than 576px)
    this.isMediumScreen = windowWidth >= 576 && windowWidth < 768; // Medium screen (between 576px and 768px)
    this.isLargeScreen = windowWidth >= 768; // Large screen (greater than or equal to 768px)
  }
}
