import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

import { AuthService } from '../../services/auth.service';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  standalone: false,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  // --- Auth ---
  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  user$: Observable<firebase.User | null>;
  loading = false;
  errorMessage = '';

  // --- Perfil / edición ---
  profile: UserProfile | null = null;
  profileLoading = false;
  profileSaveLoading = false;
  profileError = '';
  profileMessage = '';

  displayName = '';
  bio = '';
  city = '';
  country = '';

  // Avatar: guardamos solo un string (puede ser URL normal o data URL base64)
  avatarPreviewUrl: string | null = null;
  removeAvatar = false;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit(): void {
    // Cada vez que cambia el usuario, cargamos (o limpiamos) el perfil
    this.user$.subscribe((user: firebase.User | null) => {
      if (user) {
        this.loadProfile(user.uid);
      } else {
        this.profile = null;
        this.clearProfileForm();
      }
    });
  }

  // ====== PERFIL ======

  private clearProfileForm(): void {
    this.displayName = '';
    this.bio = '';
    this.city = '';
    this.country = '';
    this.avatarPreviewUrl = null;
    this.removeAvatar = false;
    this.profileMessage = '';
    this.profileError = '';
  }

  private loadProfile(uid: string): void {
    this.profileLoading = true;
    this.profileError = '';
    this.profileMessage = '';

    this.profileService.getUserProfile(uid).subscribe({
      next: (profile: UserProfile | null) => {
        this.profileLoading = false;
        this.profile = profile;

        if (profile) {
          this.displayName = profile.displayName || '';
          this.bio = profile.bio || '';
          this.city = profile.city || '';
          this.country = profile.country || '';
          this.avatarPreviewUrl = profile.avatarUrl || null;
        } else {
          this.clearProfileForm();
        }
      },
      error: (err: any) => {
        console.error('Error al cargar el perfil', err);
        this.profileLoading = false;
        this.profileError = 'No se pudo cargar tu perfil.';
      },
    });
  }

  async onSaveProfile(user: firebase.User | null): Promise<void> {
    if (!user) {
      return;
    }

    this.profileSaveLoading = true;
    this.profileError = '';
    this.profileMessage = '';

    try {
      // avatarPreviewUrl puede ser:
      // - null  → sin avatar
      // - string "data:image/png;base64,..." → imagen seleccionada
      // - o una URL normal si en el futuro decides usar CDN
      let avatarUrl = this.avatarPreviewUrl || '';

      if (this.removeAvatar) {
        avatarUrl = '';
      }

      await this.profileService.createOrUpdateProfile(user.uid, {
        displayName:
          this.displayName.trim() || user.email || 'Portador del Nexo',
        bio: this.bio.trim(),
        city: this.city.trim(),
        country: this.country.trim(),
        avatarUrl,
      });

      if (this.removeAvatar) {
        this.avatarPreviewUrl = null;
      }

      this.removeAvatar = false;
      this.profileSaveLoading = false;
      this.profileMessage = 'Perfil actualizado correctamente.';
    } catch (err: any) {
      console.error('Error al guardar el perfil', err);
      this.profileSaveLoading = false;
      this.profileError = 'No se pudo guardar tu perfil.';
    }
  }

  onResetProfile(user: firebase.User | null): void {
    if (user) {
      this.loadProfile(user.uid);
    } else {
      this.clearProfileForm();
    }
  }

  // Seleccionar avatar desde archivo local y convertirlo a data URL (base64)
  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Pequeña protección: no guardar imágenes enormes en Firestore
    const maxSize = 200 * 1024; // 200 KB aprox
    if (file.size > maxSize) {
      this.profileError =
        'La imagen es demasiado grande (máx. 200 KB). Elige una más pequeña.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // reader.result es "data:image/xxx;base64,AAAA..."
      this.avatarPreviewUrl = reader.result as string;
      this.removeAvatar = false;
      this.profileError = '';
    };
    reader.readAsDataURL(file);
  }

  // ====== AUTH (igual que antes) ======

  toggleMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  submit(): void {
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
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.message || 'Error de autenticación';
      },
    });
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
