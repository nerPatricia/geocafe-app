import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  url = environment.url;

  constructor(public http: HttpClient, private authService: AuthService) {}

  getPixelTragectory(lat, lon) {
    const url = this.url + 'map/history/point?lat=' + lat + '&lon=' + lon;
    return this.http.get(url).toPromise();
  }
}
