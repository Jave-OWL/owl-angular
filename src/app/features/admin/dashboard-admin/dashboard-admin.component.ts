import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { FICService } from '../../../core/services/fic.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  isLoading = true;
  error = '';
  totalUsuarios = 0;
  totalFICs = 0;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private ficService: FICService
  ) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    this.isLoading = true;
    this.error = '';

    // Cargar usuarios y FICs en paralelo
    Promise.all([
      this.cargarUsuarios(),
      this.cargarFICs()
    ])
    .then(() => {
      this.isLoading = false;
    })
    .catch((err) => {
      console.error('Error cargando métricas:', err);
      this.error = 'Error al cargar las métricas del dashboard';
      this.isLoading = false;
    });
  }

  private cargarUsuarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.findAll().subscribe({
        next: (usuarios: any[]) => {
          this.totalUsuarios = usuarios.length;
          resolve();
        },
        error: (err: any) => {
          console.error('Error cargando usuarios:', err);
          reject(err);
        }
      });
    });
  }

  private cargarFICs(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ficService.findAll().subscribe({
        next: (fics: any[]) => {
          this.totalFICs = fics.length;
          resolve();
        },
        error: (err: any) => {
          console.error('Error cargando FICs:', err);
          reject(err);
        }
      });
    });
  }

  navegarAUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  navegarAFICs(): void {
    this.router.navigate(['/admin/fics']);
  }
}
