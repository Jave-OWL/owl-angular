import { Component } from '@angular/core';
import { FICService } from '../../../core/services/fic.service';
import { FIC } from '../../../core/models/FIC.model';
import { ActivatedRoute } from '@angular/router';

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

  ngOnInit(): void {
    this.ficService.findById(this.queryParam ? +this.queryParam : this.id).subscribe(
      (data) => {
        this.fondo = data;
        console.log(this.fondo);
        console.log("nombre" + this.fondo?.nombre);
        this.cargarLogo();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    ); 
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
}
