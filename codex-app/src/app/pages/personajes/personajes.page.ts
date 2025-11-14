import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Character } from '../../services/codex.service';

@Component({
  standalone: false,
  selector: 'app-personajes',
  templateUrl: './personajes.page.html',
  styleUrls: ['./personajes.page.scss'],
})
export class PersonajesPage implements OnInit {
  personajes$!: Observable<Character[]>;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.personajes$ = this.codex.getCharacters();
  }
}
