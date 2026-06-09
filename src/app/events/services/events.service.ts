import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../core/services/api.config';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private authHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    });
  }

  private noCache() {
    return new HttpHeaders({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    });
  }

  getEvents() {
    return this.http.get<any[]>(`${API_URL}/events?t=${Date.now()}`, { headers: this.noCache() });
  }

  getRegistrations() {
    return this.http.get<any[]>(`${API_URL}/registrations?t=${Date.now()}`, { headers: this.noCache() });
  }

  createEvent(data: any) {
    return this.http.post(`${API_URL}/events`, data, { headers: this.authHeaders() });
  }

  updateEvent(id: number, data: any) {
    return this.http.patch(`${API_URL}/events/${id}`, data, { headers: this.authHeaders() });
  }

  deleteEvent(id: number) {
    return this.http.delete(`${API_URL}/events/${id}`, { headers: this.authHeaders() });
  }

  inscribirse(userId: number, eventId: number) {
    return this.http.post(`${API_URL}/registrations`, { userId, eventId });
  }

  cancelarInscripcion(id: number) {
    return this.http.delete(`${API_URL}/registrations/${id}`);
  }
}
