import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FIC } from '../../../core/models/FIC.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FICService } from '../../../core/services/fic.service';
import { driver } from "driver.js";


@Component({
  selector: 'app-explorar-fondos',
  imports: [CommonModule, RouterLink],
  templateUrl: './explorar-fondos.component.html',
  styleUrl: './explorar-fondos.component.css'
})
export class ExplorarFondosComponent {

  fondos: FIC[] = [];

  fondosFiltrados: FIC[] = [...this.fondos];
  criterioOrdenamiento: string = '';
  textoBusqueda: string = '';
  error: boolean = false;
  valorMenor: number = 999;
  loaderTimeout: any;
  errorBusqueda: boolean = false;

  constructor(private ficService: FICService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit() {
    this.cargarFICs();
    localStorage.setItem('primeraVisita', 'false');
  }

  cargarLogos() {
    // Itera sobre cada 'fondo' en el array 'fondos'
    this.fondos.forEach(fondo => {
      // Crea un nuevo objeto Image para verificar la existencia del logo
      const img = new Image();

      // Establece la ruta del logo inicial basado en la propiedad 'banco' de 'fondo'
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.png';

      // Agrega un manejador de eventos de error para establecer un logo predeterminado si no se encuentra el logo especifico
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.png'; // Ruta del logo predeterminado
      };

      // Inicia la carga de la imagen para activar el manejador de error si falla
      img.src = fondo.logo;
    });
  }

  showDropdownGestor(){
    console.log("ShowDropdownGestor");
    var dropdown = document.getElementById("dropdownGestor");
    dropdown?.classList.toggle("show");
  }

  showDropdownEA(){
    console.log("ShowDropdownEA");
    var dropdown = document.getElementById("dropdownEA");
    dropdown?.classList.toggle("show");
  }

  cargarEA(){
    this.fondos.forEach(fondo => {
      fondo.ea = 99999;
      let eaMenor = 99999;
      fondo.rentabilidad_historicas.forEach(item => {
        if (item.ultimo_mes < eaMenor) {
          eaMenor = item.ultimo_mes;
          fondo.ea = parseFloat((item.ultimo_mes*100).toFixed(2));
        }
      })
    });
  }

  cargarMaxEA() {
    console.log("CargarMaxEA");
    this.fondos.forEach(fondo => {
      let eaMayor = -Infinity;
      fondo.rentabilidad_historicas.forEach(item => {
        if (item.ultimo_mes > eaMayor) {
          eaMayor = item.ultimo_mes;
          fondo.ea = parseFloat((eaMayor*100).toFixed(2));
        }
      })
    });
  }

  cargarPromedioEA(){
    this.fondos.forEach(fondo => {
      let eaPromedio = 0;
      let contador = 0;
      fondo.rentabilidad_historicas.forEach(item => {
        eaPromedio += item.ultimo_mes;
        contador++;
      });
      eaPromedio /= contador;
      fondo.ea = parseFloat((eaPromedio*100).toFixed(2));
    })
  }

  cargarFICs() {
    this.ficService.findAll().subscribe(
      (data: FIC[]) => {
        this.fondos = data;
        this.fondosFiltrados = [...this.fondos];
        this.cargarInfo();
        this.cargarLogos();  
        this.cargarEA();
        console.log(data);
      },
      (error: any) => {
        console.error('Error al obtener los fondos:', error);
        this.error = true;
      }
    );
  }
  verDetalle(id: number) {
    this.router.navigate(
      ['/detalle-fondo'],
      { queryParams: { id: id } });
  }

  cargarInfo(){
    this.fondos.forEach(fondo => {
      fondo.nombre_fic = fondo.nombre_fic.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      fondo.nombre_fic = fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');       
    });
  }

  filtrarFondos(){
    
  }

  filtrarPorGestor(gestor: string) {
    this.fondosFiltrados = [...this.fondos].filter(fondo => fondo.gestor.toLowerCase() === gestor.toLowerCase());
  }

  aplicarFiltro(criterio: string) {
    this.criterioOrdenamiento = criterio;
    this.fondosFiltrados = [...this.fondos].filter(fondo => 
      fondo.nombre_fic.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );

    switch (criterio) {
      case 'nombre':
        this.fondosFiltrados.sort((a, b) => a.nombre_fic.localeCompare(b.nombre_fic));
        break;
      case 'riesgo':
        this.fondosFiltrados.sort((a, b) => a.riesgo.localeCompare(b.riesgo));
        break;
      case 'rentabilidad':
        this.fondosFiltrados.sort((a, b) => {
          const rentA = a.rentabilidad;
          const rentB = b.rentabilidad;
          return rentB - rentA; // Orden descendente
        });
        break;  
    }
  }

  buscarFondos(event: any) {
    if (this.loaderTimeout) {
      clearTimeout(this.loaderTimeout);
    }

    this.errorBusqueda = false
    this.textoBusqueda = event.target.value;
    this.fondosFiltrados = [...this.fondos].filter(fondo => 
      fondo.nombre_fic.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      fondo.gestor.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
    this.aplicarFiltro(this.criterioOrdenamiento);
    this.loaderTimeout = setTimeout(() => {
      if (this.fondosFiltrados.length === 0) {
        this.errorBusqueda = true;
      }
    }, 800);
  }

    /*=====Driver JS - Tour de ayuda=====*/
    startTour() {
      this.driverObj.drive();
    }
  
    driverObj = driver({
    popoverClass: 'popover-owl',
    showProgress: true,
    steps: [
      { 
        element: '#OwlLupa',
        popover: {
          title: 'Explorar Fondos',
          description: 'Encuentra el fondo de inversión que mejor se adapte a tus necesidades.',
        }
      },
      { 
        element: '.input-busqueda',
      },
      { 
        element: '.bi-filter',
      },
      { 
        element: '.bi-search',
      },
      {
        element: '.info-fic',
        popover: {
          title: 'Información general',
          description: 'Información general sobre el fondo de inversión.',
        }
      },
      {
        element: '#ea',
        popover: {
          title: 'Rentabilidad',
          description: 'Rentabilidad del fondo de inversión.',
        }
      }
    ]
    });
}
