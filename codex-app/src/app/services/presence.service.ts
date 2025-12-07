// src/app/services/presence.service.ts
import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private db = getFirestore();
  private timerId: any;

  constructor() {}

  start(uid: string) {
    this.stop();

    const profileRef = doc(this.db, 'profiles', uid);

    const updateLastActive = () => {
      setDoc(
        profileRef,
        { lastActive: new Date() },
        { merge: true },
      );
    };

    updateLastActive();
    this.timerId = setInterval(updateLastActive, 30000); // cada 30s
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
