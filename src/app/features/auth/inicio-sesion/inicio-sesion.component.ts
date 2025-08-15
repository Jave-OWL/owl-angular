import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent implements OnInit {
  currentImageSrc: string = 'assets/images/OwlLLave.png';

  formData = {
    correo: '',
    contrasena: ''
  };

  usuarios: Usuario[] = [
    {
      correo: 'correo@ejemplo.com',
      contrasena: '123456',
      nombreCompleto: 'ejemplo ejemplo'
    }
  ];
  
  ngOnInit() {
    
  }

  iniciarSesion(correo: string, contrasena: string) {
    const usuario = this.usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    if (usuario) {
      // Inicio de sesión exitoso
      console.log('Inicio de sesión exitoso');
      this.cambiarImagen('exito');
    } else {
      // Credenciales incorrectas
      console.log('Credenciales incorrectas');
      this.cambiarImagen('error');
    }
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
