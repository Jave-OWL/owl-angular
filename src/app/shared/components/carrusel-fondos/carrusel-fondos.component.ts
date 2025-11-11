import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-carrusel-fondos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel-fondos.component.html',
  styleUrl: './carrusel-fondos.component.css'
})
export class CarruselFondosComponent implements OnInit {
  @Input() fondos: FIC[] = [];
  @Input() titulo: string = 'Fondos de Inversión';
  
  currentIndex = 0;
  itemsPerView = 3;
  isLoading = false;
  error: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateItemsPerView();
    window.addEventListener('resize', () => this.updateItemsPerView());
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.updateItemsPerView());
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    if (width < 480) {
      this.itemsPerView = 1;
    } else if (width < 768) {
      this.itemsPerView = 2;
    } else {
      this.itemsPerView = 3;
    }
  }

  get maxIndex(): number {
    return Math.max(0, this.fondos.length - this.itemsPerView);
  }

  get translateX(): string {
    const cardWidth = 300;
    const gap = 20;
    return `translateX(-${this.currentIndex * (cardWidth + gap)}px)`;
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  goToSlide(index: number) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
    }
  }

  verDetalleFondo(fondoId: number) {
    this.router.navigate(['/fics/detalle'], { queryParams: { id: fondoId } });
  }

  getTipoId(tipo: string): string {
    if (!tipo) return '';
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }

  get totalPages(): number {
    return this.maxIndex + 1;
  }
}
