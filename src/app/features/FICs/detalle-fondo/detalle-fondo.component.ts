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
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    ); 
  }
}
