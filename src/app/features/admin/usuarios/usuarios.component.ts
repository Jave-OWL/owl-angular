import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  isLoading: boolean = true;
  error: boolean = false;
  textoBusqueda: string = '';
  mostrarModalEliminar: boolean = false;
  usuarioAEliminar: Usuario | null = null;

  mostrarModalFormulario = false;
  modoEdicion = false;
  usuarioFormulario: Partial<Usuario> = {
    nombre: '',
    correo: '',
    contrasenia: '',
    is_admin: false,
    fecha_nacimiento: '',
    nivel_riesgo: ''
  };

  mostrarModalVer = false;
  usuarioVer: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.findAll().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...this.usuarios];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  buscarUsuarios(event: any): void {
    this.textoBusqueda = event.target.value.toLowerCase();
    
    if (this.textoBusqueda.trim()) {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.textoBusqueda) ||
        usuario.correo.toLowerCase().includes(this.textoBusqueda)
      );
    } else {
      this.usuariosFiltrados = [...this.usuarios];
    }
  }

  crearUsuario(): void {
    this.modoEdicion = false;
    this.usuarioFormulario = {
      nombre: '',
      correo: '',
      contrasenia: '',
      is_admin: false,
      fecha_nacimiento: '',
      nivel_riesgo: ''
    };
    this.mostrarModalFormulario = true;
  }

  verUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
      this.usuarioVer = usuario;
      this.mostrarModalVer = true;
    }
  }

  cerrarModalVer(): void {
    this.mostrarModalVer = false;
    this.usuarioVer = null;
  }

  editarUsuario(id: number): void {
    this.modoEdicion = true;
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
      this.usuarioFormulario = { ...usuario };
      this.mostrarModalFormulario = true;
    }
  }

  guardarUsuario(): void {
    if (this.modoEdicion) {
      if (this.usuarioFormulario.id) {
        this.usuarioService.actualizarUsuarioPorId(this.usuarioFormulario.id, this.usuarioFormulario).subscribe({
          next: (usuarioActualizado) => {
            const index = this.usuarios.findIndex(u => u.id === this.usuarioFormulario.id);
            if (index !== -1) {
              this.usuarios[index] = usuarioActualizado;
              this.usuariosFiltrados = [...this.usuarios];
            }
            this.cerrarModalFormulario();
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
            alert('Error al actualizar el usuario. Por favor, intenta nuevamente.');
          }
        });
      }
    } else {
      const nuevoUsuario: Partial<Usuario> = {
        ...this.usuarioFormulario
      };
      
      this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
        next: (usuarioCreado) => {
          this.usuarios.push(usuarioCreado);
          this.usuariosFiltrados = [...this.usuarios];
          this.cerrarModalFormulario();
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          alert('Error al crear el usuario. Por favor, intenta nuevamente.');
        }
      });
    }
  }

  cerrarModalFormulario(): void {
    this.mostrarModalFormulario = false;
    this.usuarioFormulario = {
      nombre: '',
      correo: '',
      contrasenia: '',
      is_admin: false,
      fecha_nacimiento: '',
      nivel_riesgo: ''
    };
  }

  confirmarEliminar(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
    this.mostrarModalEliminar = true;
  }

  eliminarUsuario(): void {
    if (this.usuarioAEliminar) {
      this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
      this.usuariosFiltrados = this.usuariosFiltrados.filter(u => u.id !== this.usuarioAEliminar!.id);      
      this.usuarioService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
          this.usuariosFiltrados = this.usuariosFiltrados.filter(u => u.id !== this.usuarioAEliminar!.id);
          this.cerrarModal();
        },
        error: (err: any) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar el usuario');
          this.cerrarModal();
        }
      });
    }
  }

  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.usuarioAEliminar = null;
  }

  volverDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
