// src/app/pages/comunidad/comunidad.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CommunityService } from '../../services/community.service';
import { NexoProfile, Friendship } from '../../models/community.models';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  standalone: false,
})
export class ComunidadPage implements OnInit, OnDestroy {
  segment: 'members' | 'friends' | 'requests' = 'members';

  currentUid: string | null = null;

  // Perfiles
  private allProfiles: NexoProfile[] = [];
  private profilesByUid: { [uid: string]: NexoProfile } = {};

  members: NexoProfile[] = [];

  // Amistades / solicitudes
  friends: Friendship[] = [];
  incomingRequests: Friendship[] = [];
  outgoingRequests: Friendship[] = [];

  private friendUids = new Set<string>();
  private pendingUids = new Set<string>();

  // UI
  sendingRequestTo: { [uid: string]: boolean } = {};
  isProfileModalOpen = false;
  selectedProfile: NexoProfile | null = null;

  private subs: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private community: CommunityService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    // Perfiles (todos)
    const profilesSub = this.community
      .getAllProfiles()
      .subscribe((profiles) => {
        this.allProfiles = profiles;
        this.buildProfilesIndex();
        this.refreshMembersList();
      });
    this.subs.push(profilesSub);

    // Usuario actual
    const authSub = this.auth.user$.subscribe((user: any) => {
      const prevUid = this.currentUid;
      this.currentUid = user?.uid || null;

      this.refreshMembersList();

      if (this.currentUid && this.currentUid !== prevUid) {
        this.loadFriendshipData(this.currentUid);
      }

      if (!this.currentUid) {
        this.friends = [];
        this.incomingRequests = [];
        this.outgoingRequests = [];
        this.friendUids.clear();
        this.pendingUids.clear();
      }
    });
    this.subs.push(authSub);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  // ====== Perfiles / miembros ======

  private buildProfilesIndex() {
    this.profilesByUid = {};
    for (const p of this.allProfiles) {
      if (p.uid) {
        this.profilesByUid[p.uid] = p;
      }
    }
  }

  private refreshMembersList() {
    // Si no hay sesión, muestro todos
    if (!this.currentUid) {
      this.members = [...this.allProfiles];
      return;
    }

    // Con sesión: oculto yo mismo y mis amigos
    this.members = this.allProfiles.filter((p) => {
      const uid = p.uid;
      if (!uid) return false;
      if (uid === this.currentUid) return false;
      if (this.friendUids.has(uid)) return false;
      return true;
    });
  }

  getProfileByUid(uid: string): NexoProfile | undefined {
    return this.profilesByUid[uid];
  }

  // ====== Amistades / solicitudes ======

  private loadFriendshipData(uid: string) {
    const fSub = this.community.getFriends(uid).subscribe((friends) => {
      this.friends = friends;
      this.updateRelationSets();
    });
    this.subs.push(fSub);

    const inSub = this.community
      .getIncomingRequests(uid)
      .subscribe((reqs) => {
        this.incomingRequests = reqs;
        this.updateRelationSets();
      });
    this.subs.push(inSub);

    const outSub = this.community
      .getOutgoingRequests(uid)
      .subscribe((reqs) => {
        this.outgoingRequests = reqs;
        this.updateRelationSets();
      });
    this.subs.push(outSub);
  }

  private updateRelationSets() {
    this.friendUids.clear();
    this.pendingUids.clear();

    for (const f of this.friends) {
      const otherUid = this.getOtherUid(f);
      if (otherUid) this.friendUids.add(otherUid);
    }

    for (const r of this.incomingRequests) {
      this.pendingUids.add(r.fromUid);
    }
    for (const r of this.outgoingRequests) {
      this.pendingUids.add(r.toUid);
    }

    // Actualizar miembros al cambiar amigos / solicitudes
    this.refreshMembersList();
  }

  private getOtherUid(friendship: Friendship): string | null {
    if (!this.currentUid) return null;
    return friendship.participants.find((u) => u !== this.currentUid) || null;
  }

  getOtherProfile(friendship: Friendship): NexoProfile | undefined {
    const uid = this.getOtherUid(friendship);
    return uid ? this.getProfileByUid(uid) : undefined;
  }

  canSendRequest(profile: NexoProfile): boolean {
    if (!this.currentUid || !profile.uid) return false;
    if (profile.uid === this.currentUid) return false;
    if (this.friendUids.has(profile.uid)) return false;
    if (this.pendingUids.has(profile.uid)) return false;
    return true;
  }

  async sendRequest(profile: NexoProfile, ev?: Event) {
    ev?.stopPropagation();

    if (!this.currentUid || !profile.uid || !this.canSendRequest(profile)) {
      return;
    }

    try {
      this.sendingRequestTo[profile.uid] = true;
      await this.community.sendFriendRequest(this.currentUid, profile.uid);
      await this.showToast('Solicitud enviada');
    } catch (err) {
      console.error(err);
      await this.showToast('No se pudo enviar la solicitud');
    } finally {
      this.sendingRequestTo[profile.uid] = false;
    }
  }

  async acceptRequest(request: Friendship) {
    if (!request.id) return;
    try {
      await this.community.acceptRequest(request.id);
      await this.showToast('Solicitud aceptada');
    } catch (err) {
      console.error(err);
      await this.showToast('No se pudo aceptar la solicitud');
    }
  }

  async rejectRequest(request: Friendship) {
    if (!request.id) return;
    try {
      await this.community.rejectRequest(request.id);
      await this.showToast('Solicitud rechazada');
    } catch (err) {
      console.error(err);
      await this.showToast('No se pudo rechazar la solicitud');
    }
  }

  async removeFriend(friendship: Friendship, ev?: Event) {
    ev?.stopPropagation();
    if (!friendship.id) return;

    try {
      await this.community.removeFriendship(friendship.id);
      await this.showToast('Amigo eliminado');
    } catch (err) {
      console.error(err);
      await this.showToast('No se pudo eliminar al amigo');
    }
  }

  async confirmRemoveFriend(friendship: Friendship, ev?: Event) {
    ev?.stopPropagation();
    const other = this.getOtherProfile(friendship);
    const name =
      other?.displayName || other?.username || 'este guardián del Nexo';

    const alert = await this.alertCtrl.create({
      header: 'Eliminar amigo',
      message: `¿Seguro que quieres eliminar a "${name}" de tus amigos del Nexo?`,
      cssClass: 'nexo-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.removeFriend(friendship);
          },
        },
      ],
    });

    await alert.present();
  }

  // ====== Perfil / modal ======

  openProfile(profile: NexoProfile, ev?: Event) {
    ev?.stopPropagation();
    this.openProfileModal(profile);
  }

  openProfileModal(profile: NexoProfile) {
    this.selectedProfile = profile;
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
    this.selectedProfile = null;
  }

  // Chat privado desde la lista de amigos
  openChatWithProfile(profile: NexoProfile, ev?: Event) {
    ev?.stopPropagation();
    if (!profile.uid) return;

    this.isProfileModalOpen = false;
    this.selectedProfile = null;

    this.navCtrl.navigateForward(`/chat/${profile.uid}`);
  }

  // ====== Util ======

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  isOnline(profile?: NexoProfile): boolean {
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
