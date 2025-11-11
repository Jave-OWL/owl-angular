import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  mostrarPopupCerrarSesion = false;
  isCuestionario(): boolean {
    return this.router.url.startsWith('/user/cuestionario');
  }

  currentUser: Usuario | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((val) => {
          const cleanUrl = this.router.url.split('?')[0];
          if (cleanUrl === '/auth/inicio-de-sesion' || cleanUrl === '/auth/registro') {
        const HeaderElement = document.getElementById('header');
        if (HeaderElement) {
          HeaderElement.style.display = 'none';
        }
      } else {
        const HeaderElement = document.getElementById('header');
        if (HeaderElement) {
          HeaderElement.style.display = 'flex';
        }
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado && this.currentUser) {
      this.currentUser.nombre = nombreGuardado;
    }
  }

  dropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  }

  clickOutsideDropdown(event: Event) {
    const target = event.target as HTMLElement;
    const isDropdownElement = target.closest('.dropdown') !== null;
    const isDropdownMenuElement = target.closest('.dropdown-menu') !== null;
    if (!(isDropdownElement || isDropdownMenuElement)) {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        setTimeout(() => {
          dropdownMenu.classList.remove('show');
        }, 100);
      }
    }
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', this.clickOutsideDropdown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickOutsideDropdown.bind(this));
  }

  isAdmin(): boolean {
    return this.currentUser?.is_admin ?? false;
  }

  usuarioAuth(): boolean {
    return this.authService.isLoggedIn();
  }

  getNombreUsuario(): string {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      return nombreGuardado.charAt(0).toUpperCase() + nombreGuardado.slice(1);
    }
    const nombre = this.currentUser?.nombre || 'Usuario';
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  getInicialUsuario(): string {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      return nombreGuardado.charAt(0).toUpperCase();
    }
    return this.currentUser?.nombre?.charAt(0).toUpperCase() || 'U';
  }

  cerrarSesion() {
    this.mostrarPopupCerrarSesion = true;
  }

  confirmarCerrarSesion(confirmado: boolean) {
    this.mostrarPopupCerrarSesion = false;
    if (confirmado) {
      this.authService.logout();
      this.router.navigate(['/auth/inicio-de-sesion']);
    }
  }
}

