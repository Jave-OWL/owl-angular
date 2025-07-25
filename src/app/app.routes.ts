import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./routes/landing/landing.component').then((m) => m.LandingComponent)
    },
    // General routes
    {
        path: 'auth/login',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
    },
    {
        path: 'auth/registro',
        loadComponent: () => import('./features/auth/registro/registro.component').then((m) => m.RegistroComponent)
    },
    // User routes
    {
        path: 'explorar-fondos',
        loadComponent: () => import('./features/FICs/explorar-fondos/explorar-fondos.component').then((m) => m.ExplorarFondosComponent)
    },
    // Admin Routes
];
