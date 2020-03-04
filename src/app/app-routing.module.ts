import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  { path: 'usuarios', loadChildren: './pages/usuarios/usuarios.module#UsuariosModule' },
  { path: 'empresas', loadChildren: './pages/empresas/empresas.module#EmpresasModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
