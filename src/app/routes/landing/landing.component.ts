import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SplashScreenComponent } from '../../shared/components/splash-screen/splash-screen.component';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, CommonModule],//, SplashScreenComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  showSplash: boolean = false; // Cambiar a true para activar
  showContent: boolean = true;  // Cambiar a false para activar

  ngOnInit(): void {
    /*
    setTimeout(() => {
      this.showSplash = false;
    }, 2000);
    
    setTimeout(() => {
      this.showContent = true;
      document.body.classList.add('loaded');
    }, 2300);*/
  }
}
