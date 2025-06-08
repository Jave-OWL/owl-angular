import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./routes/landing/landing.component').then((m) => m.LandingComponent)
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./routes/auth/login/login.component').then((m) => m.LoginComponent)
    },
    {
        path: 'auth/sign-up',
        loadComponent: () => import('./routes/auth/sign-up/sign-up.component').then((m) => m.SignUpComponent)
    }
];
