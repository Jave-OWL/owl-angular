import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FICService } from '../../../core/services/fic.service';
import { FIC, ComposicionPortafolio } from '../../../core/models/FIC.model';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChildren, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { driver } from "driver.js";
import { Chart } from 'chart.js';
import "driver.js/dist/driver.css";

  interface Historico {
    ultimo_mes: number;
    ultimo_6_meses: number;
    ultimo_anio: number;
    ultimo_2_anios: number;
    ultimo_3_anios: number;
  }


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
  participaciones: string[] = [];
  composicion_portafolios?: any[];
  caracteristicas: any[] = [];
  composicionesPorTipo: { [key: string]: any[] } = {};
  rentabilidadGeneral: number = 0.0;
  tipoParticipacion: string = '';
  private viewReady = false;
  rentabilidadesHistoricas?: { [key: string]: Historico[] };
  volatilidadesHistoricas?: { [key: string]: Historico[] };
 

  rentabilidadHistoricaFiltrada?: {
    [key: string]: {
      ultimo_mes: number;
      ultimo_6_meses: number;
      ultimo_anio: number;
      ultimo_2_anios: number;
      ultimo_3_anios: number;
    }[];
  };

  volatilidadHistoricaFiltrada?: {
    [key: string]: {
      ultimo_mes: number;
      ultimo_6_meses: number;
      ultimo_anio: number;
      ultimo_2_anios: number;
      ultimo_3_anios: number;
    }[];
  };

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
        this.cargarInformacionGeneral();
        this.cargarPart();
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

  cargarPart(){
    if(this.fondo){
      this.fondo.rentabilidad_historicas.forEach(item => {
      this.participaciones.push(item.tipo_de_participacion);
    });
    this.participaciones.push('Mostrar todos');
    }
    console.log(this.participaciones);
  }

  mostrarPart(){
    console.log(this.participaciones);
    const dropdown = document.querySelector('.participaciones-dropdown');
    dropdown?.classList.toggle('show');
  }

  rentabilidadesHistoricasFiltradas: any[] = [];
  volatilidadesHistoricasFiltradas: any[] = [];
  seleccionarPart(participacion: string){
    console.log(participacion);
    if(participacion === 'Mostrar todos' && this.fondo){
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas;
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas;
    } else if(this.fondo ){ 
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas.filter(item => item.tipo_de_participacion === participacion);
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas.filter(item => item.tipo_de_participacion === participacion);
    } else {
      this.rentabilidadesHistoricasFiltradas = [];
      this.volatilidadesHistoricasFiltradas = [];
    }
    this.renderRentabilidadChart();
  }

  cargarInformacionGeneral() {
  console.log('Cargando informacion general...');
  if (this.fondo) {
    //Selecciona la participación con menor ultimo_mes
    let participacionMenor: string | null = null;
    let valorMenor = Number.MAX_VALUE;

    this.fondo.rentabilidad_historicas.forEach(item => {
      if (item.ultimo_mes < valorMenor) {
        valorMenor = item.ultimo_mes;
        participacionMenor = item.tipo_de_participacion;
      }
    });

    if (!participacionMenor) return;

    //Asigna rentabilidadGeneral al ultimo_mes de esa participación
    const rentabilidadItem = this.fondo.rentabilidad_historicas.find(
      r => r.tipo_de_participacion === participacionMenor
    );
    if (rentabilidadItem) {
      this.rentabilidadGeneral = parseFloat((rentabilidadItem.ultimo_mes * 100).toFixed(2));
      this.tipoParticipacion = participacionMenor;
    }
    this.cargarRentabilidadHistoricas(this.fondo.rentabilidad_historicas);
    this.cargarVolatilidadesHistoricas(this.fondo.volatilidad_historicas);
    this.renderRentabilidadChart();
  }
}

  cargarRentabilidadHistoricas(rentabilidadHistoricas: any[]) {
    const rentabilidadesHistoricasPorNombre = rentabilidadHistoricas.reduce((acc, item) => {
      const nombre = item.tipo_de_participacion;
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push({
        ultimo_mes: parseFloat((item.ultimo_mes * 100).toFixed(2)),
        ultimo_6_meses: parseFloat((item.ultimo_6_meses * 100).toFixed(2)),
        ultimo_anio: parseFloat((item.ultimo_anio * 100).toFixed(2)),
        ultimo_2_anios: parseFloat((item.ultimo_2_anios * 100).toFixed(2)),
        ultimo_3_anios: parseFloat((item.ultimo_3_anios * 100).toFixed(2)),
      });
      return acc;
    }, {});
    this.rentabilidadesHistoricas = rentabilidadesHistoricasPorNombre;
    console.log('Rentabilidades historicas cargadas por nombre:', this.rentabilidadesHistoricas);
  }

  cargarVolatilidadesHistoricas(volatilidadesHistoricas: any[]) {
    const volatilidadesHistoricasPorNombre = volatilidadesHistoricas.reduce((acc, item) => {
      const nombre = item.tipo_de_participacion;
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push({
        ultimo_mes: parseFloat((item.ultimo_mes * 10).toFixed(2)),
        ultimo_6_meses: parseFloat((item.ultimo_6_meses * 10).toFixed(2)),
        ultimo_anio: parseFloat((item.ultimo_anio * 10).toFixed(2)),
        ultimo_2_anios: parseFloat((item.ultimo_2_anios * 10).toFixed(2)),
        ultimo_3_anios: parseFloat((item.ultimo_3_anios * 10).toFixed(2)),
      });
      return acc;
    }, {});
    this.volatilidadesHistoricas = volatilidadesHistoricasPorNombre;
    console.log('Volatilidades historicas cargadas por nombre:', this.volatilidadesHistoricas);
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

  /*==== Renderización de Gráficos ====*/
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
            color: '#666',
            fontFamily: 'Poppins, sans-serif'
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
        /*legend: {
          show: true,
          orient: 'horizontal',
          top: 'top',
          data: data.map(item => item.name)
        },*/
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

  //
  @ViewChild('chartRentabilidad') chartRentabilidad!: ElementRef;
  renderRentabilidadChart() {
    if (
      !this.rentabilidadesHistoricas ||
      !this.volatilidadesHistoricas ||
      Object.keys(this.rentabilidadesHistoricas).length === 0
    ) {
      console.log('No hay datos suficientes para el gráfico de rentabilidad/volatilidad');
      return;
    }

    const container = this.chartRentabilidad?.nativeElement;
    if (!container) {
      console.warn('Contenedor chartRentabilidad no encontrado');
      return;
    }

    const chart = echarts.init(container);
    this.charts.push(chart);

    const periodos = [
      'ultimo_3_anios',
      'ultimo_2_anios',
      'ultimo_anio',
      'ultimo_6_meses',
      'ultimo_mes'
    ];

    // --- 1. Encontrar la participación con menor rentabilidad en ultimo_mes ---
    let participacionMenor: string | null = null;
    let valorMenor = Number.MAX_VALUE;

    Object.keys(this.rentabilidadesHistoricas).forEach(tipo => {
      const r = this.rentabilidadesHistoricas?.[tipo][0]?.ultimo_mes;
      if (r && r < valorMenor) {
        valorMenor = r;
        participacionMenor = tipo;
      }
    });

    if (!participacionMenor) return;

    // --- 2. Rentabilidad de esa participación ---
    const rentabilidadSeries: echarts.EChartsOption['series'] = [
      {
        name: `Rentabilidad ${participacionMenor}`,
        type: 'bar',
        data: periodos.map(clave => this.rentabilidadesHistoricas![participacionMenor!][0][clave as keyof Historico]),
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: '#588bd2'
        }
      }
    ];

    // --- 3. Volatilidad correspondiente a la misma participación ---
    const volatilidadSerie: echarts.SeriesOption = {
      name: 'Volatilidad',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, type: 'solid' },
      data: periodos.map(clave => this.volatilidadesHistoricas![participacionMenor!][0][clave as keyof Historico]),
      itemStyle: { color: '#ffbd59' }
    };

    const columnColors = [
      "#437ac6ff", "#588bd2", "#699be1ff", "#79aaefff", "#86b1edff", "#a0c5f8ff",
      "#ffbd59", "#f9c66fff", "#f7c06fff", "#f5b96fff", "#f3b26fff", "#f0a96fff"
    ];

    const option: echarts.EChartsOption = {
      title: {
        text: 'Rentabilidad vs Volatilidad',
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: { trigger: 'axis' },
      legend: { top: 'bottom' },
      xAxis: { type: 'category', data: ['3 años', '2 años', '1 año', '6 meses', 'Último mes'] },
      yAxis: [
        { type: 'value', name: 'Rentabilidad (%)', position: 'left' },
        { type: 'value', name: 'Volatilidad', position: 'right' }
      ],
      series: [...rentabilidadSeries, volatilidadSerie],
      grid: { left: 60, right: 60, bottom: 60, top: 60 },
      color: columnColors
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
  }


  //

  /*=====Driver JS - Tour de ayuda=====*/
  startTour() {
    this.driverObj.drive();
  }

  driverObj = driver({
  popoverClass: 'popover-owl',
  showProgress: true,
  steps: [
    {
      element: '#focus',
      popover: {
        title: '% de efectivo anual',
        description: 'Cuanto ganas en un año de invertir',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#gestor',
      popover: {
        title: 'Gestor',
        description: 'Gestor es quien administra el FIC',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#custodio',
      popover: {
        title: 'Custodio',
        description: 'Custodio es quien protege y registra sus activos',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#rendimiento-card',
      popover: {
        title: 'Rendimiento',
        description: 'Comportamiento del fondo de inversión',
        side: 'bottom',
        align: 'center'
      }
    }
  ]});
}





