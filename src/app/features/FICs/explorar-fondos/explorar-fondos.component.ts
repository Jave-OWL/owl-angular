import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FIC } from '../../../core/models/FIC.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FICService } from '../../../core/services/fic.service';
import { driver } from "driver.js";
import { FondoCardComponent } from '../../../shared/components/fondo-card/fondo-card.component';


@Component({
  selector: 'app-explorar-fondos',
  imports: [CommonModule, FondoCardComponent],
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
  tiposFondoUnicos: string[] = [];
  gestorSeleccionado: string = '';
  tipoFondoSeleccionado: string = '';
  ordenSeleccionado: string = '';
  selectedGestorLogo: string = 'assets/images/FIC.webp';

  // Propiedades para dropdowns personalizados
  dropdownGestorAbierto: boolean = false;
  dropdownTipoAbierto: boolean = false;
  dropdownEAAbierto: boolean = false;
  dropdownOrdenarAbierto: boolean = false;

  opcionesEA = [
    { valor: 'minima', etiqueta: 'EA Mínima' },
    { valor: 'maxima', etiqueta: 'EA Máxima' },
    { valor: 'promedio', etiqueta: 'EA Promedio' }
  ];

  opcionesOrdenar = [
    { valor: '', etiqueta: 'Sin ordenar' },
    { valor: 'nombre-asc', etiqueta: 'Nombre A-Z' },
    { valor: 'nombre-desc', etiqueta: 'Nombre Z-A' },
    { valor: 'ea-asc', etiqueta: 'EA Ascendente' },
    { valor: 'ea-desc', etiqueta: 'EA Descendente' }
  ];

  eaSeleccionado = this.opcionesEA[0];
  ordenarSeleccionado = this.opcionesOrdenar[0];

  constructor(private ficService: FICService,
              private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit() {
    this.cargarFICs();
    localStorage.setItem('primeraVisita', 'false');
  }

  cargarLogos() {
    this.fondos.forEach(fondo => {
      const img = new Image();
        // Usar el nombre del gestor tal cual para el logo, igual que en el detalle de FIC
        fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.webp';
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.webp';
      };
      img.src = fondo.logo;
    });
  }

  handleEAChange(value: string) {
    switch(value) {
      case 'promedio':
        this.cargarPromedioEA();
        break;
      case 'minima':
        this.cargarEA();
        break;
      case 'maxima':
        this.cargarMaxEA();
        break;
    }
  }

  cargarEA(){
    this.fondos.forEach(fondo => {
      // Obtener todas las rentabilidades del último mes
      const valores = fondo.rentabilidad_historicas.map(item => item.ultimo_mes);
      // Filtrar los valores distintos de 0 y ordenar ascendente
      const valoresNoCero = valores.filter(v => v !== 0).sort((a, b) => a - b);
      if (valoresNoCero.length > 0) {
        fondo.ea = parseFloat((valoresNoCero[0]*100).toFixed(2));
      } else {
        // Si todos son 0, usar 0
        fondo.ea = 0;
      }
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
        // Mezclar aleatoriamente los FICs
        this.fondos = data.sort(() => Math.random() - 0.5);
        this.fondosFiltrados = [...this.fondos];
        this.cargarInfo();
        this.cargarLogos();  
        this.cargarEA();
        this.cargarGestoresUnicos();
        this.cargarTiposFondoUnicos();
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

  private normalizarGestor(gestor: string): string {
    if (!gestor) return gestor;
    // Quitar tildes y pasar a minúsculas para comparar
    const nombre = gestor
      .toLowerCase()
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u');
    if (
      nombre.includes('progresion') &&
      (nombre.includes('comisionista') || nombre.includes('sociedad') || nombre.includes('s.a'))
    ) {
      return 'Progresión S.A.';
    }
    if (nombre.includes('davivienda')) {
      return 'Davivienda';
    }
    if (nombre.includes('sura')) {
      return 'Sura';
    }
    return gestor;
  }

  cargarInfo(){
    this.fondos.forEach(fondo => {
      fondo.nombre_fic = fondo.nombre_fic.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      fondo.nombre_fic = fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');
      // Normalizar gestor
      fondo.gestor = this.normalizarGestor(fondo.gestor);
    });
  }

  cargarGestoresUnicos() {
    // Normalizar todos los nombres de gestor para agrupar equivalentes
    const gestoresSet = new Set(this.fondos.map(fondo => this.normalizarGestor(fondo.gestor)));
    this.gestoresUnicos = Array.from(gestoresSet).sort();
  }

  cargarTiposFondoUnicos() {
    const tiposSet = new Set(this.fondos.map(fondo => fondo.tipo));
    this.tiposFondoUnicos = Array.from(tiposSet).sort();
  }

  filtrarPorTipo(tipo: string) {
    this.tipoFondoSeleccionado = tipo;
    this.aplicarFiltros();
    if (this.ordenSeleccionado) {
      this.aplicarFiltro(this.ordenSeleccionado);
    }
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

    // Aplicar filtro por tipo de fondo
    if (this.tipoFondoSeleccionado) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo => 
        fondo.tipo === this.tipoFondoSeleccionado
      );
    }
  }

  filtrarPorGestor(gestor: string) {
    this.gestorSeleccionado = gestor;
    if (gestor) {
      this.selectedGestorLogo = `assets/images/${gestor}Logo.webp`;
      // Fallback al logo por defecto si no se encuentra la imagen
      const img = new Image();
      img.onerror = () => {
        this.selectedGestorLogo = 'assets/images/FIC.webp';
      };
      img.src = this.selectedGestorLogo;
    } else {
      this.selectedGestorLogo = 'assets/images/FIC.webp';
    }
    this.aplicarFiltros();
    if (this.ordenSeleccionado) {
      this.aplicarFiltro(this.ordenSeleccionado);
    }
  }

  limpiarFiltroGestor() {
    this.gestorSeleccionado = '';
    this.selectedGestorLogo = 'assets/images/FIC.webp';
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

  // Métodos para dropdowns personalizados
  toggleDropdownGestor() {
    this.dropdownGestorAbierto = !this.dropdownGestorAbierto;
    if (this.dropdownGestorAbierto) {
      this.dropdownTipoAbierto = false;
      this.dropdownEAAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownTipo() {
    this.dropdownTipoAbierto = !this.dropdownTipoAbierto;
    if (this.dropdownTipoAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownEAAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownEA() {
    this.dropdownEAAbierto = !this.dropdownEAAbierto;
    if (this.dropdownEAAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownTipoAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownOrdenar() {
    this.dropdownOrdenarAbierto = !this.dropdownOrdenarAbierto;
    if (this.dropdownOrdenarAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownTipoAbierto = false;
      this.dropdownEAAbierto = false;
    }
  }

  cerrarDropdownGestor() {
    setTimeout(() => this.dropdownGestorAbierto = false, 200);
  }

  cerrarDropdownTipo() {
    setTimeout(() => this.dropdownTipoAbierto = false, 200);
  }

  cerrarDropdownEA() {
    setTimeout(() => this.dropdownEAAbierto = false, 200);
  }

  cerrarDropdownOrdenar() {
    setTimeout(() => this.dropdownOrdenarAbierto = false, 200);
  }

  seleccionarGestor(gestor: string, logo: string) {
    this.gestorSeleccionado = gestor;
    this.selectedGestorLogo = logo || 'assets/images/FIC.webp';
    this.dropdownGestorAbierto = false;
    this.filtrarPorGestor(gestor);
  }

  seleccionarTipo(tipo: string) {
    this.tipoFondoSeleccionado = tipo;
    this.dropdownTipoAbierto = false;
    this.filtrarPorTipo(tipo);
  }

  seleccionarEA(opcion: any) {
    this.eaSeleccionado = opcion;
    this.dropdownEAAbierto = false;
    this.handleEAChange(opcion.valor);
  }

  seleccionarOrdenar(opcion: any) {
    this.ordenarSeleccionado = opcion;
    this.dropdownOrdenarAbierto = false;
    this.aplicarFiltro(opcion.valor);
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
        element: '.search-wrapper',
        popover: {
          title: 'Barra de Búsqueda',
          description: 'Encuentra cualquier fondo de inversión en nuestra base de datos',
          side: 'bottom',
          align: 'center'
        }
      },
      { 
        element: '#filtro-gestor',
        popover: {
          title: 'Filtro por Gestor',
          description: 'Filtra los fondos por el gestor que administra el fondo.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#filtro-tipo',
        popover: {
          title: 'Filtro por Tipo',
          description: 'Filtra los fondos por el tipo de fondo.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#filtro-ea',
        popover: {
          title: 'Filtro por EA',
          description: 'Filtra los fondos por la rentabilidad EA.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#filtro-ordenar',
        popover: {
          title: 'Ordenar',
          description: 'Ordena los fondos por nombre o rentabilidad EA.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.info-fic',
        popover: {
          title: 'Información general',
          description: 'Información general sobre el fondo de inversión.',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '#ea',
        popover: {
          title: 'Rentabilidad',
          description: 'Rentabilidad del fondo de inversión. Carga la EA mínima por defecto.',
          side: 'top',
          align: 'center'
        }
      }
    ]
    });
}