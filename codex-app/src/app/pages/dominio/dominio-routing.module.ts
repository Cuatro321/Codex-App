import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DominioPage } from './dominio.page';

const routes: Routes = [
  {
    path: '',
    component: DominioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DominioPageRoutingModule {}
