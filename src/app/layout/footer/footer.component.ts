import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro') {
        const footerElement = document.getElementById('footer');
        if (footerElement) {
          footerElement.style.display = 'none';
        }
      } else {
        const footerElement = document.getElementById('footer');
        if (footerElement) {
          footerElement.style.display = 'flex';
        }
      }
    });
  }
}
