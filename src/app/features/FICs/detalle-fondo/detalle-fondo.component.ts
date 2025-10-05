import { Component } from '@angular/core';
import { FICService } from '../../../core/services/fic.service';
import { FIC } from '../../../core/models/FIC.model';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChildren } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-detalle-fondo',
  imports: [],
  templateUrl: './detalle-fondo.component.html',
  styleUrl: './detalle-fondo.component.css'
})

export class DetalleFondoComponent {
  constructor(private ficService: FICService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.queryParam = params['id'];
    });
   }

  queryParam: string = '';
  id = 1;
  fondo?: FIC;
  composiciones?: any[];

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

  cargarComposiciones(){
      if (this.fondo) {
      this.composiciones = this.fondo.composiciones;
      console.log('Composiciones cargadas:', this.composiciones);
      this.renderPieCharts(); // Renderizar después de cargar los datos
    }
  }

  pieCharts: Chart[] = [];
  @ViewChildren('pieCanvas1') pieCanvas1!: ElementRef[];
  @ViewChildren('pieCanvas2') pieCanvas2!: ElementRef[];
  @ViewChildren('pieCanvas3') pieCanvas3!: ElementRef[];
  @ViewChildren('pieCanvas4') pieCanvas4!: ElementRef[];
  @ViewChildren('pieCanvas5') pieCanvas5!: ElementRef[];
  @ViewChildren('pieCanvas6') pieCanvas6!: ElementRef[];


  renderPieCharts() {
    this.pieCharts = [];
    
    if (!this.composiciones || this.composiciones.length === 0) {
      console.log('No hay composiciones disponibles');
      return;
    }

    console.log('Composiciones disponibles:', this.composiciones);

    // Mapeo de canvas a sus datos correspondientes
    const canvasConfigs = [
      { canvas: this.pieCanvas1, index: 0 },
      { canvas: this.pieCanvas2, index: 1 },
      { canvas: this.pieCanvas3, index: 2 },
      { canvas: this.pieCanvas4, index: 3 },
      { canvas: this.pieCanvas5, index: 4 },
      { canvas: this.pieCanvas6, index: 5 }
    ];

    canvasConfigs.forEach(config => {
      if (config.canvas) {
        config.canvas.forEach((canvasRef, i) => {
          const canvasElement = canvasRef.nativeElement;
          const composicion = this.composiciones?.[config.index];
          this.renderChart(canvasElement, config.index, composicion);
        });
      }
    });
  }

renderChart(canvasElement: HTMLCanvasElement, index: number, composicion?: any) {
  let data;
  let labels;

  console.log(`Renderizando gráfica ${index}:`, {
    composicion,
    tieneValores: composicion?.valoresComposiciones?.length > 0
  });

  if (composicion?.valoresComposiciones?.length > 0) {
    console.log(`Datos para gráfica ${index}:`, composicion.valoresComposiciones);
    labels = composicion.valoresComposiciones.map((v: any) => v.dato || 'Sin etiqueta');
    data = composicion.valoresComposiciones.map((v: any) => Number(v.valor) || 0);
  } else {
    data = this.generateRandomData();
    labels = this.generateRandomLabels();
  }

  if (this.pieCharts[index]) {
    this.pieCharts[index].destroy();
  }

  this.pieCharts[index] = new Chart(canvasElement, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: this.generateRandomColors(index)
      }]
    }
  });
}

  generateRandomData() {
    const data = [];
    for (let i = 0; i < 6; i++) {
      data.push(Math.floor(Math.random() * (30 - 1 + 1)) + 1);
    }
    return data;
  }

  generateRandomLabels() {
    const labels = [];
    for (let i = 0; i < 6; i++) {
      labels.push(`Elemento ${i + 1}`);
    }
    return labels;
  }


  generateRandomColors(index: number) {
    const count = 6;
    const colors = [];
    for (let i = 0; i < count; i++) {
      let color;
      if (index % 2 === 0) {
        const colors = ["#437ac6ff","#588bd2", "#699be1ff", "#79aaefff", "#86b1edff", "#a0c5f8ff", "#b6d0f6", "#c9d9f2ff"];
        color = colors[i % colors.length];
      } else {
        const colors = ["#ffbd59", "#f9c66fff", "#f7c06fff", "#f5b96fff", "#f3b26fff", "#f0a96fff"];
        color = colors[i % colors.length];
      }
      colors.push(color);
    }
    return colors;
  }

}


