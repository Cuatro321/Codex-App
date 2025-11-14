import { Component, OnInit } from '@angular/core';

interface Enemigo {
  nombre: string;
  tipo: string;
  dominio: string;
  resumen: string;
}

@Component({
  standalone:false,
  selector: 'app-enemigos',
  templateUrl: './enemigos.page.html',
  styleUrls: ['./enemigos.page.scss'],
})
export class EnemigosPage implements OnInit {
  enemigos: Enemigo[] = [
    {
      nombre: 'Ecos Sombríos',
      tipo: 'Espectros',
      dominio: 'Ciudad Abisal',
      resumen:
        'Fragmentos de memorias que tomaron forma física y cazan a quienes intentan alterar el ciclo.',
    },
    {
      nombre: 'Centinelas del Reloj',
      tipo: 'Guardianes',
      dominio: 'Dominio del Tiempo',
      resumen:
        'Autómatas que ajustan el tiempo de los portadores para mantener el Nexo en equilibrio.',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
