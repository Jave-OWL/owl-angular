import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilRiesgoComponent } from './perfil-riesgo/perfil-riesgo.component';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';
import { SeleccionTipoInversionComponent } from './seleccion-tipo-inversion/seleccion-tipo-inversion.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'perfil-riesgo', component: PerfilRiesgoComponent },
  { path: 'cuestionario', component: CuestionarioComponent },
  { path: 'seleccion-inversion', component: SeleccionTipoInversionComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }