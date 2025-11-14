import { Component, OnInit } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-lore',
  templateUrl: './lore.page.html',
  styleUrls: ['./lore.page.scss'],
})
export class LorePage implements OnInit {
  historias = [
    {
      titulo: 'La historia de la batalla de los guerreros',
      resumen:
        'Hace muchos años en estos territorios se llevó a cabo una gran batalla entre naciones donde solo una resultó vencedora.',
      imagen: 'assets/historias/historia-1.jpg',
    },
  ];

  dominios = [
    { nombre: 'Dominio del Tiempo' },
    { nombre: 'Pradera del Amanecer' },
    { nombre: 'Ciudad Abisal' },
  ];

  constructor() {}

  ngOnInit() {}
}
