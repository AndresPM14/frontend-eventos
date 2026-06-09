import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  correo = '';
  password = '';
  loading = false;
  error = '';

  onLogin() {
    this.error = '';
    if (!this.correo.trim() || !this.password.trim()) {
      this.error = 'Por favor completa todos los campos';
      this.cdr.detectChanges();
      return;
    }
    this.loading = true;
    this.cdr.detectChanges();
    this.authService.login(this.correo, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/events']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Correo o contraseña incorrectos';
        this.cdr.detectChanges();
      }
    });
  }

  irRegistro() {
    this.router.navigate(['/register']);
  }
}
