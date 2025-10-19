import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: Usuario | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Suscribirse a los cambios de ruta para ocultar/mostrar el header
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((val) => {
      if (this.router.url === '/auth/inicio-de-sesion' || this.router.url === '/auth/registro') {
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

    // Suscribirse a los cambios del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
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
    return this.currentUser?.nombre || 'Usuario';
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

