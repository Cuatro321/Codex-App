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

  // Estado del modal
  selectedCharacter: Character | null = null;
  charModalOpen = false;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.personajes$ = this.codex.getCharacters();
  }

  // Abrir modal con personaje seleccionado
  openCharacterDetail(character: Character) {
    this.selectedCharacter = character;
    this.charModalOpen = true;
  }

  // Cerrar modal
  closeCharModal() {
    this.charModalOpen = false;
    this.selectedCharacter = null;
  }
}
