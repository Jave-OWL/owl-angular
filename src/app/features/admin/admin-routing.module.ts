import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { FicsComponent } from './fics/fics.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardAdminComponent, 
    canActivate: [authGuard], 
    data: { requiresAdmin: true } 
  },
  { 
    path: 'fics', 
    component: FicsComponent, 
    canActivate: [authGuard], 
    data: { requiresAdmin: true } 
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent, 
    canActivate: [authGuard], 
    data: { requiresAdmin: true } 
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }