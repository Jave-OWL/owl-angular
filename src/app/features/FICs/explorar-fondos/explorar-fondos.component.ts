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

  // Nuevas propiedades para filtros y ordenamiento
  gestoresUnicos: string[] = [];
  gestorSeleccionado: string = '';
  ordenSeleccionado: string = '';

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

  showDropdownOrdenamiento(){
    console.log("ShowDropdownOrdenamiento");
    var dropdown = document.getElementById("dropdownOrdenamiento");
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
        this.cargarGestoresUnicos();
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

  getTipoId(tipo: string): string {
    if (!tipo) return '';
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }

  cargarGestoresUnicos() {
    const gestoresSet = new Set(this.fondos.map(fondo => fondo.gestor));
    this.gestoresUnicos = Array.from(gestoresSet).sort();
  }

  aplicarFiltros() {
    this.fondosFiltrados = [...this.fondos];

    // Aplicar filtro de búsqueda por texto
    if (this.textoBusqueda.trim()) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo => 
        fondo.nombre_fic.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        fondo.gestor.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
    }

    // Aplicar filtro por gestor
    if (this.gestorSeleccionado) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo => 
        fondo.gestor.toLowerCase() === this.gestorSeleccionado.toLowerCase()
      );
    }
  }

  filtrarPorGestor(gestor: string) {
    this.gestorSeleccionado = gestor;
    this.aplicarFiltros();
    if (this.ordenSeleccionado) {
      this.aplicarFiltro(this.ordenSeleccionado);
    }
  }

  limpiarFiltroGestor() {
    this.gestorSeleccionado = '';
    this.aplicarFiltros();
    if (this.ordenSeleccionado) {
      this.aplicarFiltro(this.ordenSeleccionado);
    }
  }

  aplicarFiltro(criterio: string) {
    this.criterioOrdenamiento = criterio;
    this.ordenSeleccionado = criterio;
    
    // Aplicar filtros primero
    this.aplicarFiltros();

    // Luego ordenar
    switch (criterio) {
      case 'nombre-asc':
        this.fondosFiltrados.sort((a, b) => a.nombre_fic.localeCompare(b.nombre_fic));
        break;
      case 'nombre-desc':
        this.fondosFiltrados.sort((a, b) => b.nombre_fic.localeCompare(a.nombre_fic));
        break;
      case 'ea-asc':
        this.fondosFiltrados.sort((a, b) => (a.ea || 0) - (b.ea || 0));
        break;
      case 'ea-desc':
        this.fondosFiltrados.sort((a, b) => (b.ea || 0) - (a.ea || 0));
        break;
      case 'tipo':
        this.fondosFiltrados.sort((a, b) => a.tipo.localeCompare(b.tipo));
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
    
    this.aplicarFiltros();
    
    if (this.ordenSeleccionado) {
      this.aplicarFiltro(this.ordenSeleccionado);
    }
    
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
        popover: {
          title: 'Búsqueda',
          description: 'Busca fondos por nombre o gestor.'
        }
      },
      { 
        element: '.bi-filter',
        popover: {
          title: 'Filtro por Gestor',
          description: 'Filtra los fondos por el gestor que administra el fondo.'
        }
      },
      { 
        element: '.bi-search',
        popover: {
          title: 'Buscar',
          description: 'Inicia la búsqueda con los filtros aplicados.'
        }
      },
      {
        element: '.bi-arrow-down-up',
        popover: {
          title: 'Ordenar',
          description: 'Ordena los fondos por nombre o rentabilidad EA.'
        }
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
