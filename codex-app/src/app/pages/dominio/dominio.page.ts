import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Domain } from '../../services/codex.service';

@Component({
  standalone:false,
  selector: 'app-dominio',
  templateUrl: './dominio.page.html',
  styleUrls: ['./dominio.page.scss'],
})
export class DominioPage implements OnInit {
  dominios$!: Observable<Domain[]>;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.dominios$ = this.codex.getDomains();
  }
}
