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
      // Quitar query params de la URL para comparar solo la ruta
      const cleanUrl = this.router.url.split('?')[0];
      if (cleanUrl === '/auth/inicio-de-sesion' || cleanUrl === '/auth/registro' || cleanUrl === '/') {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingLeft = '0';
          generalPadding.style.paddingRight = '0';
          generalPadding.style.paddingBottom = '0';
          generalPadding.style.paddingTop = '0';
        }
      } else if (cleanUrl === '/user/cuestionario') {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingTop = 'calc(var(--header-size) + 30px)';
          generalPadding.style.paddingBottom = '0px';
          generalPadding.style.paddingLeft = '90px';
          generalPadding.style.paddingRight = '90px';
        }
      } else {
        const generalPadding = document.getElementById('content');
        if (generalPadding) {
          generalPadding.style.paddingTop = 'calc(var(--header-size) + 30px)';
          generalPadding.style.paddingBottom = '20px';
          generalPadding.style.paddingLeft = '90px';
          generalPadding.style.paddingRight = '90px';
        }
      }
    });
  }
}
