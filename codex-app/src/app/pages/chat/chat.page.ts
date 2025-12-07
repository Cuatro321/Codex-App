import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';

import { AuthService } from '../../services/auth.service';
import { CommunityService } from '../../services/community.service';
import { NexoProfile, ChatMessage } from '../../models/community.models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit, OnDestroy {
  friendUid = '';
  currentUid: string | null = null;

  friendProfile: NexoProfile | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private community: CommunityService,
  ) {}

  ngOnInit(): void {
    // uid del amigo desde la ruta /chat/:uid
    this.friendUid = this.route.snapshot.paramMap.get('uid') || '';

    // Usuario actual
    const authSub = this.auth.user$.subscribe((user: firebase.User | null) => {
      this.currentUid = user?.uid || null;

      if (this.currentUid) {
        this.startChatStream();
      }
    });
    this.subs.push(authSub);

    // Perfil del amigo
    if (this.friendUid) {
      const profSub = this.community
        .getProfile(this.friendUid)
        .subscribe((p) => (this.friendProfile = p || null));
      this.subs.push(profSub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // ====== CHAT ======

  private startChatStream(): void {
    if (!this.currentUid || !this.friendUid) return;

    const chatSub = this.community
      .listenChat(this.currentUid, this.friendUid)
      .subscribe((msgs) => {
        this.messages = msgs;

        // scroll al final
        setTimeout(() => {
          const el = document.querySelector('.chat-messages') as HTMLElement | null;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }, 0);
      });

    this.subs.push(chatSub);
  }

  isMine(msg: ChatMessage): boolean {
    return msg.fromUid === this.currentUid;
  }

  async send(): Promise<void> {
    const text = this.newMessage.trim();
    if (!text || !this.currentUid || !this.friendUid) return;

    try {
      await this.community.sendChatMessage(this.currentUid, this.friendUid, text);
      this.newMessage = '';
    } catch (err) {
      console.error('Error enviando mensaje', err);
    }
  }

  // ====== ONLINE / OFFLINE ======

  isOnline(profile: NexoProfile | null | undefined): boolean {
    if (!profile || !profile.lastActive) return false;

    let last: Date;
    const la: any = profile.lastActive;

    if (la.toDate) {
      last = la.toDate();
    } else {
      last = new Date(la);
    }

    const diffMs = Date.now() - last.getTime();
    return diffMs < 2 * 60 * 1000; // menos de 2 minutos
  }
}
