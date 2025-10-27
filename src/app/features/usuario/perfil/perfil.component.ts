import { Component } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        console.log('Usuario actual:', usuario);
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    });
  }
}
