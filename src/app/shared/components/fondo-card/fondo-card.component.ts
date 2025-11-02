import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FIC } from '../../../core/models/FIC.model';

@Component({
  selector: 'app-fondo-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fondo-card.component.html',
  styleUrl: './fondo-card.component.css'
})
export class FondoCardComponent {
  @Input() fondo!: FIC;
  @Input() index: number = 0;
  @Input() modoSeleccion: boolean = false;
  @Input() seleccionado: boolean = false;
  @Output() seleccionToggle = new EventEmitter<FIC>();

  getTipoId(tipo: string): string {
    if (!tipo) return '';
    if(tipo.length === 1) return tipo.toLowerCase();
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }

  getTipoTexto(tipo: string): string {
    if (!tipo) return '';
    if(tipo.length === 1) return tipo;
    const palabras = tipo.trim().split(/\s+/);
    const ultimaPalabra = palabras[palabras.length - 1];
    return ultimaPalabra.charAt(0).toUpperCase() + ultimaPalabra.slice(1).toLowerCase();
  }

  onCardClick(event: Event) {
    if (this.modoSeleccion) {
      event.preventDefault();
      this.seleccionToggle.emit(this.fondo);
    }
  }
}
