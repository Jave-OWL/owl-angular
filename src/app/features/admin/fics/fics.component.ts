import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FICService } from '../../../core/services/fic.service';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-fics',
  imports: [CommonModule],
  templateUrl: './fics.component.html',
  styleUrl: './fics.component.css'
})
export class FicsComponent implements OnInit {
  fics: FIC[] = [];
  ficsFiltrados: FIC[] = [];
  isLoading = false;
  error: string | null = null;

  // Modal de eliminación
  mostrarModalEliminar = false;
  ficAEliminar: FIC | null = null;

  constructor(
    private ficService: FICService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFICs();
  }

  cargarFICs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.ficService.findAll().subscribe({
      next: (data) => {
        this.fics = data;
        this.ficsFiltrados = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los FICs';
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  buscarFICs(event: Event): void {
    const termino = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!termino) {
      this.ficsFiltrados = this.fics;
      return;
    }

    this.ficsFiltrados = this.fics.filter(fic =>
      fic.nombre_fic.toLowerCase().includes(termino) ||
      fic.gestor.toLowerCase().includes(termino) ||
      fic.tipo.toLowerCase().includes(termino)
    );
  }

  crearFIC(): void {
    this.router.navigate(['/admin/fics/crear']);
  }

  verFIC(id: number): void {
    this.router.navigate(['/admin/fics', id]);
  }

  editarFIC(id: number): void {
    this.router.navigate(['/admin/fics/editar', id]);
  }

  confirmarEliminar(fic: FIC): void {
    this.ficAEliminar = fic;
    this.mostrarModalEliminar = true;
  }

  eliminarFIC(): void {
    if (!this.ficAEliminar) return;

    // TODO: Implementar llamada al servicio cuando esté disponible
    // this.ficService.delete(this.ficAEliminar.id).subscribe({
    //   next: () => {
    //     this.cargarFICs();
    //     this.cerrarModal();
    //   },
    //   error: (err) => {
    //     console.error('Error al eliminar FIC:', err);
    //     this.cerrarModal();
    //   }
    // });

    // Eliminar del array local por ahora
    this.fics = this.fics.filter(f => f.id !== this.ficAEliminar!.id);
    this.ficsFiltrados = this.ficsFiltrados.filter(f => f.id !== this.ficAEliminar!.id);
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.mostrarModalEliminar = false;
    this.ficAEliminar = null;
  }

  volverDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
