import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FIC } from '../../../core/models/FIC.model';
import { FICService } from '../../../core/services/fic.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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

  FondosUsuario: FIC[] = [];
  consejo: string = '';
  isLoading = true;
  error: string | null = null;

  constructor(private ficService: FICService) {}

  ngOnInit() {
    // Seleccionar un consejo aleatorio
    const consejoIndex = Math.floor(Math.random() * this.consejos.length);
    this.consejo = this.consejos[consejoIndex];
    
    // Cargar los FICs
    this.cargarFICs();
  }

  cargarFICs() {
    this.isLoading = true;
    this.ficService.findAll().subscribe({
      next: (fics) => {
        // Obtener 3 FICs aleatorios
        const fondosAleatorios = this.obtenerFICsAleatorios(fics, 3);
        this.FondosUsuario = fondosAleatorios;
        this.cargarLogos();
        this.cargarNombres();
        this.cargarEA();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los FICs:', error);
        this.error = 'Error al cargar los fondos de inversión';
        this.isLoading = false;
      }
    });
  }

  cargarNombres() {
    this.FondosUsuario.forEach(fondo => {
      fondo.nombre_fic = fondo.nombre_fic.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      fondo.nombre_fic = fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');       
    });
  }

  cargarEA() {
    this.FondosUsuario.forEach(fondo => {
      let eaMenor = 99999;
      fondo.rentabilidad_historicas.forEach(item => {
        if (item.ultimo_mes < eaMenor) {
          eaMenor = item.ultimo_mes;
          fondo.ea = parseFloat((item.ultimo_mes*100).toFixed(2));
        }
      });
    });
  }

  obtenerFICsAleatorios(fics: FIC[], cantidad: number): FIC[] {
    const ficsCopy = [...fics];
    const resultado: FIC[] = [];
    
    while (resultado.length < cantidad && ficsCopy.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * ficsCopy.length);
      resultado.push(ficsCopy.splice(indiceAleatorio, 1)[0]);
    }
    
    return resultado;
  }

  cargarLogos() {
    this.FondosUsuario.forEach(fondo => {
      const img = new Image();
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.png';
      
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.png'; // Logo por defecto
      };
      
      img.src = fondo.logo;
    });
  }
}
