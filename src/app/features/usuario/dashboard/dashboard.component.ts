import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Fondo } from '../../FICs/models/fondo.interface';
import { CommonModule } from '@angular/common';

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
    'Recuerda: el dinero es un medio, no un fin. La verdadera riqueza es libertad y tiempo.'
  ];

  FondosUsuario: Fondo[] = [
    {
      logo: '',
      riesgo: 'Riesgo Variable',
      nombre: 'Fondo Variable',
      banco: 'Davivienda',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-05-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Bajo',
      nombre: 'Fondo Conservador',
      banco: 'BancoDeOccidente',
      rentabilidad: '3% E.A.',
      fechaCreacion: new Date('2024-06-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Medio',
      nombre: 'Fiducuenta',
      banco: 'BancoDeBogota',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-04-01')
    }
  ];

  consejo: string = '';

  ngOnInit() {
    const consejoIndex = Math.floor(Math.random() * this.consejos.length);
    this.consejo = this.consejos[consejoIndex];
  }
}
