import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'projectConstruction';

  ngOnInit() {
    // Set initial state
    this.checkScroll();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const header = document.querySelector('.header-area') as HTMLElement;
    if (!header) return;

    if (window.pageYOffset > 0) {
      header.classList.add('sticky');
      document.body.style.paddingTop = header.offsetHeight + 'px';
    } else {
      header.classList.remove('sticky');
      document.body.style.paddingTop = header.offsetHeight + 'px';
    }
  }
}
