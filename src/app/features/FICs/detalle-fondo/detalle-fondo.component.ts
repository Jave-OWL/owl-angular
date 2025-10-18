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
  mostrarPolitica: boolean = false; // Control para mostrar/ocultar la política de inversión

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
    this.verificarPrimeraVez();
    this.ficService.findById(this.queryParam ? +this.queryParam : this.id).subscribe(
      (data) => {
        this.fondo = data;
        this.fondo.nombre_fic = this.fondo.nombre_fic.replace(/FONDO DE INVERSIÓN COLECTIVA/gi, 'FIC');       
        console.log('Datos del fondo:', this.fondo);
        this.cargarLogo();
        this.cargarComposiciones();
        
        // Esperar a que la vista esté lista
        setTimeout(() => {
          if (this.viewReady) {
            this.renderPieCharts();
            // Renderizar los gráficos
            console.log('Intentando renderizar gráficos desde ngOnInit');
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
      console.log('Intentando renderizar gráfico de inversiones desde ngAfterViewInit');
      this.renderInversionesChart();
      this.renderDuracionesChart();
    }
  }
  closeWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const closeButton = document.getElementById('closeButton');
    const owl = document.getElementById('OwlAyuda90');
    if (welcomeScreen && closeButton && owl) {
      welcomeScreen.style.display = 'none';
      owl.classList.toggle('hide');
    }
  }
    verificarPrimeraVez() {
      localStorage.setItem('primeraVisita', 'false');
      console.log('Verificando primera vez...');

      const yaVisito = localStorage.getItem('primeraVisita');

      if (!yaVisito) {
        // Primera vez que visita
        this.mostrarBienvenida = true;
        // Marcar que ya visitó (permanentemente)
        localStorage.setItem('primeraVisita', 'true');
      }
  }

  cerrarBienvenida() {
    //this.mostrarBienvenida = false;
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
      this.participaciones.push('Promedio');
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
  participacionSeleccionada: string = '';
  seleccionarPart(participacion: string){
    console.log(participacion);
    this.participacionSeleccionada = participacion;
    
    if(participacion === 'Mostrar todos' && this.fondo){
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas;
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas;
      this.cargarInformacionGeneral();
    } else if(participacion === 'Promedio' && this.fondo) {
      // Calcular el promedio de todas las participaciones
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
      this.rentabilidadGeneral = parseFloat((promedios.ultimo_mes * 100).toFixed(2));
    } else if(this.fondo) { 
      this.rentabilidadesHistoricasFiltradas = this.fondo.rentabilidad_historicas.filter(item => item.tipo_de_participacion === participacion);
      this.volatilidadesHistoricasFiltradas = this.fondo.volatilidad_historicas.filter(item => item.tipo_de_participacion === participacion);
      
      // Actualizar datos para la participación seleccionada
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
  // Verificar si existe una instancia de la gráfica
  if (this.chartRentabilidadInstance) {
    // Remover el listener de resize si existe
    window.removeEventListener('resize', this.resizeRentabilidadHandler);
    
    // Destruir la instancia de echarts
    this.chartRentabilidadInstance.dispose();
    
    // Limpiar la referencia
    this.chartRentabilidadInstance = undefined;
    
    // Opcional: Limpiar el contenedor HTML
    const container = this.chartRentabilidad?.nativeElement;
    if (container) {
      container.innerHTML = '';
    }
    
    console.log('Gráfica de rentabilidad destruida correctamente');
  }
  }

  private resizeRentabilidadHandler = () => {
    if (this.chartRentabilidadInstance) {
      this.chartRentabilidadInstance.resize();
    }
  };

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

    // Destruir instancia anterior si existe
    if (this.chartRentabilidadInstance) {
      this.chartRentabilidadInstance.dispose();
    }

    // Crear nueva instancia
    this.chartRentabilidadInstance = echarts.init(container);

    const periodos = [
      'ultimo_3_anios',
      'ultimo_2_anios',
      'ultimo_anio',
      'ultimo_6_meses',
      'ultimo_mes'
    ];

    // --- 1. Usar la participación seleccionada o encontrar la que tiene menor rentabilidad ---
    let participacionMostrar = this.participacionSeleccionada;
    if (!participacionMostrar || participacionMostrar === 'Mostrar todos') {
      let valorMenor = Number.MAX_VALUE;
      Object.keys(this.rentabilidadesHistoricas).forEach(tipo => {
        const r = this.rentabilidadesHistoricas?.[tipo][0]?.ultimo_mes;
        if (r !== undefined && r < valorMenor) {
          valorMenor = r;
          participacionMostrar = tipo;
        }
      });
    }

    if (!participacionMostrar) return;

    // --- 2. Rentabilidad de la participación ---
    const rentabilidadData = periodos.map(clave => 
      parseFloat((this.rentabilidadesHistoricas![participacionMostrar][0][clave as keyof Historico]).toFixed(2))
    );

    const rentabilidadSeries: echarts.EChartsOption['series'] = [
      {
        name: `Rentabilidad ${participacionMostrar}`,
        type: 'bar',
        data: rentabilidadData,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: '#588bd2'
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ];

    // --- 3. Volatilidad correspondiente ---
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
      /*title: {
        text: 'Rentabilidad vs Volatilidad',
        left: 'center',
        textStyle: { 
          fontSize: 16,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold'
        }
      },*/
      tooltip: { 
        trigger: 'item'
      },
      legend: { 
        top: 'bottom',
        data: [`Rentabilidad ${participacionMostrar}`, 'Volatilidad']
      },
      xAxis: { 
        type: 'category', 
        data: ['3 años', '2 años', '1 año', '6 meses', 'Último mes'],
        axisLabel: {
          interval: 0,
          fontSize: 12
        }
      },
      yAxis: [
        { 
          type: 'value', 
          name: 'Rentabilidad (%)', 
          position: 'left',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        { 
          type: 'value', 
          name: 'Volatilidad', 
          position: 'right',
          splitLine: {
            show: false
          }
        }
      ],
      series: [...rentabilidadSeries, volatilidadSerie],
      grid: { 
        left: '5%', 
        right: '5%', 
        bottom: '10%', 
        top: '15%',
        containLabel: true
      },
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
      console.log('No hay datos suficientes para el gráfico de duraciones por plazo');
      return;
    }

    const container = this.chartDuracionesPlazo?.nativeElement;
    if (!container) {
      console.warn('Contenedor chartDuracionesPlazo no encontrado');
      return;
    }

    // Destruir gráfico anterior si existe
    const existingChart = echarts.getInstanceByDom(container);
    if (existingChart) {
      existingChart.dispose();
    }

    const chart = echarts.init(container);
    this.charts.push(chart);

    const data = this.fondo.plazo_duraciones.map(duracion => ({
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
        radius: '70%',
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

    // Manejar el resize
    window.addEventListener('resize', () => chart.resize());
  }

  renderInversionesChart() {
    console.log('Datos completos del fondo:', this.fondo);
    console.log('Principales inversiones:', this.fondo?.principales_inversiones);
    
    if (!this.fondo?.principales_inversiones || this.fondo.principales_inversiones.length === 0) {
      console.log('No hay datos suficientes para el gráfico de inversiones');
      return;
    }

    const container = this.chartInversiones?.nativeElement;
    if (!container) {
      console.warn('Contenedor chartInversiones no encontrado');
      return;
    }

    // Ordenar inversiones de mayor a menor y limitar a las 10 principales
    const inversiones = [...this.fondo.principales_inversiones]
      .sort((a, b) => b.participacion - a.participacion)
      .reverse(); // Revertimos el orden para que aparezca de mayor a menor en el gráfico vertical

    console.log('Inversiones procesadas:', inversiones);

    // Destruir gráfico anterior si existe
    const existingChart = echarts.getInstanceByDom(container);
    if (existingChart) {
      existingChart.dispose();
    }

    const chart = echarts.init(container);
    this.charts.push(chart);

    // Preparar datos para el gráfico
    const data = inversiones.map(inv => ({
      porcentaje: parseFloat((inv.participacion * 100).toFixed(2)), // Asegurar 2 decimales
      nombre: inv.emisor
    }));

    const option: echarts.EChartsOption = {
      /*title: {
        text: 'Principales Inversiones',
        left: '20%',
        textStyle: { 
          fontSize: 16,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold'
        }
      },*/
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
        max: function(value) {
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
        containLabel: true// Esto permite que el gráfico se alinee naturalmente a la izquierda
      }
    };

    chart.setOption(option);

    // Limpiar el listener anterior si existe
    window.removeEventListener('resize', () => chart.resize());
    // Agregar nuevo listener
    window.addEventListener('resize', () => chart.resize());
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
        description: 'Comportamiento del fondo de inversión',
        side: 'bottom',
        align: 'center'
      }
    }
  ]});
}