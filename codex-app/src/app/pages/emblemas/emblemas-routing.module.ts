import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmblemasPage } from './emblemas.page';

const routes: Routes = [
  {
    path: '',
    component: EmblemasPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmblemasPageRoutingModule {}
