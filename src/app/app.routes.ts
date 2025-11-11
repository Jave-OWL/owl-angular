import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Rutas públicas
    {
        path: '',
        loadComponent: () => import('./routes/landing/landing.component').then((m) => m.LandingComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'inicio-de-sesion',
                loadComponent: () => import('./features/auth/inicio-sesion/inicio-sesion.component').then((m) => m.InicioSesionComponent)
            },
            {
                path: 'registro',
                loadComponent: () => import('./features/auth/registro/registro.component').then((m) => m.RegistroComponent)
            }
        ]
    },
    {
        path: 'aprende',
        loadComponent: () => import('./routes/aprende/aprende.component').then((m) => m.AprendeComponent)
    },
    {
        path: 'fics',
        loadChildren: () => import('./features/FICs/fics-routing.module').then(m => m.FicsRoutingModule)
    },
    {
        path: 'user',
        loadChildren: () => import('./features/usuario/usuarios-routing.module').then(m => m.UsuariosRoutingModule),
        canActivate: [authGuard],
        data: { role: 'usuario' }
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin-routing.module').then(m => m.AdminRoutingModule),
        canActivate: [authGuard],
        data: { requiresAdmin: true }
    },
    // Not found 404
    {
        path: '**',
        loadComponent: () => import('./routes/pagenotfound/pagenotfound.component').then((m) => m.PagenotfoundComponent)
    }
];
