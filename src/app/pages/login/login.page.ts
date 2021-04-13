import { LoadingService } from './../../service/loading.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  userData: any = {
   email: 'patricia@mail.com',
   password: '123456'
  };
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  ngOnInit() {}

  register() {
    this.router.navigateByUrl('/register');
  }

  login() {
    if (this.userData.email === '' || this.userData.password === '') {
      return;
    }

    this.loading.present();
    this.authService.login(this.userData.email, this.userData.password).finally(() => this.loading.dismiss()).then(
      (response: any) => {
        // await this.authService.saveAuth(response);
        this.router.navigateByUrl('/home');
      }, error => {
        Swal.fire('Erro', 'Usuário e/ou senha inválidos', 'error');
      }
    );
  }
}
