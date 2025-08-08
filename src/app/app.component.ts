import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'owl-angular';
    constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro') {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.padding = '0';
        }
      } else {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingTop = 'calc(var(--header-size) + 10px)';
          generalPadding.style.paddingBottom = 'calc(var(--footer-size) + 10px)';
          generalPadding.style.paddingLeft = '50px';
          generalPadding.style.paddingRight = '50px';
        }
      }
    });
  }
}
