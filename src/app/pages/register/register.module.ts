import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/service/loading.service';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AppHeaderModule,
    RouterModule.forChild(routes)
  ],
  providers: [LoadingService],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
