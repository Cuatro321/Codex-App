import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Emblem } from '../../services/codex.service';
import firebase from 'firebase/compat/app';

@Component({
  standalone: false,
  selector: 'app-emblemas',
  templateUrl: './emblemas.page.html',
  styleUrls: ['./emblemas.page.scss'],
})
export class EmblemasPage implements OnInit {
  emblemas$!: Observable<Emblem[]>;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.emblemas$ = this.codex.getEmblems();
  }
}
