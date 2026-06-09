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
  error = '';

  onRegister() {
    if (this.password !== this.confirmar) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.post(`${API_URL}/users`, {
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
      rol: 'participante'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al registrarse. El correo puede ya estar en uso.';
      }
    });
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}
