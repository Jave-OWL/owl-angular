import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro') {
        const HeaderElement = document.getElementById('header');
        if (HeaderElement) {
          HeaderElement.style.display = 'none';
        }
      } else {
        const HeaderElement = document.getElementById('header');
        if (HeaderElement) {
          HeaderElement.style.display = 'flex';
        }
      }
    });
  }
  ngOnInit(): void {
    // Initialization logic can go here if needed
    console.log('HeaderComponent initialized');
  }
  ngAfterViewInit(): void {
    console.log('HeaderComponent view initialized');
  }

  dropdown(){
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  }

  getRol(){
    localStorage.getItem('rol');
    return localStorage.getItem('rol');
  }

  usuarioAuth():boolean { //Implementacion temporal mientras se implementa JWT o algun otro metodo de tokens de autenticacion (falta servicio y tokens)
    if(localStorage.getItem('rol') == 'usuario' || localStorage.getItem('rol') == 'administrador' ){
      return true;
    }
    return false;
  }

  cerrarSesion() {
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    this.router.navigate(['/auth/inicio-de-sesion']);
  }
}

