import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilRiesgoComponent } from './perfil-riesgo/perfil-riesgo.component';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';
import { SeleccionTipoInversionComponent } from './seleccion-tipo-inversion/seleccion-tipo-inversion.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'perfil-riesgo', component: PerfilRiesgoComponent, canActivate: [authGuard] },
  { path: 'cuestionario', component: CuestionarioComponent, canActivate: [authGuard] },
  { path: 'seleccion-inversion', component: SeleccionTipoInversionComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }