import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-sesion',
  imports: [],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent implements OnInit {
  currentImageSrc: string = 'assets/images/OwlCandado2.png';

  ngOnInit() {
    this.startBlinking();
  }

  startBlinking() {
    
  }
}
