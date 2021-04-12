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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl(''),
    },
    {
      validator: this.checkIfMatchingPasswords('password', 'confirmPassword')
    });
  }

  checkIfMatchingPasswords(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const passInput = group.controls[password],
      passCheckInput = group.controls[confirmPassword];
      if (passInput.value !== passCheckInput.value) {
        return passCheckInput.setErrors({ notEquivalent: true });
      } else if (passCheckInput.value === '' || passCheckInput.value == null) {
        return passCheckInput.setErrors({ required: true });
      } else {
        return passCheckInput.setErrors(null);
      }
    };
  }

  getErrorMessage(field) {
    return this.form.get(field).hasError('required')
      ? 'Campo requerido'
      : this.form.get(field).hasError('email')
      ? 'Email inválido'
      : this.form.get(field).hasError('minlength')
      ? 'A senha deve ter no mínimo 8 caracteres.'
      : this.form.get(field).hasError('notEquivalent')
      ? 'Senhas não coincidem'
      : '';
  }

  isValid(field) {
    if (
      this.form.get(field).value === '' ||
      this.form.get(field).value === null
    ) {
      return false;
    }
    return this.form.get(field).valid;
  }

  isInvalid(field) {
    return (
      !this.form.controls[field].valid &&
      (this.form.controls[field].touched)
    );
  }

  back() {
    this.router.navigateByUrl('/');
  }

  register() {
    const obj = this.form.value;
    delete obj.confirmPassword;
    console.log(obj);
    this.authService.register(obj).subscribe(
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
