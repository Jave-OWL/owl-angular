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
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro' || this.router.url === '/') {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingLeft = '0';
          generalPadding.style.paddingRight = '0'
          generalPadding.style.paddingBottom = '0';
          generalPadding.style.paddingTop = '0';
        }
      } else {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingTop = 'calc(var(--header-size) + 30px)';
          generalPadding.style.paddingBottom = 'calc(var(--footer-size) + 30px)';
          generalPadding.style.paddingLeft = '110px';
          generalPadding.style.paddingRight = '110px';
        }
      }
    });
  }
}
