import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
//import swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private route: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let copia: HttpRequest<any>;
    if (req.url.startsWith('/')) {
      const autenticacao = req.headers.keys().includes('Authorization');

      // authData é o objeto localStorage de sessão 
      this.auth.authData.subscribe(data => {
        const authData = data; // quando recarrega a pagina isso aqui vem null

        if (autenticacao || !authData) {
          copia = req.clone({
            url: `${environment.url}${req.url}`
          });
        } else {
          
          copia = req.clone({
            url: `${environment.url}${req.url}`,
            headers: req.headers.append(
              'x-access-token',
              this.auth.token
            )
          });
        }
        copia.headers.append('X-Requested-With', 'XMLHttpRequest');
     });
    } else {
      copia = req.clone({});
    }

    return next.handle(copia).pipe(
      tap(
        () => {},
        (event: any) => {
          if (
            !this.route.url.includes('/home') &&
            event instanceof HttpErrorResponse &&
            event.status === 401
          ) {
            // this.auth.removeAuthData();
            console.log("deu ruim");
            // swal
            //   .fire({
            //     title: 'Sessão expirada',
            //     text: 'Sua sessão expirou. Logue novamente para continuar.',
            //     icon: 'warning',
            //     confirmButtonText: 'OK'
            //   })
            //   .then(() => this.route.navigate(['/home']));
          }
          return event;
        }
      )
    );
  }
}
