import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FICService } from '../../../core/services/fic.service';
import { FIC, ComposicionPortafolio } from '../../../core/models/FIC.model';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChildren } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-detalle-fondo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-fondo.component.html',
  styleUrl: './detalle-fondo.component.css'
})

export class DetalleFondoComponent {
  queryParam: string = '';
  id = 1;
  fondo?: FIC;
  composicion_portafolios?: any[];
  composicionesPorTipo: { [key: string]: any[] } = {};

  private viewReady = false;

  ngOnInit(): void {
    this.ficService.findById(this.queryParam ? +this.queryParam : this.id).subscribe(
      (data) => {
        this.fondo = data;
        console.log('Datos del fondo:', this.fondo);
        this.cargarLogo();
        this.cargarComposiciones();
        if (this.viewReady) {
          this.renderPieCharts();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    ); 
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.fondo) {
      this.renderPieCharts();
    }
  }
    cargarLogo() {
    // Itera sobre cada 'fondo' en el array 'fondos'
    if(this.fondo){
      // Crea un nuevo objeto Image para verificar la existencia del logo
      const img = new Image();

      // Establece la ruta del logo inicial basado en la propiedad 'banco' de 'fondo'
      this.fondo.logo = 'assets/images/' + this.fondo?.gestor + 'Logo.png';

      // Agrega un manejador de eventos de error para establecer un logo predeterminado si no se encuentra el logo especifico
      img.onerror = () => {
        if (this.fondo) {
        this.fondo.logo = 'assets/images/FIC.png'; // Ruta del logo predeterminado
      }};

      // Inicia la carga de la imagen para activar el manejador de error si falla
      img.src = this.fondo.logo;
  }
}

  mostrarCalculadora() {

  }

  cargarComposiciones() {
    if (this.fondo) {
      this.composicion_portafolios = this.fondo.composicion_portafolios;
      // Agrupar composiciones por tipo
      this.composicionesPorTipo = this.composicion_portafolios?.reduce((acc: { [key: string]: any[] }, item) => {
        const tipo = item.tipo_composicion;
        if (!acc[tipo]) {
          acc[tipo] = [];
        }
        acc[tipo].push(item);
        return acc;
      }, {}) || {};
      
      console.log('Composiciones cargadas por tipo:', this.composicionesPorTipo);
      this.renderPieCharts();
    }
  }

  charts: echarts.ECharts[] = [];
  @ViewChildren('chartCalificacion') chartCalificacion!: ElementRef[];
  @ViewChildren('chartTipoRenta') chartTipoRenta!: ElementRef[];
  @ViewChildren('chartPaisEmisor') chartPaisEmisor!: ElementRef[];
  @ViewChildren('chartMoneda') chartMoneda!: ElementRef[];
  @ViewChildren('chartActivo') chartActivo!: ElementRef[];
  @ViewChildren('chartSectorEconomico') chartSectorEconomico!: ElementRef[];

  constructor(
    private ficService: FICService, 
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.route.queryParams.subscribe((params) => {
      this.queryParam = params['id'];
    });
  }

  renderPieCharts() {
    if (!this.composicionesPorTipo || Object.keys(this.composicionesPorTipo).length === 0) {
      console.log('No hay composiciones disponibles');
      return;
    }

    // Destruir gráficos existentes
    this.charts.forEach(chart => chart.dispose());
    this.charts = [];

    const containerConfigs = [
      { container: this.chartCalificacion, tipo: 'calificacion', title: 'Calificación' },
      { container: this.chartTipoRenta, tipo: 'tipo_renta', title: 'Tipo de Renta' },
      { container: this.chartPaisEmisor, tipo: 'pais_emisor', title: 'País Emisor' },
      { container: this.chartMoneda, tipo: 'moneda', title: 'Moneda' },
      { container: this.chartActivo, tipo: 'activo', title: 'Activo' },
      { container: this.chartSectorEconomico, tipo: 'sector_economico', title: 'Sector Económico' }
    ];

    containerConfigs.forEach(config => {
      if (config.container) {
        config.container.forEach((containerRef: ElementRef) => {
          const element = containerRef.nativeElement;
          const composicionData = this.composicionesPorTipo[config.tipo] || [];
          this.renderChart(element, composicionData, config.title);
        });
      }
    });
  }

  renderChart(container: HTMLElement, composicionData: ComposicionPortafolio[], title?: string) {
    this.ngZone.runOutsideAngular(() => {
      const data = composicionData.length > 0 
        ? composicionData.map(comp => ({
            name: comp.categoria,
            value: comp.participacion * 100 // Convertir a porcentaje
          }))
        : this.generateRandomData();

      const chart = echarts.init(container);
      this.charts.push(chart);

      const colors = ["#437ac6ff", "#588bd2", "#699be1ff", "#79aaefff", "#86b1edff", "#a0c5f8ff", 
                      "#ffbd59", "#f9c66fff", "#f7c06fff", "#f5b96fff", "#f3b26fff", "#f0a96fff"];
      const option: echarts.EChartsOption = {
        title: {
          text: title,
          left: 'center',
          subtext: 'Participación (%)',
          textStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}%'
        },
        series: [{
          name: title,
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}: {c}%'
          },
        }],
        legend: {
          show: true,
          orient: 'horizontal',
          top: 'top',
          data: data.map(item => item.name)
        },
        color: colors
      }
      ;

      chart.setOption(option);

      // Manejar el resize
      const resizeHandler = () => {
        chart.resize();
      };
      window.addEventListener('resize', resizeHandler);
    });
  }

  generateRandomData() {
    const data = [];
    const labels = ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4', 'Elemento 5', 'Elemento 6'];
    for (let i = 0; i < 6; i++) {
      data.push({
        name: labels[i],
        value: Math.floor(Math.random() * (30 - 1 + 1)) + 1
      });
    }
    return data;
  }

}


