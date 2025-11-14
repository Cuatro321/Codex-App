import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'lore',
        loadChildren: () =>
          import('../pages/lore/lore.module').then(m => m.LorePageModule),
      },
      {
        path: 'personajes',
        loadChildren: () =>
          import('../pages/personajes/personajes.module').then(
            m => m.PersonajesPageModule,
          ),
      },
      {
        path: 'enemigos',
        loadChildren: () =>
          import('../pages/enemigos/enemigos.module').then(
            m => m.EnemigosPageModule,
          ),
      },
      {
        path: 'emblemas',
        loadChildren: () =>
          import('../pages/emblemas/emblemas.module').then(
            m => m.EmblemasPageModule,
          ),
      },
      {
        path: 'dominio',
        loadChildren: () =>
          import('../pages/dominio/dominio.module').then(
            m => m.DominioPageModule,
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../pages/perfil/perfil.module').then(
            m => m.PerfilPageModule,
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
