import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Emblem } from '../../services/codex.service';

@Component({
  standalone: false,
  selector: 'app-emblemas',
  templateUrl: './emblemas.page.html',
  styleUrls: ['./emblemas.page.scss'],
})
export class EmblemasPage implements OnInit {
  emblemas$!: Observable<Emblem[]>;

  // Estado del modal
  selectedEmblem: Emblem | null = null;
  emblemModalOpen = false;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.emblemas$ = this.codex.getEmblems();
  }

  openEmblemDetail(emblem: Emblem) {
    this.selectedEmblem = emblem;
    this.emblemModalOpen = true;
  }

  closeEmblemModal() {
    this.emblemModalOpen = false;
    this.selectedEmblem = null;
  }
}
