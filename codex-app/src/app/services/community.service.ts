// src/app/services/community.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';

import { NexoProfile, Friendship, ChatMessage } from '../models/community.models';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  // Instancia de Firestore (usa la app por defecto ya inicializada)
  private db = getFirestore();

  constructor() {}

  // ========= HELPERS =========

  private collectionRef(path: string): CollectionReference<DocumentData> {
    return collection(this.db, path);
  }

  private fromQuery<T>(q: any, idField: string): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot: any) => {
          const data = snapshot.docs.map((d: any) => ({
            [idField]: d.id,
            ...(d.data() as any),
          })) as T[];
          subscriber.next(data);
        },
        (error: any) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  // ========= PERFILES =========

  getAllProfiles(): Observable<NexoProfile[]> {
    const ref = this.collectionRef('profiles');
    const q = query(ref);
    return this.fromQuery<NexoProfile>(q, 'uid');
  }

  getProfile(uid: string): Observable<NexoProfile | undefined> {
    return new Observable<NexoProfile | undefined>((subscriber) => {
      const ref = doc(this.db, 'profiles', uid);
      const unsubscribe = onSnapshot(
        ref,
        (snap: any) => {
          if (!snap.exists()) {
            subscriber.next(undefined);
          } else {
            subscriber.next({
              uid: snap.id,
              ...(snap.data() as any),
            } as NexoProfile);
          }
        },
        (error: any) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  // ========= AMISTADES =========

  getFriends(uid: string): Observable<Friendship[]> {
    const ref = this.collectionRef('friendships');
    const q = query(
      ref,
      where('participants', 'array-contains', uid),
      where('status', '==', 'accepted'),
    );
    return this.fromQuery<Friendship>(q, 'id');
  }

  getIncomingRequests(uid: string): Observable<Friendship[]> {
    const ref = this.collectionRef('friendships');
    const q = query(
      ref,
      where('toUid', '==', uid),
      where('status', '==', 'pending'),
    );
    return this.fromQuery<Friendship>(q, 'id');
  }

  getOutgoingRequests(uid: string): Observable<Friendship[]> {
    const ref = this.collectionRef('friendships');
    const q = query(
      ref,
      where('fromUid', '==', uid),
      where('status', '==', 'pending'),
    );
    return this.fromQuery<Friendship>(q, 'id');
  }

  async sendFriendRequest(fromUid: string, toUid: string): Promise<void> {
    const participants = [fromUid, toUid].sort();
    const data: Friendship = {
      participants,
      fromUid,
      toUid,
      status: 'pending',
      createdAt: new Date(),
    };
    await addDoc(this.collectionRef('friendships'), data as any);
  }

  async acceptRequest(requestId: string): Promise<void> {
    const ref = doc(this.db, 'friendships', requestId);
    await updateDoc(ref, { status: 'accepted' });
  }

  async rejectRequest(requestId: string): Promise<void> {
    const ref = doc(this.db, 'friendships', requestId);
    await updateDoc(ref, { status: 'rejected' });
  }

  async removeFriendship(requestId: string): Promise<void> {
    const ref = doc(this.db, 'friendships', requestId);
    await deleteDoc(ref);
  }

  // ========= CHAT =========

  private getChatId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join('_');
  }

  listenChat(uid1: string, uid2: string): Observable<ChatMessage[]> {
    const chatId = this.getChatId(uid1, uid2);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const ref = this.collectionRef(`chats/${chatId}/messages`);
    const q = query(
      ref,
      where('createdAt', '>=', twentyFourHoursAgo),
      orderBy('createdAt', 'asc'),
    );
    return this.fromQuery<ChatMessage>(q, 'id');
  }

  async sendChatMessage(fromUid: string, toUid: string, text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    const chatId = this.getChatId(fromUid, toUid);

    // Actualizamos/creamos documento del chat
    const chatRef = doc(this.db, 'chats', chatId);
    await setDoc(
      chatRef,
      {
        participants: [fromUid, toUid].sort(),
        updatedAt: new Date(),
      },
      { merge: true },
    );

    // Añadimos mensaje a la subcolección
    const msgRef = this.collectionRef(`chats/${chatId}/messages`);
    await addDoc(msgRef, {
      chatId,
      fromUid,
      toUid,
      text: trimmed,
      createdAt: new Date(),
    } as any);
  }
}
