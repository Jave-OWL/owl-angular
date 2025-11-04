import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ExplorarFondosComponent } from './explorar-fondos/explorar-fondos.component';
import { DetalleFondoComponent } from './detalle-fondo/detalle-fondo.component';
import { CompararFondosComponent } from './comparar-fondos/comparar-fondos.component';
import { PronosticarInversionComponent } from './pronosticar-inversion/pronosticar-inversion.component';

const routes: Routes = [
  { path: 'explorar', component: ExplorarFondosComponent, canActivate: [authGuard] },
  { path: 'detalle', component: DetalleFondoComponent, canActivate: [authGuard] },
  { path: 'comparar', component: CompararFondosComponent, canActivate: [authGuard] },
  { path: 'pronosticar', component: PronosticarInversionComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'explorar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicsRoutingModule { }