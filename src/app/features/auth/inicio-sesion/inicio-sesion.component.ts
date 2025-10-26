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
  currentImageSrc: string = 'assets/images/OwlLlave.webp';
  returnUrl: string = '/';
  errorMessage: string = '';
  showError: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;

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
        this.redirectToDashboard(user?.is_admin || false);
      }
    }
  }

  ngAfterViewInit() {
    this.formulario = document.querySelector('.contenido-form');
    this.exito = document.querySelector('.mensaje-confirmacion');
  }

  iniciarSesion(correo: string, contrasenia: string) {
    if (!correo || !contrasenia) {
      this.mostrarError('Por favor, completa todos los campos');
      this.emailError = !correo;
      this.passwordError = !contrasenia;
      this.cambiarImagen('error');
      return;
    }

    this.authService.login(correo, contrasenia).subscribe({
      next: (response: any) => {
        console.log('Response from login:', response);
        this.limpiarError();
        this.cambiarImagen('exito');
        
        if (this.formulario && this.exito) {
          this.formulario.style.display = 'none';
          this.exito.style.display = 'flex';
        }
        
        setTimeout(() => {
          if (this.returnUrl !== '/') {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            // Asumiendo que el usuario viene directamente en la respuesta
            const user = response.user ?? response;
            this.redirectToDashboard(user.is_admin ?? false);
          }
        }, 2500);
      },
      error: (error) => {
        console.error('Error de inicio de sesión:', error);
        let mensajeError = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
        
        if (error.status === 403) {
          mensajeError = 'Correo o contraseña incorrectos.';
        } else if (error.status === 401) {
          mensajeError = 'Correo o contraseña incorrectos.';
        } else if (error.status === 404) {
          mensajeError = 'Servicio no disponible. Intenta más tarde.';
        } else if (error.status === 500) {
          mensajeError = 'Error en el servidor. Intenta más tarde.';
        } else if (error.status === 0) {
          mensajeError = 'No se puede conectar con el servidor. Verifica tu conexión.';
        } else if (error.error?.message && typeof error.error.message === 'string') {
         
          const serverMessage = error.error.message;
          if (!serverMessage.includes('Http failure') && !serverMessage.includes('localhost')) {
            mensajeError = serverMessage;
          }
        }
        
        this.emailError = true;
        this.passwordError = true;
        
        this.mostrarError(mensajeError);
        this.cambiarImagen('error');
      }
    });
  }

  private redirectToDashboard(isAdmin: boolean) {
    const route = isAdmin ? '/admin/dashboard' : '/user/dashboard';
    this.router.navigateByUrl(route);
  }

  cambiarImagen(estadoLogin: string) {
    let imagen = '';
    let imagenDefault = 'assets/images/OwlLlave.webp';
    if (estadoLogin === 'exito') {
      console.log('exito');
      this.currentImageSrc = 'assets/images/OwlLlaveExito.webp';
    }
    if (estadoLogin === 'error') {
      imagen = 'assets/images/OwlLlaveError.webp';
      this.currentImageSrc = imagen;
      // Cambia la imagen a la imagen por defecto después de un delay
      const resetImage = () => {
        this.currentImageSrc = imagenDefault;
        this.limpiarError();
        document.removeEventListener('input', resetImage);
      };
      document.addEventListener('input', resetImage);
    }
  }

  mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.showError = true;
  }

  limpiarError() {
    this.errorMessage = '';
    this.showError = false;
    this.emailError = false;
    this.passwordError = false;
  }

  onEmailInput() {
    this.emailError = false;
    if (!this.passwordError) {
      this.limpiarError();
    }
  }

  onPasswordInput() {
    this.passwordError = false;
    if (!this.emailError) {
      this.limpiarError();
    }
  }
}
