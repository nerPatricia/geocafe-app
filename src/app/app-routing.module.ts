import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'home',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'relatorio',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
