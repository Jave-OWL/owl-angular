import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ExplorarFondosComponent } from './explorar-fondos/explorar-fondos.component';
import { DetalleFondoComponent } from './detalle-fondo/detalle-fondo.component';
import { ComparadorFondosComponent } from './comparador-fondos/comparador-fondos.component';
import { FondosGuardadosComponent } from './fondos-guardados/fondos-guardados.component';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  { path: 'explorar', component: ExplorarFondosComponent },
  { path: 'detalle', component: DetalleFondoComponent },
  { path: 'comparar', component: ComparadorFondosComponent },
  { 
    path: 'guardados', 
    component: FondosGuardadosComponent,
    canActivate: [authGuard]
  },
  { path: 'ranking', component: RankingComponent },
  { path: '', redirectTo: 'explorar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicsRoutingModule { }