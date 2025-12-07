import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Enemy } from '../../services/codex.service';

@Component({
  standalone: false,
  selector: 'app-enemigos',
  templateUrl: './enemigos.page.html',
  styleUrls: ['./enemigos.page.scss'],
})
export class EnemigosPage implements OnInit {
  enemigos$!: Observable<Enemy[]>;

  // Estado del modal
  selectedEnemy: Enemy | null = null;
  enemyModalOpen = false;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.enemigos$ = this.codex.getEnemies();
  }

  // Abrir modal con los detalles del enemigo
  openEnemyDetail(enemy: Enemy) {
    this.selectedEnemy = enemy;
    this.enemyModalOpen = true;
  }

  // Cerrar modal
  closeEnemyModal() {
    this.enemyModalOpen = false;
    this.selectedEnemy = null;
  }
}
