import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  url = environment.url;

  constructor(public http: HttpClient, private authService: AuthService) {}

  saveField(fieldData) {
    const url = this.url + 'field';
    return this.http.post(url, fieldData).toPromise();
  }

  getAllFieldsByUser(userId) {
    const url = this.url + 'field/?user_id=' + userId;
    return this.http.get(url).toPromise();
  }

  getFieldById(fieldId) {
    fieldId = '606d1823bbf87d520d62e21a';
    const url = this.url + 'field/' + fieldId;
    return this.http.get(url).toPromise();
  }

  getFieldTiff(fieldId) {
    fieldId = '606d1823bbf87d520d62e21a';
    const url = this.url + 'field/cut/' + fieldId + '?date=05_05_2021';
    return this.http.get(url).toPromise();
  }
}
