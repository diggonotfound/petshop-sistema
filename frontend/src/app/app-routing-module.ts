import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clientes } from './pages/clientes/clientes';

const routes: Routes = [

  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },

  {
    path: 'dashboard', component: Dashboard
  },
  {
  path: 'clientes',
  component: Clientes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
