import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

import { AuthService } from './services/auth.service';
import { PushNotificationsService } from './services/push-notifications.service';

interface MenuItem {
  icono: string;
  nombre: string;
  ruta: string;
  isProfile?: boolean;
}

interface MenuSection {
  titulo: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  // Título fijo para el header
  headerTitle = 'MENU';
  // Clase que define el color del header
  headerTheme = 'header-codex';

  // ===== Menú lateral =====
  public menu: MenuSection[] = [
    {
      titulo: 'PRINCIPAL',
      items: [
        { icono: 'home-outline', nombre: 'Inicio', ruta: '/inicio' },
      ],
    },
    {
      titulo: 'CÓDEX',
      items: [
        { icono: 'book-outline', nombre: 'Lore', ruta: '/lore' },
        { icono: 'people-outline', nombre: 'Personajes', ruta: '/personajes' },
        { icono: 'skull-outline', nombre: 'Enemigos', ruta: '/enemigos' },
        { icono: 'ribbon-outline', nombre: 'Emblemas', ruta: '/emblemas' },
        { icono: 'planet-outline', nombre: 'Dominios', ruta: '/dominio' },
      ],
    },
    {
      titulo: 'COMUNIDAD',
      items: [
      
        { icono: 'chatbubbles-outline', nombre: 'Comunidad', ruta: '/comunidad' },
        {
          icono: 'person-circle-outline',
          nombre: 'Perfil (login / registro)', // se actualiza según login
          ruta: '/perfil',
          isProfile: true,
        },
      ],
    },
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private auth: AuthService,
    private push: PushNotificationsService,
  ) {
    this.initializeApp();
    this.setupRouterListener();
    this.setupProfileLabel();
  }

  // ===== Inicialización general (StatusBar + Push) =====
  private async initializeApp() {
    await this.platform.ready();

    if (Capacitor.getPlatform() !== 'web') {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setBackgroundColor({ color: '#020617' });
        await StatusBar.setStyle({ style: Style.Light });
      } catch (err) {
        console.log('Error configurando StatusBar', err);
      }

      
    }
  }

  // ===== Cambiar color del header según la ruta =====
  private setupRouterListener() {
    this.router.events
      .pipe(filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd))
      .subscribe((ev) => {
        const url = ev.urlAfterRedirects || ev.url;
        this.updateHeaderForUrl(url);
      });
  }

  private updateHeaderForUrl(url: string) {
    const path = url.split('?')[0];

    if (path.startsWith('/inicio')) {
      this.headerTheme = 'header-principal';
    } else if (
      path.startsWith('/lore') ||
      path.startsWith('/personajes') ||
      path.startsWith('/enemigos') ||
      path.startsWith('/emblemas') ||
      path.startsWith('/dominio')
    ) {
      this.headerTheme = 'header-codex';
    } else if (
   
      path.startsWith('/comunidad')
    ) {
      this.headerTheme = 'header-comunidad';
    } else if (path.startsWith('/perfil')) {
      this.headerTheme = 'header-perfil';
    } else {
      // por defecto
      this.headerTheme = 'header-codex';
    }
  }

  // ===== Texto de "Perfil" según esté logueado o no =====
  private setupProfileLabel() {
    this.auth.user$.subscribe((user) => {
      const loggedIn = !!user;

      for (const section of this.menu) {
        const profileItem = section.items.find((i) => i.isProfile);
        if (profileItem) {
          profileItem.nombre = loggedIn ? 'Mi perfil' : 'Perfil (login / registro)';
        }
      }
    });
  }
}
