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
    {
        path: 'aprende',
        loadComponent: () => import('./routes/aprende/aprende.component').then((m) => m.AprendeComponent)
    },
    // User routes
    {
        path: 'explorar-fondos',
        loadComponent: () => import('./features/FICs/explorar-fondos/explorar-fondos.component').then((m) => m.ExplorarFondosComponent)
    },
    {
        path: 'detalle-fondo',
        loadComponent: () => import('./features/FICs/detalle-fondo/detalle-fondo.component').then((m) => m.DetalleFondoComponent)

    },
    {
        path: 'comparar-fondos',
        loadComponent: () => import('./features/FICs/comparador-fondos/comparador-fondos.component').then((m) => m.ComparadorFondosComponent)
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
    {
        path: 'user/dashboard',
        loadComponent: () => import('./features/usuario/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    },
    // {
    // Admin Routes
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./features/admin/dashboard-admin/dashboard-admin.component').then((m) => m.DashboardAdminComponent)
    },
        {
        path: '**',
        loadComponent: () => import('./routes/pagenotfound/pagenotfound.component').then((m) => m.PagenotfoundComponent)
    }
];
