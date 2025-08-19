import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.css'
})
export class PagenotfoundComponent {

  constructor() { }

  ultimaPagina() {
    if (window.history.length > 1) {
      // Navegar a la página anterior en el historial del navegador
      window.history.back();
    } else {
      // Si no tiene historial de navegacion, redirige al inicio
      window.location.href = '/';
    }
  }
}

