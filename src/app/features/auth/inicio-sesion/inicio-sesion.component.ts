import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent implements OnInit, AfterViewInit {
  currentImageSrc: string = 'assets/images/OwlLlave.png';
  returnUrl: string = '/';

  formData = {
    correo: '',
    contrasena: ''
  };

  private formulario: HTMLElement | null = null;
  private exito: HTMLElement | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (this.returnUrl !== '/') {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.redirectToDashboard(user?.rol || 'usuario');
      }
    }
  }

  ngAfterViewInit() {
    this.formulario = document.querySelector('.contenido-form');
    this.exito = document.querySelector('.mensaje-confirmacion');
  }

  iniciarSesion(correo: string, contrasenia: string) {
    if (!correo || !contrasenia) {
      this.cambiarImagen('error');
      return;
    }

    this.authService.login(correo, contrasenia).subscribe({
      next: (response) => {
        this.cambiarImagen('exito');
        
        if (this.formulario && this.exito) {
          this.formulario.style.display = 'none';
          this.exito.style.display = 'flex';
        }
        
        setTimeout(() => {
          if (this.returnUrl !== '/') {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.redirectToDashboard(response.user.rol);
          }
        }, 2500);
      },
      error: (error) => {
        console.error('Error de inicio de sesión:', error);
        this.cambiarImagen('error');
      }
    });
  }

  private redirectToDashboard(rol: 'administrador' | 'usuario') {
    const route = rol === 'administrador' ? '/admin/dashboard' : '/user/dashboard';
    this.router.navigateByUrl(route);
  }

  cambiarImagen(estadoLogin: string) {
    let imagen = '';
    let imagenDefault = this.currentImageSrc;
    if (estadoLogin === 'exito') {
      console.log('exito');
      this.currentImageSrc = 'assets/images/OwlLlaveExito.png';
    }
    if (estadoLogin === 'error') {
      imagen = 'assets/images/OwlLlaveError.png';
      this.currentImageSrc = imagen;
      // Cambia la imagen a la imagen por defecto después de un delay
      const resetImage = () => {
        this.currentImageSrc = imagenDefault;
        document.removeEventListener('input', resetImage);
      };
      document.addEventListener('input', resetImage);
    }
  }
}
