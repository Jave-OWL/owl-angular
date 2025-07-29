import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion-tipo-inversion',
  imports: [],
  templateUrl: './seleccion-tipo-inversion.component.html',
  styleUrl: './seleccion-tipo-inversion.component.css'
})
export class SeleccionTipoInversionComponent {
  
  constructor(private router: Router) {}

  explorarFondos() {
    this.router.navigate(['/explorar-fondos']);
  }
}
