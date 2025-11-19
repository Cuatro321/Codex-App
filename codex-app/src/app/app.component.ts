import { Component } from '@angular/core';

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
  standalone: false,
})
export class AppComponent {

  menu: MenuSection[] = [
    {
      titulo: 'Principal',
      items: [
        {
          icono: 'home-outline',
          nombre: 'Inicio',
          ruta: '/inicio',
        },
      ],
    },
    {
      titulo: 'Códex',
      items: [
        {
          icono: 'book-outline',
          nombre: 'Lore',
          ruta: '/lore',
        },
        {
          icono: 'body-outline',
          nombre: 'Personajes',
          ruta: '/personajes',
        },
        {
          icono: 'skull-outline',
          nombre: 'Enemigos',
          ruta: '/enemigos',
        },
        {
          icono: 'ribbon-outline',
          nombre: 'Emblemas',
          ruta: '/emblemas',
        },
        {
          icono: 'planet-outline',
          nombre: 'Dominios',
          ruta: '/dominio',
        },
      ],
    },
    {
      titulo: 'Comunidad',
      items: [
        {
          icono: 'newspaper-outline',
          nombre: 'Noticias',
          ruta: '/noticias',
        },
        {
          icono: 'people-outline',
          nombre: 'Comunidad',
          ruta: '/comunidad',
        },
        {
          icono: 'person-circle-outline',
          nombre: 'Perfil (login / registro)',
          ruta: '/perfil',
        },
      ],
    },
  ];

  constructor() {}
}
