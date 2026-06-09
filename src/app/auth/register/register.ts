import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/services/api.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  nombre = '';
  correo = '';
  password = '';
  confirmar = '';
  loading = false;
  errores: any = {};

  validar(): boolean {
    this.errores = {};
    if (!this.nombre.trim()) this.errores.nombre = 'El nombre es obligatorio';
    if (!this.correo.trim()) this.errores.correo = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) this.errores.correo = 'Ingresa un correo válido';
    if (!this.password) this.errores.password = 'La contraseña es obligatoria';
    else if (this.password.length < 6) this.errores.password = 'Mínimo 6 caracteres';
    if (!this.confirmar) this.errores.confirmar = 'Confirma tu contraseña';
    else if (this.password !== this.confirmar) this.errores.confirmar = 'Las contraseñas no coinciden';
    return Object.keys(this.errores).length === 0;
  }

  onRegister() {
    if (!this.validar()) return;
    this.loading = true;
    this.http.post(`${API_URL}/users`, {
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
      rol: 'participante'
    }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/login']); },
      error: () => { this.loading = false; this.errores.general = 'Error al registrarse. El correo puede ya estar en uso.'; }
    });
  }

  irLogin() { this.router.navigate(['/login']); }
}
