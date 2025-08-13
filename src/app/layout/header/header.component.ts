import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro') {
        const footerElement = document.getElementById('header');
        if (footerElement) {
          footerElement.style.display = 'none';
        }
      } else {
        const footerElement = document.getElementById('header');
        if (footerElement) {
          footerElement.style.display = 'flex';
        }
      }
    });
  }
  ngOnInit(): void {
    // Initialization logic can go here if needed
    console.log('HeaderComponent initialized');
  }
}

