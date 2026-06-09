import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList implements OnInit {
  private eventsService = inject(EventsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  events: any[] = [];
  registrations: any[] = [];
  loading = true;
  mensaje = '';
  mensajeError = '';
  isAdmin = this.authService.isAdmin();
  user = this.authService.getUser();

  showModal = false;
  editingEvent: any = null;
  form = { titulo: '', descripcion: '', fecha: '', ubicacion: '', capacidad: 1 };

  ngOnInit() {
    this.loading = true;
    this.eventsService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('getEvents error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.eventsService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  estaInscrito(eventId: number): boolean {
    return this.registrations.some(r => r.event.id === eventId && r.user.id === this.user?.sub);
  }

  getRegistrationId(eventId: number): number {
    const r = this.registrations.find(r => r.event.id === eventId && r.user.id === this.user?.sub);
    return r?.id;
  }

  inscribirse(eventId: number) {
    this.eventsService.inscribirse(this.user?.sub, eventId).subscribe({
      next: () => { this.mostrarMensaje('✅ Inscripción exitosa'); this.ngOnInit(); },
      error: () => this.mostrarError('Error al inscribirse')
    });
  }

  cancelarInscripcion(eventId: number) {
    const id = this.getRegistrationId(eventId);
    if (!id) return;
    this.eventsService.cancelarInscripcion(id).subscribe({
      next: () => { this.mostrarMensaje('✅ Inscripción cancelada'); this.ngOnInit(); },
      error: () => this.mostrarError('Error al cancelar')
    });
  }

  abrirCrear() {
    this.editingEvent = null;
    this.form = { titulo: '', descripcion: '', fecha: '', ubicacion: '', capacidad: 1 };
    this.showModal = true;
  }

  abrirEditar(event: any) {
    this.editingEvent = event;
    this.form = {
      titulo: event.titulo, descripcion: event.descripcion,
      fecha: event.fecha, ubicacion: event.ubicacion, capacidad: event.capacidad
    };
    this.showModal = true;
  }

  guardar() {
    if (this.editingEvent) {
      this.eventsService.updateEvent(this.editingEvent.id, this.form).subscribe({
        next: () => { this.showModal = false; this.mostrarMensaje('✅ Evento actualizado'); this.ngOnInit(); },
        error: () => this.mostrarError('Error al actualizar')
      });
    } else {
      this.eventsService.createEvent(this.form).subscribe({
        next: () => { this.showModal = false; this.mostrarMensaje('✅ Evento creado'); this.ngOnInit(); },
        error: () => this.mostrarError('Error al crear evento')
      });
    }
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este evento?')) return;
    this.eventsService.deleteEvent(id).subscribe({
      next: () => { this.mostrarMensaje('✅ Evento eliminado'); this.ngOnInit(); },
      error: () => this.mostrarError('Error al eliminar')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  mostrarMensaje(msg: string) {
    this.mensaje = msg; this.cdr.detectChanges();
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
  }

  mostrarError(msg: string) {
    this.mensajeError = msg; this.cdr.detectChanges();
    setTimeout(() => { this.mensajeError = ''; this.cdr.detectChanges(); }, 3000);
  }
}
