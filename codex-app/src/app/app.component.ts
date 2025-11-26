import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// ==== Interfaces para el menú lateral ====
interface MenuItem {
  icono: string;
  nombre: string;
  ruta: string;
}

interface MenuSection {
  titulo: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, // se mantiene como lo tenías
})
export class AppComponent {
  // ==== Estructura del menú que usa app.component.html ====
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
        { icono: 'newspaper-outline', nombre: 'Noticias', ruta: '/noticias' },
        { icono: 'chatbubbles-outline', nombre: 'Comunidad', ruta: '/comunidad' },
        {
          icono: 'person-circle-outline',
          nombre: 'Perfil (login / registro)',
          ruta: '/perfil',
        },
      ],
    },
  ];

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();

    // Configuración de la StatusBar SOLO en app nativa
    if (Capacitor.getPlatform() !== 'web') {
      try {
        // Que la webview no se meta debajo de la barra de estado
        await StatusBar.setOverlaysWebView({ overlay: false });

        // Color de fondo de la barra (oscuro como tu header)
        await StatusBar.setBackgroundColor({ color: '#020617' });

        // Iconos claros
        await StatusBar.setStyle({ style: Style.Light });
      } catch (err) {
        console.log('Error configurando StatusBar', err);
      }
    }
  }
}
