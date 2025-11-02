import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FondoCardComponent } from '../../../shared/components/fondo-card/fondo-card.component';
import { FIC } from '../../../core/models/FIC.model';
import { FICService } from '../../../core/services/fic.service';

@Component({
  selector: 'app-comparar-fondos',
  imports: [CommonModule, FondoCardComponent],
  templateUrl: './comparar-fondos.component.html',
  styleUrl: './comparar-fondos.component.css'
})
export class CompararFondosComponent implements OnInit {
  fondos: FIC[] = [];
  fondosFiltrados: FIC[] = [];
  fondosSeleccionados: FIC[] = [];
  textoBusqueda: string = '';
  isLoading: boolean = true;
  error: boolean = false;
  maxSeleccion: number = 4;
  mostrarTablaAmpliada: boolean = false;

  // Filtros
  gestoresUnicos: string[] = [];
  tiposFondoUnicos: string[] = [];
  gestorSeleccionado: string = '';
  tipoFondoSeleccionado: string = '';
  selectedGestorLogo: string = 'assets/images/FIC.webp';

  // Dropdowns
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

  // Campos de comparación
  camposComparacion = [
    { key: 'gestor', label: 'Gestor', tipo: 'texto' },
    { key: 'tipo', label: 'Tipo Renta', tipo: 'tipo' },
    { key: 'caracteristicas', label: 'Tipo', tipo: 'caracteristicas-tipo' },
    { key: 'ea', label: 'Rentabilidad', tipo: 'numero', destacar: true },
    { key: 'caracteristicas', label: 'Valor', tipo: 'caracteristicas-valor' }
  ];

  constructor(private ficService: FICService) {}

  ngOnInit(): void {
    this.cargarFICs();
  }

