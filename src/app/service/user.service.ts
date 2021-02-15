import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public http: HttpClient, private authService: AuthService) {}

  async getUserInfo() {
    const auth = await this.authService.getAuthData();
    const url = '/user/' + auth.userId;
    const headers = new HttpHeaders({ 'x-access-token': auth.token});
    return this.http.get(url, { headers }).toPromise();
  }

}
