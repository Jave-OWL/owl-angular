import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FIC } from '../../../core/models/FIC.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explorar-fondos',
  imports: [CommonModule, RouterLink],
  templateUrl: './explorar-fondos.component.html',
  styleUrl: './explorar-fondos.component.css'
})
export class ExplorarFondosComponent {
  fondos: FIC[] = [
      {
        id: 1,
        logo: '',
        riesgo: 'Riesgo Alto',
        nombre: 'Fondo Variable',
        gestor: 'Itau',
        rentabilidad: '10% E.A.',
        fechaCorte: new Date('2024-05-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.itau.com.co/'
      },
      {
        id: 2,
        logo: '',
        riesgo: 'Riesgo Bajo',
        nombre: 'Fondo Conservador',
        gestor: 'BancoDeBogota',
        rentabilidad: '3% E.A.',
        fechaCorte: new Date('2024-06-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.bancobogota.com.co/'
      },
      {
        id: 3,
        logo: '',
        riesgo: 'Riesgo Medio',
        nombre: 'Fiducuenta',
        gestor: 'Progresion',
        rentabilidad: '10% E.A.',
        fechaCorte: new Date('2024-04-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.progresion.com.co/'
      },
      {
        id: 4,
        logo: '',
        riesgo: 'Riesgo Variable',
        nombre: 'Fondo Mixto',
        gestor: 'Davivienda',
        rentabilidad: '7% E.A.',
        fechaCorte: new Date('2024-05-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.davivienda.com.co/'
      },
      {
        id: 5,
        logo: '',
        riesgo: 'Riesgo Alto',
        nombre: 'Fondo Accionario',
        gestor: 'Bancolombia',
        rentabilidad: '8% E.A.',
        fechaCorte: new Date('2024-06-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.bancolombia.com/'
      },
      {
        id: 6,
        logo: '',
        riesgo: 'Riesgo Alto',
        nombre: 'Fondo de Inversion Accionario',
        gestor: 'BancoDeOccidente',
        rentabilidad: '9% E.A.',
        fechaCorte: new Date('2024-07-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.grupoaval.com/'
      },
      {
        id: 7,
        logo: '',
        riesgo: 'Riesgo Medio',
        nombre: 'Fondo Mixto',
        gestor: 'Credicorp',
        rentabilidad: '6% E.A.',
        fechaCorte: new Date('2024-08-01'),
        custodio: 'Banco de Occidente',
        politicaInversion: 'Inversionista',
        link: 'https://www.cafetero.com.co/'
      }
    ];

  fondosFiltrados: FIC[] = [...this.fondos];
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
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.png';

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
    }
  }

  buscarFondos(event: any) {
    this.textoBusqueda = event.target.value;
    this.fondosFiltrados = [...this.fondos].filter(fondo => 
      fondo.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      fondo.gestor.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
    this.aplicarFiltro(this.criterioOrdenamiento);
  }
}
