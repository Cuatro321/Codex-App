import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Enemy } from '../../services/codex.service';

@Component({
  standalone:false,
  selector: 'app-enemigos',
  templateUrl: './enemigos.page.html',
  styleUrls: ['./enemigos.page.scss'],
})
export class EnemigosPage implements OnInit {
  enemigos$!: Observable<Enemy[]>;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.enemigos$ = this.codex.getEnemies();
  }
}
