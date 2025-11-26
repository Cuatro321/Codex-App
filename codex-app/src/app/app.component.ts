// src/app/app.component.ts
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, 
})
export class AppComponent {

  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home-outline' },
    { title: 'Lore', url: '/lore', icon: 'book-outline' },
    { title: 'Personajes', url: '/personajes', icon: 'person-outline' },
    { title: 'Enemigos', url: '/enemigos', icon: 'skull-outline' },
    { title: 'Emblemas', url: '/emblemas', icon: 'ribbon-outline' },
    { title: 'Dominios', url: '/dominio', icon: 'planet-outline' },
    { title: 'Noticias', url: '/noticias', icon: 'newspaper-outline' },
    { title: 'Comunidad', url: '/comunidad', icon: 'chatbubbles-outline' },
    { title: 'Perfil (login / registro)', url: '/perfil', icon: 'person-circle-outline' },
  ];

  constructor(private platform: Platform) {
    this.initializeApp();
  }

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
}
