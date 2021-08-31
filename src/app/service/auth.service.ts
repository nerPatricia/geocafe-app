import { FieldService } from './field.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authData: BehaviorSubject<any> | null = new BehaviorSubject(null); // prettier-ignore
  public readonly authData: Observable<any> = this._authData.asObservable(); // prettier-ignore
  campoControl: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public token;

  url = environment.url;

  constructor(
    public http: HttpClient,
    private storage: Storage
  ) {}

  login(username, password) {
    const url = this.url + 'user/login';
    return this.http.post(url, { username, password }).toPromise();
  }

  register(registerData) {
    const url = this.url + 'user';
    return this.http.post(url, registerData).toPromise();
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

  async setAuthDataObservable() {
    const authData = await this.getAuthData();
    this._authData.next(authData);
  }
}
