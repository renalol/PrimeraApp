import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login.page';  // Asegúrate de importar correctamente el componente

const routes: Routes = [
  {
    path: '',
    component: LoginPage  // La ruta debería apuntar al componente LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
