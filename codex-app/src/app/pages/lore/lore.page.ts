import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodexService, Story } from '../../services/codex.service';

@Component({
  standalone: false,
  selector: 'app-lore',
  templateUrl: './lore.page.html',
  styleUrls: ['./lore.page.scss'],
})
export class LorePage implements OnInit {
  historias$!: Observable<Story[]>;

  // Estado del modal
  selectedStory: Story | null = null;
  storyModalOpen = false;

  constructor(private codex: CodexService) {}

  ngOnInit() {
    this.historias$ = this.codex.getStories();
  }

  openStoryDetail(story: Story) {
    this.selectedStory = story;
    this.storyModalOpen = true;
  }

  closeStoryModal() {
    this.storyModalOpen = false;
    this.selectedStory = null;
  }
}
