import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { FICService } from '../../../core/services/fic.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  isEditing = false;
  isLoading = true;
  error: string | null = null;
  
  // Datos editables
  usuarioEditado = {
    nombre: '',
    correo: '',
    fecha_nacimiento: ''
  };

  // FICs recomendados
  ficosRecomendados: FIC[] = [];
  perfilRiesgo: string = '';
  isLoadingFics = true;

  mostrarExito = false;
  mostrarError = false;
  mensajeModal = '';

  consejo: string = '';
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

  constructor(
    private usuarioService: UsuarioService,
    private ficService: FICService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarFicsRecomendados();
    const consejoIndex = Math.floor(Math.random() * this.consejos.length);
    this.consejo = this.consejos[consejoIndex];
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  cargarUsuario(): void {
    this.isLoading = true;
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.usuarioEditado = {
          nombre: usuario.nombre,
          correo: usuario.correo,
          fecha_nacimiento: usuario.fecha_nacimiento
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual:', error);
        this.error = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    });
  }

  cargarFicsRecomendados(): void {
    this.isLoadingFics = true;
    this.ficService.findByRecomendacion().subscribe({
      next: (fics) => {
        this.ficosRecomendados = fics;
        this.cargarLogos();
        this.cargarNombres();
        this.cargarEA();
        this.isLoadingFics = false;
      },
      error: (error) => {
        console.error('Error al cargar los FICs:', error);
        this.isLoadingFics = false;
      }
    });
  }

  cargarLogos(): void {
    this.ficosRecomendados.forEach(fondo => {
      const img = new Image();
      fondo.gestor = this.normalizarGestor(fondo.gestor);
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.webp';
      
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.webp';
      };
      
      img.src = fondo.logo;
    });
  }

  private normalizarGestor(gestor: string): string {
    if (!gestor) return gestor;
    const nombre = gestor
      .toLowerCase()
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u');
    if (
      nombre.includes('progresion') &&
      (nombre.includes('comisionista') || nombre.includes('sociedad') || nombre.includes('s.a'))
    ) {
      return 'Progresión S.A.';
    }
    if (nombre.includes('davivienda')) {
      return 'Davivienda';
    }
    if (nombre.includes('sura')) {
      return 'Sura';
    }
    return gestor;
  }

  cargarNombres(): void {
    this.ficosRecomendados.forEach(fondo => {
      fondo.nombre_fic = fondo.nombre_fic.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      fondo.nombre_fic = fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');
    });
  }

  cargarEA(): void {
    this.ficosRecomendados.forEach(fondo => {
      const valores = fondo.rentabilidad_historicas.map(item => item.ultimo_mes);
      const valoresNoCero = valores.filter(v => v !== 0).sort((a, b) => a - b);
      if (valoresNoCero.length > 0) {
        fondo.ea = parseFloat((valoresNoCero[0] * 100).toFixed(2));
      } else {
        fondo.ea = 0;
      }
    });
  }

  getIniciales(): string {
    if (!this.usuario?.nombre) return 'U';
    const palabras = this.usuario.nombre.trim().split(' ');
    if (palabras.length === 1) {
      return palabras[0].charAt(0).toUpperCase();
    }
    return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
  }

  toggleEditar(): void {
    if (this.isEditing) {
      this.usuarioEditado = {
        nombre: this.usuario!.nombre,
        correo: this.usuario!.correo,
        fecha_nacimiento: this.usuario!.fecha_nacimiento
      };
    }
    this.isEditing = !this.isEditing;
  }

  guardarCambios(): void {
    if (!this.usuario) return;

    const datosActualizados = {
      nombre: this.usuarioEditado.nombre,
      correo: this.usuarioEditado.correo,
      fecha_nacimiento: String(this.usuarioEditado.fecha_nacimiento)
    };

    this.usuarioService.actualizarUsuario(datosActualizados).subscribe({
      next: (response: any) => {
        if (response.requiresReAuth) {
          this.mensajeModal = response.message || 'Has cambiado tu correo electrónico exitosamente. Por favor, inicia sesión nuevamente con tu nuevo correo.';
          this.mostrarExito = true;
          document.body.style.overflow = 'hidden';
          
          setTimeout(() => {
            document.body.style.overflow = 'auto'; 
            this.authService.logout();
            localStorage.removeItem('nombreUsuario');
            localStorage.removeItem('perfilRiesgo');
            this.router.navigate(['/auth/inicio-de-sesion']);
          }, 3000);
        } else {
          this.usuario = { ...this.usuario!, ...datosActualizados };
          localStorage.setItem('nombreUsuario', datosActualizados.nombre);
          this.isEditing = false;
          this.mensajeModal = 'Tu perfil ha sido actualizado correctamente.';
          this.mostrarExito = true;
          document.body.style.overflow = 'hidden';
        }
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.usuarioEditado = {
          nombre: this.usuario!.nombre,
          correo: this.usuario!.correo,
          fecha_nacimiento: this.usuario!.fecha_nacimiento
        };
        this.mensajeModal = error.error?.message || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.';
        this.mostrarError = true;
        document.body.style.overflow = 'hidden';
      }
    });
  }

  cerrarModal(): void {
    this.mostrarExito = false;
    this.mostrarError = false;
    this.mensajeModal = '';
    document.body.style.overflow = 'auto';
  }

  verDetalleFondo(id: number): void {
    this.router.navigate(['/fics/detalle'], { queryParams: { id } });
  }

  volverAlTest(): void {
    this.router.navigate(['/user/cuestionario']);
  }

  VerMas(): void {
    this.router.navigate(['/fics/explorar']);
  }

  AprenderMas(): void {
    this.router.navigate(['/aprende']);
  }

  getTipoId(tipo: string): string {
    if (!tipo) return '';
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }
}
