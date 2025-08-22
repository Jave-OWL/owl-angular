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
      correo: 'correo@ejemplo.com',
      contrasena: '123456',
      nombreCompleto: 'ejemplo ejemplo',
    }
  ];

  administradores: Administrador[] = [
    {
      correo: 'admin@ejemplo.com',
      contrasena: '654321',
      nombreCompleto: 'admin admin',
    }
  ]

  constructor(private router: Router) {} 

  private usuarioEncontrado: Boolean = false;

  private formulario = document.querySelector('.contenido-form') as HTMLElement;
  private exito = document.querySelector('.mensaje-confirmacion') as HTMLElement;

  ngAfterViewInit() {
  this.formulario = document.querySelector('.contenido-form') as HTMLElement;
  this.exito = document.querySelector('.mensaje-confirmacion') as HTMLElement;
  }

  findusuario(correo: string, contrasena: string) {
    return this.usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    //Llamado a servicio cuando se implemente backend
    // return this.usuarioService.findUsuario(correo, contrasena);
  }

  findAdministrador(correo: string, contrasena: string) {
    return this.administradores.find(a => a.correo === correo && a.contrasena === contrasena);
    //Llamado a servicio cuando se implemente backend
    // return this.administradorService.findAdministrador(correo, contrasena);
  }

  ngOnInit() {
    
  }

  iniciarSesion(correo: string, contrasena: string) {
  const usuario = this.findusuario(correo, contrasena);
  const administrador = this.findAdministrador(correo, contrasena);

  if (usuario || administrador) {
    const rol = usuario ? 'usuario' : 'administrador';
    const ruta = usuario ? 'user/dashboard' : 'admin/dashboard';

    this.cambiarImagen('exito');
    localStorage.setItem('rol', rol);
    console.log('Rol guardado en localStorage:', localStorage.getItem('rol'));

    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 2500);

    if (usuario || administrador) {
      this.formulario.style.display = 'none';
      this.exito.style.display = 'flex';
      console.log('Formulario ocultado, mensaje de exito mostrado');
    }
  } else {
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
