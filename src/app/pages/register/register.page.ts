import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2'
import { LoadingService } from 'src/app/service/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  form: FormGroup;

  // registerData: any = {
  //   name: '',
  //   email: '',
  //   password: '',
  //   cpf: '',
  //   birthday: '',
  //   address: '',
  //   number: '',
  //   complement: '',
  //   city: '',
  //   zip: '',
  //   school: '',
  //   course: '',
  //   schoolCode: '',
  //   semester: '',
  //   teacher: false,
  //   events: [],
  //   hours: 0
  // };

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      cpf: new FormControl(''),
      birthday: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      number: new FormControl(''),
      complement: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      zip: new FormControl(''),
      school: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
      schoolCode: new FormControl('', [Validators.required]),
      semester: new FormControl('', [Validators.required]),
      teacher: new FormControl(false),
      events: new FormControl([]),
      hours: new FormControl(0)
    });
  }

  back() {
    this.router.navigateByUrl('/');
  }

  register() {
    this.authService.register(this.form.value).subscribe(
      (response) => {
        Swal.fire({
          title: 'Sucesso',
          text: 'Usuário cadastrado com sucesso. Faça login para continuar',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigateByUrl('/');
        });
      }, error => {
        console.log(error);
      }
    );
  }
}
