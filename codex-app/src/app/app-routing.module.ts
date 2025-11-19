import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },

  // PRINCIPAL
  {
    path: 'inicio',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule),
  },


  {
    path: 'lore',
    loadChildren: () =>
      import('./pages/lore/lore.module').then(m => m.LorePageModule),
  },
  {
    path: 'personajes',
    loadChildren: () =>
      import('./pages/personajes/personajes.module').then(
        m => m.PersonajesPageModule,
      ),
  },
  {
    path: 'enemigos',
    loadChildren: () =>
      import('./pages/enemigos/enemigos.module').then(
        m => m.EnemigosPageModule,
      ),
  },
  {
    path: 'emblemas',
    loadChildren: () =>
      import('./pages/emblemas/emblemas.module').then(
        m => m.EmblemasPageModule,
      ),
  },
  {
    path: 'dominio',
    loadChildren: () =>
      import('./pages/dominio/dominio.module').then(m => m.DominioPageModule),
  },

  {
    path: 'noticias',
    loadChildren: () =>
      import('./pages/noticias/noticias.module').then(
        m => m.NoticiasPageModule,
      ),
  },
  {
    path: 'comunidad',
    loadChildren: () =>
      import('./pages/comunidad/comunidad.module').then(
        m => m.ComunidadPageModule,
      ),
  },

  // PERFIL (login / registro)
  {
    path: 'perfil',
    loadChildren: () =>
      import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
  },

 
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
