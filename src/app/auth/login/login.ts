import { Component, inject } from '@angular/core';
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
  correo = '';
  password = '';
  loading = false;
  error = '';

  onLogin() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.correo, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/events']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Correo o contraseña incorrectos';
      }
    });
  }

  irRegistro() {
    this.router.navigate(['/register']);
  }
}
