import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  standalone:false,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';

  user$: Observable<firebase.User | null>;
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  toggleMode(mode: 'login' | 'register') {
    this.mode = mode;
    this.errorMessage = '';
  }

  submit() {
    this.errorMessage = '';
    this.loading = true;

    const obs =
      this.mode === 'login'
        ? this.auth.login(this.email, this.password)
        : this.auth.register(this.email, this.password);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Error de autenticación';
      },
    });
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
