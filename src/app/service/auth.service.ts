import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authData: BehaviorSubject<any> | null = new BehaviorSubject(null); // prettier-ignore
  public readonly authData: Observable<any> = this._authData.asObservable(); // prettier-ignore
  campoControl: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public token;

  url = environment.url;

  constructor(public http: HttpClient, private storage: Storage) { }

  login(username, password) {
    const url = this.url + 'user/login';
    return this.http.post(url, { username, password });
  }

  register(registerData): Observable<any> {
    const url = this.url + 'user';
    return this.http.post(url, registerData);
  }

  async saveAuth(authData) {
    await this.storage.set('authData', authData);
  }

  async getAuthData() {
    return await this.storage.get('authData');
  }

  async deleteAuthData() {
    await this.storage.remove('authData');
  }

}
