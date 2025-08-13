import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Fondo } from '../models/fondo.interface';

@Component({
  selector: 'app-explorar-fondos',
  imports: [CommonModule],
  templateUrl: './explorar-fondos.component.html',
  styleUrl: './explorar-fondos.component.css'
})
export class ExplorarFondosComponent {
  fondos: Fondo[] = [
    {
      logo: '',
      riesgo: 'Riesgo Variable',
      nombre: 'Fondo Variable',
      banco: 'Davivienda',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-05-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Bajo',
      nombre: 'Fondo Conservador',
      banco: 'BancoDeOccidente',
      rentabilidad: '3% E.A.',
      fechaCreacion: new Date('2024-06-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Medio',
      nombre: 'Fiducuenta',
      banco: 'BancoDeBogota',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-04-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Alto',
      nombre: 'Fiducuenta',
      banco: 'CredicorpCapital',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-07-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Alto',
      nombre: 'Fiducuenta',
      banco: 'Bancolombia',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-01-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Medio',
      nombre: 'BBVA Invierte',
      banco: 'BBVA',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-02-01')
    },
    {
      logo: '',
      riesgo: 'Riesgo Bajo',
      nombre: 'ItaCuenta',
      banco: 'Itau',
      rentabilidad: '10% E.A.',
      fechaCreacion: new Date('2024-03-01')
    }
  ];

  fondosFiltrados: Fondo[] = [...this.fondos];
  criterioOrdenamiento: string = '';
  textoBusqueda: string = '';

  ngOnInit() {
    this.cargarLogos();  
  }

  cargarLogos() {
    // Iterate over each 'fondo' in the 'fondos' array
    this.fondos.forEach(fondo => {
      // Create a new Image object to check for logo existence
      const img = new Image();

      // Set the initial logo path based on the 'banco' property of 'fondo'
      fondo.logo = 'assets/images/' + fondo.banco + 'Logo.png';

      // Add an error event handler to set a default logo if the specific logo is not found
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.png'; // Default logo path
      };

      // Start loading the image to trigger onerror if it fails
      img.src = fondo.logo;
    });
  }

  aplicarFiltro(criterio: string) {
    this.criterioOrdenamiento = criterio;
    
    this.fondosFiltrados = [...this.fondos].filter(fondo => 
      fondo.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );

    switch (criterio) {
      case 'nombre':
        this.fondosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'riesgo':
        this.fondosFiltrados.sort((a, b) => a.riesgo.localeCompare(b.riesgo));
        break;
      case 'rentabilidad':
        this.fondosFiltrados.sort((a, b) => {
          const rentA = parseFloat(a.rentabilidad);
          const rentB = parseFloat(b.rentabilidad);
          return rentB - rentA; // Orden descendente
        });
        break;
      case 'fecha':
        this.fondosFiltrados.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        break;
    }
  }

  buscarFondos(event: any) {
    this.textoBusqueda = event.target.value;
    this.aplicarFiltro(this.criterioOrdenamiento);
  }
}
