import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
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
    this.router.navigate(['/admin/usuarios/crear']);
  }

  verUsuario(id: number): void {
    this.router.navigate(['/admin/usuarios', id]);
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  confirmarEliminar(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
    this.mostrarModalEliminar = true;
  }

  eliminarUsuario(): void {
    if (this.usuarioAEliminar) {
      // TODO: Implementar método delete en el servicio
      // Por ahora solo removemos del array localmente
      this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar!.id);
      this.usuariosFiltrados = this.usuariosFiltrados.filter(u => u.id !== this.usuarioAEliminar!.id);
      this.cerrarModal();
      
      /* Cuando el servicio tenga el método delete, descomentar esto:
      this.usuarioService.delete(this.usuarioAEliminar.id).subscribe({
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
      */
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
