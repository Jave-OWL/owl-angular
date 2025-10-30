import { Component, OnInit } from '@angular/core';
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
export class PerfilComponent implements OnInit {
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

  constructor(
    private usuarioService: UsuarioService,
    private ficService: FICService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarFicsRecomendados();
  }

  cargarUsuario(): void {
    this.isLoading = true;
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log('Fecha del backend:', usuario.fecha_nacimiento);
        console.log('Tipo de fecha:', typeof usuario.fecha_nacimiento);
        this.usuarioEditado = {
          nombre: usuario.nombre,
          correo: usuario.correo,
          fecha_nacimiento: usuario.fecha_nacimiento
        };
        console.log('Fecha en usuarioEditado:', this.usuarioEditado.fecha_nacimiento);
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
      // Normalizar el gestor primero antes de cargar el logo
      fondo.gestor = this.normalizarGestor(fondo.gestor);
      // Usar el nombre del gestor tal cual para el logo
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.webp';
      
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.webp';
      };
      
      img.src = fondo.logo;
    });
  }

  private normalizarGestor(gestor: string): string {
    if (!gestor) return gestor;
    // Quitar tildes y pasar a minúsculas para comparar
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
      let eaMenor = 99999;
      fondo.rentabilidad_historicas.forEach(item => {
        if (item.ultimo_mes < eaMenor) {
          eaMenor = item.ultimo_mes;
          fondo.ea = parseFloat((item.ultimo_mes*100).toFixed(2));
        }
      });
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

    console.log('Datos a actualizar:', datosActualizados);

    this.usuarioService.actualizarUsuario(datosActualizados).subscribe({
      next: (response: any) => {
        if (response.requiresReAuth) {
          // El correo cambió, redirigir al login
          alert(response.message || 'Has cambiado tu correo electrónico. Por favor, inicia sesión nuevamente con tu nuevo correo.');
          this.authService.logout();
          localStorage.removeItem('nombreUsuario');
          localStorage.removeItem('perfilRiesgo');
          this.router.navigate(['/auth/inicio-de-sesion']);
        } else {
          // Actualización normal sin cambio de correo
          this.usuario = { ...this.usuario!, ...datosActualizados };
          localStorage.setItem('nombreUsuario', datosActualizados.nombre);
          this.isEditing = false;
          alert('Perfil actualizado correctamente');
        }
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }

  verDetalleFondo(id: number): void {
    this.router.navigate(['/fics/detalle'], { queryParams: { id } });
  }

  volverAlTest(): void {
    this.router.navigate(['/user/cuestionario']);
  }

  getTipoId(tipo: string): string {
    if (!tipo) return '';
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }
}
