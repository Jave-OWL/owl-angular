import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./routes/landing/landing.component').then((m) => m.LandingComponent)
    },
    // General routes
    {
        path: 'auth/inicio-de-sesion',
        loadComponent: () => import('./features/auth/inicio-sesion/inicio-sesion.component').then((m) => m.InicioSesionComponent)
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
    {
        path: 'perfil-riesgo',
        loadComponent: () => import('./features/usuario/perfil-riesgo/perfil-riesgo.component').then((m) => m.PerfilRiesgoComponent)
    },
    {
        path: 'seleccion-tipo-inversion',
        loadComponent: () => import('./features/usuario/seleccion-tipo-inversion/seleccion-tipo-inversion.component').then((m) => m.SeleccionTipoInversionComponent)
    },
    {
        path: 'user/cuestionario',
        loadComponent: () => import('./features/usuario/cuestionario/cuestionario.component').then((m) => m.CuestionarioComponent)
    },
    // {
    // Admin Routes
];
