import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../core/models/usuario.model';
import { Administrador } from '../../../core/models/administrador.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent implements OnInit {
  currentImageSrc: string = 'assets/images/OwlLlave.png';

  formData = {
    correo: '',
    contrasena: ''
  };

  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'ejemplo',
      correo: 'correo@ejemplo.com',
      contrasenia: '123456',
      rol: 'usuario'
    },
    {
      id: 2,
      nombre: 'admin',
      correo: 'admin@ejemplo.com',
      contrasenia: '654321',
      rol: 'administrador'
    }
  ];

  constructor(private router: Router) {} 

  findusuario(correo: string, contrasenia: string) {
    return this.usuarios.find(u => u.correo === correo && u.contrasenia === contrasenia);
    //Llamado a servicio cuando se implemente backend
    // return this.usuarioService.findUsuario(correo, contrasenia);
  }

  ngOnInit() {
    
  }

  iniciarSesion(correo: string, contrasenia: string) {
    const usuario = this.findusuario(correo, contrasenia);

    if (usuario?.rol === 'usuario') {
      console.log('Usuario encontrado');
      this.cambiarImagen('exito');
      setTimeout(() => {
        console.log('Timeout');
        const successImg = document.querySelector('.exito') as HTMLImageElement;
        
        localStorage.setItem('rol', 'usuario');
        console.log('Rol guardado en localStorage:', localStorage.getItem('rol'));
        this.router.navigate(['user/dashboard']);
      }, 2500);
    }
    else if (usuario?.rol === 'administrador') {
      console.log('Administrador encontrado');
      this.cambiarImagen('exito');
      setTimeout(() => {
        console.log('Timeout');
        const successImg = document.querySelector('.exito') as HTMLImageElement;
        
        localStorage.setItem('rol', 'administrador');
        console.log('Rol guardado en localStorage:', localStorage.getItem('rol'));
        this.router.navigate(['admin/dashboard']);
      }, 2500);
    }
    else {
      console.log('Usuario o administrador no encontrado');
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
