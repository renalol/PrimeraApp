import { NgModule } from '@angular/core'; 
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',  // Asegura que redirige solo cuando no hay ningún path
  },
  {
    path: 'login',
    loadChildren: () => import('./Paginas/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./Paginas/inicio/inicio.module').then(m => m.InicioPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./Paginas/reset/reset.module').then(m => m.ResetPageModule)
  },
  {
    path: 'e404',
    loadChildren: () => import('./Paginas/e404/e404.module').then(m => m.E404PageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./Paginas/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./Paginas/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: '**',
    redirectTo: 'e404',  // Página 404 para rutas no encontradas
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
