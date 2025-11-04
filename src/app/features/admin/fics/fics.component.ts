import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FICService } from '../../../core/services/fic.service';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-fics',
  imports: [CommonModule, FormsModule],
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

  // Modal de edición
  mostrarModalEditar = false;
  ficEditar: Partial<FIC> = {
    nombre_fic: '',
    gestor: '',
    tipo: ''
  };
  // Lista de gestores disponibles (para el dropdown)
  gestoresUnicos: string[] = [];

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
  this.cargarLogos();
  this.cargarEA();
  this.cargarGestoresUnicos();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los FICs';
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  cargarGestoresUnicos() {
    const gestoresSet = new Set(this.fics.map(f => f.gestor).filter(g => !!g));
    this.gestoresUnicos = Array.from(gestoresSet).sort();
  }

  cargarLogos() {
    this.fics.forEach(fondo => {
      const img = new Image();
      // Usar el nombre del gestor tal cual para el logo
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.webp';
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.webp';
      };
      img.src = fondo.logo;
    });
  }

  cargarEA() {
    this.fics.forEach(fondo => {
      // Obtener todas las rentabilidades del último mes
      const valores = fondo.rentabilidad_historicas.map(item => item.ultimo_mes);
      // Filtrar los valores distintos de 0 y ordenar ascendente
      const valoresNoCero = valores.filter(v => v !== 0).sort((a, b) => a - b);
      if (valoresNoCero.length > 0) {
        fondo.ea = parseFloat((valoresNoCero[0] * 100).toFixed(2));
      } else {
        // Si todos son 0, usar 0
        fondo.ea = 0;
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
    this.router.navigate(['/fics/detalle'], { queryParams: { id } });
  }

  editarFIC(id: number): void {
    const fic = this.fics.find(f => f.id === id);
    if (fic) {
      this.ficEditar = {
        id: fic.id,
        nombre_fic: fic.nombre_fic,
        gestor: fic.gestor,
        tipo: fic.tipo
      };
      this.mostrarModalEditar = true;
    }
  }

  guardarEdicionFIC(): void {
    if (this.ficEditar.id) {
      const ficCompleto = this.fics.find(f => f.id === this.ficEditar.id);
      if (ficCompleto) {
        const ficActualizado: FIC = {
          ...ficCompleto,
          nombre_fic: this.ficEditar.nombre_fic || ficCompleto.nombre_fic,
          gestor: this.ficEditar.gestor || ficCompleto.gestor,
          tipo: this.ficEditar.tipo || ficCompleto.tipo
        };

        this.ficService.modificarFIC(ficActualizado).subscribe({
          next: (ficActualizado) => {
            const index = this.fics.findIndex(f => f.id === this.ficEditar.id);
            if (index !== -1) {
              this.fics[index] = ficActualizado;
              this.ficsFiltrados = [...this.fics];
            }
            this.cerrarModalEditar();
          },
          error: (err) => {
            console.error('Error al actualizar FIC:', err);
            alert('Error al actualizar el FIC. Por favor, intenta nuevamente.');
          }
        });
      }
    }
    window.location.reload();
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.ficEditar = {
      nombre_fic: '',
      gestor: '',
      tipo: ''
    };
  }

  confirmarEliminar(fic: FIC): void {
    this.ficAEliminar = fic;
    this.mostrarModalEliminar = true;
  }

  eliminarFIC(): void {
    if (!this.ficAEliminar) return;

     this.ficService.eliminarFIC(this.ficAEliminar.id).subscribe({
       next: () => {
         this.cargarFICs();
         this.cerrarModal();
       },
       error: (err) => {
         console.error('Error al eliminar FIC:', err);
         this.cerrarModal();
       }
     });

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
