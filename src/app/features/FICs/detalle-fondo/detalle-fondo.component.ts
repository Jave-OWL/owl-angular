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
  private chartRentabilidadInstance?: echarts.ECharts;
  mostrarBienvenida: boolean = false;
  mostrarPolitica: boolean = false;
  mostrarDialogoTutorial: boolean = false; 
  mostrarMensajePostTour: boolean = false; 

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
    window.scrollTo(0, 0);
    this.verificarPrimeraVez();
    this.ficService.findById(this.queryParam ? +this.queryParam : this.id).subscribe(
      (data) => {
        this.fondo = data;
        this.fondo.nombre_fic = this.fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');
        this.cargarLogo();
        this.cargarComposiciones();

        setTimeout(() => {
          if (this.viewReady) {
            this.renderPieCharts();
            this.renderInversionesChart();
            this.renderDuracionesChart();
          }
        }, 0);

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
      this.renderInversionesChart();
      this.renderDuracionesChart();
    }
  }
  closeWelcomeScreen() {
    const owl = document.getElementById('OwlAyuda90');
    const mensaje = document.querySelector('.mensaje-owl') as HTMLElement;

    if (owl && mensaje) {
      owl.classList.remove('entrada');
      owl.classList.add('salida');

      mensaje.classList.remove('entrada');
      mensaje.classList.add('salida');

      const handleAnimationEnd = () => {
        this.mostrarBienvenida = false;
        owl.classList.remove('salida');
      };

      owl.addEventListener('animationend', handleAnimationEnd, { once: true });
    }
  }
  verificarPrimeraVez() {
    const numVisitas = parseInt(localStorage.getItem('numVisitasFIC') || '0');

    if (numVisitas === 0) {
      // Primera vez - mostrar diálogo de tutorial
      this.mostrarBienvenida = false;
      setTimeout(() => {
        this.mostrarDialogoTutorial = true;
      }, 1000);
      localStorage.setItem('numVisitasFIC', '1');
    } else if (numVisitas === 1) {
      // Segunda vez - no mostrar nada
      this.mostrarBienvenida = false;
      localStorage.setItem('numVisitasFIC', '2');
    } else if (numVisitas === 2) {
      // Tercera vez - mostrar mensaje de bienvenida
      this.mostrarBienvenida = true;
      localStorage.setItem('numVisitasFIC', '3');
    }
  }

  iniciarTutorial(aceptado: boolean) {
    this.mostrarDialogoTutorial = false;
    if (aceptado) {
      setTimeout(() => {
        this.startTour();
      }, 500);
    }
  }

  cerrarMensajePostTour() {
    const owl = document.getElementById('OwlAyuda90');
    const mensaje = document.querySelector('.mensaje-owl') as HTMLElement;

    if (owl && mensaje) {
      owl.classList.remove('entrada');
      owl.classList.add('salida');

      mensaje.classList.remove('entrada');
      mensaje.classList.add('salida');

      const handleAnimationEnd = () => {
        this.mostrarMensajePostTour = false;
        owl.classList.remove('salida');
      };

      owl.addEventListener('animationend', handleAnimationEnd, { once: true });
    }
  }

  getTipoId(tipo?: string): string {
    if (!tipo) return '';
    const palabras = tipo.trim().split(/\s+/);
    return palabras[palabras.length - 1].toLowerCase();
  }

  alternarPolitica(event?: any) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.mostrarPolitica = !this.mostrarPolitica;
    if (this.mostrarPolitica) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  cargarLogo() {
    if (this.fondo) {
      const img = new Image();

      this.fondo.logo = 'assets/images/' + this.fondo?.gestor + 'Logo.webp';

      img.onerror = () => {
        if (this.fondo) {
          this.fondo.logo = 'assets/images/FIC.webp'; // Ruta del logo predeterminado
        }
      };

      img.src = this.fondo.logo;
    }
  }

  mostrarCalculadora() {

  }

  cargarPart() {
    if (this.fondo) {
      this.fondo.rentabilidad_historicas.forEach(item => {
        this.participaciones.push(item.tipo_de_participacion);
      });
      if (this.fondo.rentabilidad_historicas.length > 1) {
        this.participaciones.push('Promedio');
      }
    }
  }

  mostrarPart() {
    const dropdown = document.querySelector('.participaciones-dropdown');
    dropdown?.classList.toggle('show');
  }

  rentabilidadesHistoricasFiltradas: any[] = [];
  volatilidadesHistoricasFiltradas: any[] = [];
  participacionSeleccionada: string = '';
  seleccionarPart(participacion: string) {
    this.participacionSeleccionada = participacion;
    if (participacion === 'Mostrar todos' && this.fondo) {
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas;
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas;
      this.cargarRentabilidadHistoricas(this.fondo.rentabilidad_historicas);
      this.cargarVolatilidadesHistoricas(this.fondo.volatilidad_historicas);
      this.tipoParticipacion = 'Todos';
      this.rentabilidadGeneral = 0;
    } else if (participacion === 'Promedio' && this.fondo) {
      const promedios = {
        ultimo_mes: 0,
        ultimo_6_meses: 0,
        ultimo_anio: 0,
        ultimo_2_anios: 0,
        ultimo_3_anios: 0
      };

      const total = this.fondo.rentabilidad_historicas.length;

      this.fondo.rentabilidad_historicas.forEach(item => {
        promedios.ultimo_mes += item.ultimo_mes;
        promedios.ultimo_6_meses += item.ultimo_6_meses;
        promedios.ultimo_anio += item.ultimo_anio;
        promedios.ultimo_2_anios += item.ultimo_2_anios;
        promedios.ultimo_3_anios += item.ultimo_3_anios;
      });

      Object.keys(promedios).forEach(key => {
        promedios[key as keyof typeof promedios] = promedios[key as keyof typeof promedios] / total;
      });

      this.rentabilidadesHistoricasFiltradas = [{
        id: 0,
        anio_corrido: 0,
        tipo_de_participacion: 'Promedio',
        ...promedios
      }];

      const promediosVolatilidad = {
        ultimo_mes: 0,
        ultimo_6_meses: 0,
        ultimo_anio: 0,
        ultimo_2_anios: 0,
        ultimo_3_anios: 0
      };

      this.fondo.volatilidad_historicas.forEach(item => {
        promediosVolatilidad.ultimo_mes += item.ultimo_mes;
        promediosVolatilidad.ultimo_6_meses += item.ultimo_6_meses;
        promediosVolatilidad.ultimo_anio += item.ultimo_anio;
        promediosVolatilidad.ultimo_2_anios += item.ultimo_2_anios;
        promediosVolatilidad.ultimo_3_anios += item.ultimo_3_anios;
      });

      Object.keys(promediosVolatilidad).forEach(key => {
        promediosVolatilidad[key as keyof typeof promediosVolatilidad] = promediosVolatilidad[key as keyof typeof promediosVolatilidad] / total;
      });

      this.volatilidadesHistoricasFiltradas = [{
        id: 0,
        anio_corrido: 0,
        tipo_de_participacion: 'Promedio',
        ...promediosVolatilidad
      }];

      this.cargarRentabilidadHistoricas(this.rentabilidadesHistoricasFiltradas);
      this.cargarVolatilidadesHistoricas(this.volatilidadesHistoricasFiltradas);
      this.tipoParticipacion = 'Promedio';
      this.rentabilidadGeneral = parseFloat((promedios.ultimo_mes * 100).toFixed(3));
    } else if (this.fondo) {
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas.filter(item => item.tipo_de_participacion === participacion);
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas.filter(item => item.tipo_de_participacion === participacion);

      this.cargarRentabilidadHistoricas(this.rentabilidadesHistoricasFiltradas);
      this.cargarVolatilidadesHistoricas(this.volatilidadesHistoricasFiltradas);
      this.tipoParticipacion = participacion;
      this.rentabilidadGeneral = parseFloat((this.rentabilidadesHistoricasFiltradas[0].ultimo_mes * 100).toFixed(2));
    } else {
      this.rentabilidadesHistoricasFiltradas = [];
      this.volatilidadesHistoricasFiltradas = [];
    }

    this.destruirGraficaRentabilidad();
    // Re-renderizar con los nuevos datos
    this.renderRentabilidadChart();
    this.renderInversionesChart();
  }

  destruirGraficaRentabilidad() {
    if (this.chartRentabilidadInstance) {
      window.removeEventListener('resize', this.resizeRentabilidadHandler);

      this.chartRentabilidadInstance.dispose();

      this.chartRentabilidadInstance = undefined;

      const container = this.chartRentabilidad?.nativeElement;
      if (container) {
        container.innerHTML = '';
      }
    }
  }

  private resizeRentabilidadHandler = () => {
    if (this.chartRentabilidadInstance) {
      this.chartRentabilidadInstance.resize();
    }
  };

  cargarInformacionGeneral() {
    if (this.fondo) {

      let participacionMenor: string | null = null;
      let valorMenor = Number.MAX_VALUE;

      const itemsFiltrados = this.fondo.rentabilidad_historicas.filter(item => item.ultimo_mes !== 0);
      const itemsParaBuscar = itemsFiltrados.length > 0 ? itemsFiltrados : this.fondo.rentabilidad_historicas;

      itemsParaBuscar.forEach(item => {
        if (item.ultimo_mes < valorMenor) {
          valorMenor = item.ultimo_mes;
          participacionMenor = item.tipo_de_participacion;
        }
      });

      if (!participacionMenor) return;

      const rentabilidadItem = this.fondo.rentabilidad_historicas.find(
        r => r.tipo_de_participacion === participacionMenor
      );
      if (rentabilidadItem) {
        this.rentabilidadGeneral = parseFloat((rentabilidadItem.ultimo_mes * 100).toFixed(3));
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
  }

  cargarVolatilidadesHistoricas(volatilidadesHistoricas: any[]) {
    const multiplicador =
      this.fondo?.gestor === 'FIDUCIARIA DE OCCIDENTE S.A.' || this.fondo?.gestor === 'Itaú Comisionista de Bolsa S.A.'
        ? 1
        : 100;

    const volatilidadesHistoricasPorNombre = volatilidadesHistoricas.reduce((acc, item) => {
      const nombre = item.tipo_de_participacion;
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push({
        ultimo_mes: parseFloat((item.ultimo_mes * multiplicador).toFixed(3)),
        ultimo_6_meses: parseFloat((item.ultimo_6_meses * multiplicador).toFixed(3)),
        ultimo_anio: parseFloat((item.ultimo_anio * multiplicador).toFixed(3)),
        ultimo_2_anios: parseFloat((item.ultimo_2_anios * multiplicador).toFixed(3)),
        ultimo_3_anios: parseFloat((item.ultimo_3_anios * multiplicador).toFixed(3)),
      });
      return acc;
    }, {});
    this.volatilidadesHistoricas = volatilidadesHistoricasPorNombre;
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
      return;
    }

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
      if (composicionData.length === 0) {
        return;
      }
      const data = composicionData
        .map(comp => ({
          name: comp.categoria,
          value: parseFloat((comp.participacion * 100).toFixed(2))
        }))
        .filter(item => item.value > 0);

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
            fontSize: 18,
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
          radius: '50%',
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
          labelLine: {
            show: true,
            length: 5,
            length2: 5
          }
        }],
        color: colors
      };

      chart.setOption(option);

      const resizeHandler = () => {
        chart.resize();
      };
      window.addEventListener('resize', resizeHandler);
    });
  }

  @ViewChild('chartRentabilidad') chartRentabilidad!: ElementRef;
  renderRentabilidadChart() {
    if (
      !this.rentabilidadesHistoricas ||
      !this.volatilidadesHistoricas ||
      Object.keys(this.rentabilidadesHistoricas).length === 0
    ) {
      return;
    }

    const container = this.chartRentabilidad?.nativeElement;
    if (!container) {
      console.warn('Contenedor chartRentabilidad no encontrado');
      return;
    }

    if (this.chartRentabilidadInstance) {
      this.chartRentabilidadInstance.dispose();
    }

    this.chartRentabilidadInstance = echarts.init(container);

    const periodos = [
      'ultimo_3_anios',
      'ultimo_2_anios',
      'ultimo_anio',
      'ultimo_6_meses',
      'ultimo_mes'
    ];

    if (this.participacionSeleccionada === 'Mostrar todos') {
      const series: echarts.EChartsOption['series'] = [];
      const legendData: string[] = [];
      // Rentabilidad
      Object.keys(this.rentabilidadesHistoricas).forEach(tipo => {
        legendData.push(`Rentabilidad ${tipo}`);
        series.push({
          name: `Rentabilidad ${tipo}`,
          type: 'bar',
          data: periodos.map(clave => parseFloat((this.rentabilidadesHistoricas![tipo][0][clave as keyof Historico]).toFixed(2))),
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          }
        });
      });
      // Volatilidad
      Object.keys(this.volatilidadesHistoricas).forEach(tipo => {
        legendData.push(`Volatilidad ${tipo}`);
        series.push({
          name: `Volatilidad ${tipo}`,
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, type: 'solid' },
          data: periodos.map(clave => parseFloat((this.volatilidadesHistoricas![tipo][0][clave as keyof Historico]).toFixed(2))),
          itemStyle: { color: '#ffbd59', },
          label: {
            show: true,
            formatter: '{c}'
          }
        });
      });
      const option: echarts.EChartsOption = {
        tooltip: { trigger: 'item' },
        legend: { top: 'bottom', data: legendData },
        xAxis: {
          type: 'category',
          data: ['3 años', '2 años', '1 año', '6 meses', 'Último mes'],
          axisLabel: { interval: 0, fontSize: 12 }
        },
        yAxis: [
          { 
            type: 'value', 
            name: 'Rentabilidad (%)', 
            position: 'left', 
            axisLabel: { formatter: '{value}%' },
            splitLine: { show: false }
          },
          { 
            type: 'value', 
            name: 'Volatilidad', 
            position: 'right', 
            splitLine: { show: false } 
          }
        ],
        series,
        grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
        color: ['#588bd2', '#ffbd59', '#437ac6ff', '#a0c5f8ff', '#ffbd59', '#f9c66fff', '#f5b96fff']
      };
      this.chartRentabilidadInstance.setOption(option);
      window.removeEventListener('resize', this.resizeRentabilidadHandler);
      window.addEventListener('resize', this.resizeRentabilidadHandler);
      return;
    }

    let participacionMostrar = this.participacionSeleccionada;
    if (!participacionMostrar || participacionMostrar === 'Mostrar todos') {
      const tipos = Object.keys(this.rentabilidadesHistoricas);
      const items = tipos.map(tipo => ({
        tipo,
        valor: this.rentabilidadesHistoricas?.[tipo][0]?.ultimo_mes
      })).filter(item => item.valor !== undefined);

      const itemsFiltrados = items.filter(item => item.valor !== 0);
      const itemsParaBuscar = itemsFiltrados.length > 0 ? itemsFiltrados : items;

      let valorMenor = Number.MAX_VALUE;
      itemsParaBuscar.forEach(item => {
        if (typeof item.valor === 'number' && item.valor < valorMenor) {
          valorMenor = item.valor;
          participacionMostrar = item.tipo;
        }
      });
    }

    if (!participacionMostrar) return;

    //Rentabilidad correspondiente
    const rentabilidadData = periodos.map(clave =>
      parseFloat((this.rentabilidadesHistoricas![participacionMostrar][0][clave as keyof Historico]).toFixed(2))
    );


    const rentabilidadBarData = rentabilidadData.map(value => ({
      value,
      itemStyle: {
        color: '#588bd2',
        borderRadius: value >= 0 ? [6, 6, 0, 0] : [0, 0, 6, 6]
      },
      label: {
        show: true,
        position: value >= 0 ? 'top' as const : 'bottom' as const,
        formatter: '{c}%'
      }
    }));

    const rentabilidadSeries: echarts.EChartsOption['series'] = [
      {
        name: `Rentabilidad ${participacionMostrar}`,
        type: 'bar',
        data: rentabilidadBarData
      }
    ];

    //Volatilidad correspondiente
    const volatilidadData = periodos.map(clave =>
      parseFloat((this.volatilidadesHistoricas![participacionMostrar][0][clave as keyof Historico]).toFixed(2))
    );

    const volatilidadSerie: echarts.SeriesOption = {
      name: 'Volatilidad',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, type: 'solid' },
      data: volatilidadData,
      itemStyle: { color: '#ffbd59' },
      label: {
        show: true,
        formatter: '{c}'
      }
    };

    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom', data: [`Rentabilidad ${participacionMostrar}`, 'Volatilidad'] },
      xAxis: {
        type: 'category',
        data: ['3 años', '2 años', '1 año', '6 meses', 'Último mes'],
        axisLabel: { interval: 0, fontSize: 12 },
      },
      yAxis: [
        { 
          type: 'value', 
          name: 'Rentabilidad (%)', 
          position: 'left', 
          axisLabel: { formatter: '{value}%' }, 
          axisLine: { show: false },
          splitLine: { show: false }
        },
        { 
          type: 'value', 
          name: 'Volatilidad', 
          position: 'right', 
          splitLine: { show: false }, 
          axisLine: { show: false } 
        }
      ],
      series: [...rentabilidadSeries, volatilidadSerie],
      grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
      color: ['#588bd2', '#ffbd59']
    };

    this.chartRentabilidadInstance.setOption(option);
    window.removeEventListener('resize', this.resizeRentabilidadHandler);
    window.addEventListener('resize', this.resizeRentabilidadHandler);
  }


  @ViewChild('chartInversiones') chartInversiones!: ElementRef;
  @ViewChild('chartDuracionesPlazo') chartDuracionesPlazo!: ElementRef;

  renderDuracionesChart() {
    if (!this.fondo?.plazo_duraciones || this.fondo.plazo_duraciones.length === 0) {
      return;
    }

    const container = this.chartDuracionesPlazo?.nativeElement;
    if (!container) {
      console.warn('Contenedor chartDuracionesPlazo no encontrado');
      return;
    }

    const existingChart = echarts.getInstanceByDom(container);
    if (existingChart) {
      existingChart.dispose();
    }

    const chart = echarts.init(container);
    this.charts.push(chart);

    const data = this.fondo.plazo_duraciones
      .filter(duracion => duracion.participacion > 0)
      .map(duracion => ({
        name: duracion.plazo,
        value: parseFloat((duracion.participacion * 100).toFixed(2))
      }));

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      series: [{
        name: 'Duraciones por plazo',
        type: 'pie',
        radius: '60%',
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
          formatter: '{b}\n{c}%'
        }
      }],
      color: ["#437ac6ff", "#588bd2", "#699be1ff", "#79aaefff", "#86b1edff", "#a0c5f8ff"]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());
  }

  renderInversionesChart() {
    if (!this.fondo?.principales_inversiones || this.fondo.principales_inversiones.length === 0) {
      return;
    }

    const container = this.chartInversiones?.nativeElement;
    if (!container) {
      return;
    }

    const inversiones = [...this.fondo.principales_inversiones]
      .sort((a, b) => b.participacion - a.participacion)
      .reverse();

    const existingChart = echarts.getInstanceByDom(container);
    if (existingChart) {
      existingChart.dispose();
    }

    const chart = echarts.init(container);
    this.charts.push(chart);

    const data = inversiones.map(inv => ({
      porcentaje: parseFloat((inv.participacion * 100).toFixed(2)),
      nombre: inv.emisor
    }));

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      yAxis: {
        type: 'category',
        data: inversiones.map(d => d.emisor),
        axisLabel: {
          fontSize: 12
        }
      },
      xAxis: {
        type: 'value',
        name: 'Participación (%)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: function (value) {
          return Math.ceil(value.max * 1.1);
        },
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        name: 'Inversiones',
        type: 'bar',
        data: inversiones.map(inv => {
          const valor = Number((inv.participacion * 100).toFixed(2));
          return valor;
        }),
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: '#588bd2'
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          fontSize: 12
        },
        barWidth: '50%'
      }],
      grid: {
        left: '0%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      }
    };

    chart.setOption(option);

    window.removeEventListener('resize', () => chart.resize());
    window.addEventListener('resize', () => chart.resize());
  }

  /*=====Driver JS - Tour de ayuda=====*/
  startTour() {
    this.driverObj.drive();
  }

  driverObj = driver({
    popoverClass: 'popover-owl',
    showProgress: true,
    allowClose: true,
    onDestroyed: () => {
      if (!localStorage.getItem('primeraVezTour')) {
        setTimeout(() => {
          this.mostrarMensajePostTour = true;
          localStorage.setItem('primeraVezTour', 'true');
        }, 500);
      }
    },
    steps: [
      {
        element: '#focus',
        popover: {
          title: 'Rendimiento',
          description: 'Cuanto ganas con tu inversion, ligado al tipo de participacion que tengas en el fondo',
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
          description: 'Comportamiento del fondo de inversión a lo largo del tiempo',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.principales-inversiones',
        popover: {
          title: 'Inversiones',
          description: 'Principales inversiones del fondo de inversión',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: ".duraciones-plazo",
        popover: {
          title: "Duraciones por Plazo",
          description: "Distribución del portafolio del fondo de inversión según los plazos de todas sus inversiones",
          side: "bottom",
          align: "center",
        }
      },
      {
        element: '.composiciones',
        popover: {
          title: 'Composiciones',
          description: 'Distribución del portafolio del fondo de inversión',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '#iconoPolitica',
        popover: {
          title: '¿Más dudas acerca del fondo?',
          description: 'Lee la descripcion oficial del gestor acerca de la politica de inversión del mismo.',
          side: 'bottom',
          align: 'center'
        }
      }
    ]
  });

  hasValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  }
  display(value: any): any {
    return this.hasValue(value) ? value : 'N/A';
  }
}