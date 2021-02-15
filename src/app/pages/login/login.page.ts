import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  userData: any = {
   email: 'teste@teste',
   password: '123456'
  };
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  register() {
    this.router.navigateByUrl('/register');
  }

  login() {
    this.router.navigateByUrl('/home');
    // this.authService.login(this.userData.email, this.userData.password).subscribe(
    //  async (response: any) => {
    //     await this.authService.saveAuth(response);
    //     if (response.teacher === true) {
    //       this.router.navigateByUrl('/home-organizer');
    //     } else {
    //       this.router.navigateByUrl('/home');
    //     }
    //   }, error => {
    //     console.log(error);
    //   }
    // )
  }
}
