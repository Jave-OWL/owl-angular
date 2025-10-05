import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  consejos: string[] = [
    'Ahorra primero, gasta después: págate a ti mismo antes que a nadie.',
    'Invierte en tu educación: el conocimiento financiero es el mejor interés compuesto.',
    'Pequeños ahorros suman grandes resultados: nunca subestimes el poder de la constancia.',
    'El tiempo es tu mejor aliado: comienza hoy, aunque sea con poco.',
    'La disciplina vence al talento financiero: la consistencia supera a la suerte.',
    'Invierte en activos, no en lujos: que tu dinero trabaje por ti.',
    'Crea múltiples fuentes de ingreso: no dependas de un solo flujo.',
    'Un presupuesto es libertad, no restricción: te da control y claridad.',
    'No compres para impresionar: compra para progresar.',
    'La paz financiera vale más que cualquier objeto de moda.',
    'Deuda buena financia tu crecimiento, deuda mala consume tu futuro.',
    'Revisa tus finanzas semanalmente: pequeños ajustes evitan grandes problemas.',
    'Aprende de quienes ya lograron lo que deseas.',
    'Construye activos antes de buscar pasivos: primero cimientos, luego adornos.',
    'Recuerda: el dinero es un medio, no un fin. La verdadera riqueza es libertad y tiempo.',
    'La educación financiera es la clave para el éxito financiero.',
    'La disciplina es la clave para el éxito financiero.',
    'La educación financiera es la clave para el éxito financiero.',
  ];

  FondosUsuario: FIC[] = [
  ];

  consejo: string = '';

  ngOnInit() {
    const consejoIndex = Math.floor(Math.random() * this.consejos.length);
    this.consejo = this.consejos[consejoIndex];
    this.cargarLogos();
  }

    cargarLogos() {
    // Iterate over each 'fondo' in the 'fondos' array
    this.FondosUsuario.forEach(fondo => {
      // Create a new Image object to check for logo existence
      const img = new Image();

      // Set the initial logo path based on the 'gestor' property of 'fondo'
      fondo.logo = 'assets/images/' + fondo.gestor + 'LogoDashboard.png';

      // Add an error event handler to set a default logo if the specific logo is not found
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.png'; // Default logo path
      };

      // Start loading the image to trigger onerror if it fails
      img.src = fondo.logo;
    });
  }
}
