import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Story, Domain } from '../../services/codex.service';

@Component({
  standalone:false,
  selector: 'app-lore',
  templateUrl: './lore.page.html',
  styleUrls: ['./lore.page.scss'],
})
export class LorePage implements OnInit {
  historias$!: Observable<Story[]>;
  dominios$!: Observable<Domain[]>;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.historias$ = this.codex.getStories();
    this.dominios$ = this.codex.getDomains();
  }
}
