import { Component, OnInit } from '@angular/core';

interface Dominio {
  nombre: string;
  tipo: string;
  descripcion: string;
}

@Component({
  standalone:false,
  selector: 'app-dominio',
  templateUrl: './dominio.page.html',
  styleUrls: ['./dominio.page.scss'],
})
export class DominioPage implements OnInit {
  dominios: Dominio[] = [
    {
      nombre: 'Dominio del Tiempo',
      tipo: 'Temporal',
      descripcion: 'Relojes rotos flotan en el cielo. Cada paso altera segundos olvidados.',
    },
    {
      nombre: 'Pradera del Amanecer',
      tipo: 'Luz',
      descripcion:
        'Un amanecer permanente que oculta ecos de noches que ya no existen.',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
