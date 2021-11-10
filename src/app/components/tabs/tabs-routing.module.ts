import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'campos',
        loadChildren: () => import('../../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'notas',
        loadChildren: () => import('../../pages/notes/notes.module').then(m => m.NotesPageModule)
      },
      {
        path: 'relatorios',
        loadChildren: () => import('../../pages/report/report.module').then(m => m.ReportPageModule)
      },
      {
        path: 'ajustes',
        loadChildren: () => import('../../pages/options/options.module').then(m => m.OptionsPageModule)
      },
      {
        path: 'field-note',
        loadChildren: () => import('../../pages/field-note/field-note.module').then(m => m.FieldNotePageModule)
      },
      {
        path: 'home',
        redirectTo: '/home/tabs/campos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/campos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