  cargarFICs(): void {
    this.isLoading = true;
    this.ficService.findAll().subscribe({
      next: (data: FIC[]) => {
        this.fondos = data;
        this.fondosFiltrados = [...this.fondos];
        this.cargarLogos();
        this.cargarEA();
        this.cargarInfo();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar FICs:', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  cargarLogos(): void {
    this.fondos.forEach(fondo => {
      const img = new Image();
      fondo.logo = 'assets/images/' + fondo.gestor + 'Logo.webp';
      img.onerror = () => {
        fondo.logo = 'assets/images/FIC.webp';
      };
      img.src = fondo.logo;
    });
  }

  cargarEA(): void {
    this.fondos.forEach(fondo => {
      const valores = fondo.rentabilidad_historicas.map(item => item.ultimo_mes);
      const valoresNoCero = valores.filter(v => v !== 0).sort((a, b) => a - b);
      if (valoresNoCero.length > 0) {
        fondo.ea = parseFloat((valoresNoCero[0] * 100).toFixed(2));
      } else {
        fondo.ea = 0;
      }
    });
  }

  cargarInfo(): void {
    this.fondos.forEach(fondo => {
      fondo.nombre_fic = fondo.nombre_fic.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      fondo.nombre_fic = fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');
      fondo.gestor = this.normalizarGestor(fondo.gestor);
    });
    this.cargarGestoresUnicos();
    this.cargarTiposFondoUnicos();
  }

  private normalizarGestor(gestor: string): string {
    if (!gestor) return gestor;
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

  cargarGestoresUnicos(): void {
    const gestoresSet = new Set(this.fondos.map(fondo => this.normalizarGestor(fondo.gestor)));
    this.gestoresUnicos = Array.from(gestoresSet).sort();
  }

  cargarTiposFondoUnicos(): void {
    const tiposSet = new Set(this.fondos.map(fondo => fondo.tipo));
    this.tiposFondoUnicos = Array.from(tiposSet).sort();
  }

  handleEAChange(value: string): void {
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
    this.aplicarFiltros();
  }

  cargarMaxEA(): void {
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

  cargarPromedioEA(): void {
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

  aplicarFiltros(): void {
    this.fondosFiltrados = [...this.fondos];

    if (this.textoBusqueda.trim()) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo =>
        fondo.nombre_fic.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        fondo.gestor.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
    }

    if (this.gestorSeleccionado) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo =>
        fondo.gestor.toLowerCase() === this.gestorSeleccionado.toLowerCase()
      );
    }

    if (this.tipoFondoSeleccionado) {
      this.fondosFiltrados = this.fondosFiltrados.filter(fondo =>
        fondo.tipo === this.tipoFondoSeleccionado
      );
    }

    if (this.ordenarSeleccionado.valor) {
      this.aplicarOrdenamiento(this.ordenarSeleccionado.valor);
    }
  }

  aplicarOrdenamiento(criterio: string): void {
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
    }
  }

  // Métodos de Dropdowns
  toggleDropdownGestor(): void {
    this.dropdownGestorAbierto = !this.dropdownGestorAbierto;
    if (this.dropdownGestorAbierto) {
      this.dropdownTipoAbierto = false;
      this.dropdownEAAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownTipo(): void {
    this.dropdownTipoAbierto = !this.dropdownTipoAbierto;
    if (this.dropdownTipoAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownEAAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownEA(): void {
    this.dropdownEAAbierto = !this.dropdownEAAbierto;
    if (this.dropdownEAAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownTipoAbierto = false;
      this.dropdownOrdenarAbierto = false;
    }
  }

  toggleDropdownOrdenar(): void {
    this.dropdownOrdenarAbierto = !this.dropdownOrdenarAbierto;
    if (this.dropdownOrdenarAbierto) {
      this.dropdownGestorAbierto = false;
      this.dropdownTipoAbierto = false;
      this.dropdownEAAbierto = false;
    }
  }

  cerrarDropdownGestor(): void {
    setTimeout(() => this.dropdownGestorAbierto = false, 200);
  }

  cerrarDropdownTipo(): void {
    setTimeout(() => this.dropdownTipoAbierto = false, 200);
  }

  cerrarDropdownEA(): void {
    setTimeout(() => this.dropdownEAAbierto = false, 200);
  }

  cerrarDropdownOrdenar(): void {
    setTimeout(() => this.dropdownOrdenarAbierto = false, 200);
  }

  seleccionarGestor(gestor: string, logo: string): void {
    this.gestorSeleccionado = gestor;
    this.selectedGestorLogo = logo || 'assets/images/FIC.webp';
    this.dropdownGestorAbierto = false;
    this.aplicarFiltros();
  }

  seleccionarTipo(tipo: string): void {
    this.tipoFondoSeleccionado = tipo;
    this.dropdownTipoAbierto = false;
    this.aplicarFiltros();
  }

  seleccionarEA(opcion: any): void {
    this.eaSeleccionado = opcion;
    this.dropdownEAAbierto = false;
    this.handleEAChange(opcion.valor);
  }

  seleccionarOrdenar(opcion: any): void {
    this.ordenarSeleccionado = opcion;
    this.dropdownOrdenarAbierto = false;
    this.aplicarFiltros();
  }

  getGestorLogo(gestor: string): string {
    return 'assets/images/' + gestor.toLowerCase().replace(/\s+/g, '') + '.webp';
  }

  estaSeleccionado(fondo: FIC): boolean {
    return this.fondosSeleccionados.some(f => f.id === fondo.id);
  }

  toggleSeleccion(fondo: FIC): void {
    const index = this.fondosSeleccionados.findIndex(f => f.id === fondo.id);
    
    if (index > -1) {
      this.fondosSeleccionados.splice(index, 1);
    } else {
      if (this.fondosSeleccionados.length < this.maxSeleccion) {
        this.fondosSeleccionados.push(fondo);
      } else {
        alert(`Solo puedes comparar hasta ${this.maxSeleccion} fondos a la vez`);
      }
    }
  }

  buscarFondos(event: any): void {
    this.textoBusqueda = event.target.value.toLowerCase();
    
    if (this.textoBusqueda.trim()) {
      this.fondosFiltrados = this.fondos.filter(fondo =>
        fondo.nombre_fic.toLowerCase().includes(this.textoBusqueda) ||
        fondo.gestor.toLowerCase().includes(this.textoBusqueda)
      );
    } else {
      this.fondosFiltrados = [...this.fondos];
    }
  }

  limpiarSeleccion(): void {
    this.fondosSeleccionados = [];
  }

  toggleTablaAmpliada(): void {
    this.mostrarTablaAmpliada = !this.mostrarTablaAmpliada;
  }

  cerrarTablaAmpliada(): void {
    this.mostrarTablaAmpliada = false;
  }

  getValorCampo(fondo: FIC, campo: any): any {
    let valor = (fondo as any)[campo.key];
    
    if (campo.tipo === 'fecha' && valor) {
      return new Date(valor).toLocaleDateString('es-ES');
    }
    
    if (campo.tipo === 'numero' && valor !== undefined) {
      return valor + '%';
    }
    
    if (campo.tipo === 'tipo') {
      return this.getTipoTexto(valor);
    }
    
    // Manejo de caracteristicas - tipo
    if (campo.tipo === 'caracteristicas-tipo' && Array.isArray(valor) && valor.length > 0) {
      return valor[0].tipo || 'N/A';
    }
    
    // Manejo de caracteristicas - valor
    if (campo.tipo === 'caracteristicas-valor' && Array.isArray(valor) && valor.length > 0) {
      const valorNum = valor[0].valor;
      return valorNum ? valorNum + ' Millones' : 'N/A';
    }
    
    return valor || 'N/A';
  }

  getTipoTexto(tipo: string): string {
    if (!tipo) return 'N/A';
    if (tipo.length === 1) return tipo;
    const palabras = tipo.trim().split(/\s+/);
    const ultimaPalabra = palabras[palabras.length - 1];
    return ultimaPalabra.charAt(0).toUpperCase() + ultimaPalabra.slice(1).toLowerCase();
  }

  getMejorValor(campo: any): number | null {
    if (campo.tipo !== 'numero' || !campo.destacar) return null;
    
    const valores = this.fondosSeleccionados
      .map(f => (f as any)[campo.key])
      .filter(v => v !== undefined && v !== null);
    
    return valores.length > 0 ? Math.max(...valores) : null;
  }

  esMejorValor(fondo: FIC, campo: any): boolean {
    const mejorValor = this.getMejorValor(campo);
    if (mejorValor === null) return false;
    return (fondo as any)[campo.key] === mejorValor;
  }
}
