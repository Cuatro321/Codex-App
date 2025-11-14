// src/app/services/codex.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../environments/environment';

// SDK de Firebase
import {
  initializeApp,
  getApp,
  getApps,
  FirebaseApp,
} from 'firebase/app';

import {
  getFirestore,
  Firestore,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

export interface Emblem {
  id?: string;
  name: string;
  slug: string;
  quote?: string;
  rarity?: string;
  usage?: string;
  epoch?: string;
  domainId?: string | null;
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
  description?: string;
}

export interface Character {
  id?: string;
  name: string;
  slug: string;
  role?: string;
  domainId?: string | null;
  description?: string;
  playable?: boolean;
  imageUrl?: string;
  gifUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CodexService {
  private app: FirebaseApp;
  private db: Firestore;

  constructor() {
    // Reutilizamos la app de Firebase si ya existe (por AngularFireAuth, por ejemplo)
    if (!getApps().length) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }

    this.db = getFirestore(this.app);
  }

  getEmblems(): Observable<Emblem[]> {
    const colRef = collection(this.db, 'emblems');
    const q = query(colRef, orderBy('name', 'asc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Emblem),
        }))
      )
    );
  }

  getCharacters(): Observable<Character[]> {
    const colRef = collection(this.db, 'characters');
    const q = query(colRef, orderBy('name', 'asc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Character),
        }))
      )
    );
  }
}
