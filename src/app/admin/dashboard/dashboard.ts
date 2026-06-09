import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/services/api.config';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user = this.authService.getUser();
  eventos: any[] = [];
  usuarios: any[] = [];
  inscripciones: any[] = [];
  loading = true;

  get totalEventos() { return this.eventos.length; }
  get totalUsuarios() { return this.usuarios.filter(u => u.rol === 'participante').length; }
  get totalInscripciones() { return this.inscripciones.length; }
  get eventoMasPopular() {
    if (!this.eventos.length) return null;
    return this.eventos.reduce((a, b) => a.inscritos > b.inscritos ? a : b);
  }
  get tasaOcupacion() {
    if (!this.eventos.length) return 0;
    const totalCapacidad = this.eventos.reduce((s, e) => s + e.capacidad, 0);
    const totalInscritos = this.eventos.reduce((s, e) => s + e.inscritos, 0);
    return totalCapacidad > 0 ? Math.round((totalInscritos / totalCapacidad) * 100) : 0;
  }
  get eventosConCupos() { return this.eventos.filter(e => e.cuposDisponibles > 0).length; }
  get eventosAgotados() { return this.eventos.filter(e => e.cuposDisponibles === 0).length; }

  ngOnInit() {
    Promise.all([
      this.http.get<any[]>(`${API_URL}/events?t=${Date.now()}`).toPromise(),
      this.http.get<any[]>(`${API_URL}/users`).toPromise(),
      this.http.get<any[]>(`${API_URL}/registrations?t=${Date.now()}`).toPromise(),
    ]).then(([eventos, usuarios, inscripciones]) => {
      this.eventos = eventos || [];
      this.usuarios = usuarios || [];
      this.inscripciones = inscripciones || [];
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(() => { this.loading = false; this.cdr.detectChanges(); });
  }

  irEventos() { this.router.navigate(['/events']); }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
