import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(public http: HttpClient, private authService: AuthService) {}

  async registerEvent(eventData) {
    const auth = await this.authService.getAuthData();
    const url = '/event';
    const headers = new HttpHeaders({ 'x-access-token': auth.token });
    return this.http.post(url, eventData, { headers }).toPromise();
  }

  async getEvents() {
    const auth = await this.authService.getAuthData();
    const url = '/event';
    const headers = new HttpHeaders({ 'x-access-token': auth.token});
    return this.http.get(url, { headers }).toPromise();
  }

  async getEventById(eventId) {
    const auth = await this.authService.getAuthData();
    const url = '/event/' + eventId;
    const headers = new HttpHeaders({ 'x-access-token': auth.token});
    return this.http.get(url, { headers }).toPromise();
  }

  async schedule(eventId) {
    const auth = await this.authService.getAuthData();
    const url = '/schedule';
    const headers = new HttpHeaders({ 'x-access-token': auth.token});
    return this.http.post(url, { userId: auth.userId, eventId}, { headers }).toPromise();
  }

  async qrCodeScan(eventId, userId) {
    const auth = await this.authService.getAuthData();
    const url = '/qr';
    const headers = new HttpHeaders({ 'x-access-token': auth.token});
    return this.http.post(url, { eventId, userId }, { headers }).toPromise();
  }

}
