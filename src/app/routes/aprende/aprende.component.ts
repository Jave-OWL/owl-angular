import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { last } from 'rxjs';

@Component({
  selector: 'app-aprende',
  imports: [],
  templateUrl: './aprende.component.html',
  styleUrl: './aprende.component.css'
})
export class AprendeComponent {

  nombreURL: string = 'Inicio';

  ngOnInit() {
    this.nombreURL = window.history.state?.url || 'inicio';
  }
  anterior(){
    if (window.history.length < 1) {
      window.location.href = '/';
    }
    else {
      window.history.back();
    }
  }
}
