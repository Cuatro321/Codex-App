// src/app/services/codex.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../environments/environment';

// SDK Firebase Web (modular)
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

/* ==========
 * Interfaces
 * ========== */

// Lo que ya tenías
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

/* Nuevos tipos del Códex */

export interface Asset {
  id?: string | number;
  kind: 'image' | 'gif' | 'video' | string;
  caption?: string;
  fileUrl: string;
}

export interface Domain {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  color?: string;
  icon?: string;
  order?: number;
  coverImageUrl?: string;
  bannerImageUrl?: string;
  videoUrl?: string;
}

export interface Enemy {
  id?: string;
  name: string;
  slug: string;
  domainId?: string | null;
  description?: string;
  behavior?: string;
  spriteStillUrl?: string;
  spriteGifUrl?: string;
  imageFullUrl?: string;
  videoUrl?: string;
}

export interface Guide {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  domainId?: string | null;
  readTime?: number;
  coverImageUrl?: string;
  videoUrl?: string;
  tags?: string[];
}

export interface Story {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  domainId?: string | null;
  coverImageUrl?: string;
  videoUrl?: string;
  galleryAssetIds?: string[];
}

export interface Trap {
  id?: string;
  title: string;
  slug?: string;
  domainId?: string | null;
  description?: string;
  imageUrl?: string;
  gifUrl?: string;
}

/* ==========
 * Servicio
 * ========== */

@Injectable({
  providedIn: 'root',
})
export class CodexService {
  private app: FirebaseApp;
  private db: Firestore;

  constructor() {
    // REUTILIZAR app si ya existe (por AngularFire)
    if (!getApps().length) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }

    this.db = getFirestore(this.app);
  }

  /** Helper genérico para leer colecciones */
  private collection$<T>(path: string, orderField?: string): Observable<T[]> {
    const colRef = collection(this.db, path);
    const q = orderField ? query(colRef, orderBy(orderField, 'asc')) : colRef;

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        }))
      )
    );
  }

  // --- Lo que ya funcionaba ---

  getEmblems(): Observable<Emblem[]> {
    return this.collection$<Emblem>('emblems', 'name');
  }

  getCharacters(): Observable<Character[]> {
    return this.collection$<Character>('characters', 'name');
  }

  // --- Nuevas colecciones del Códex ---

  getAssets(): Observable<Asset[]> {
    return this.collection$<Asset>('assets', 'id');
  }

  getDomains(): Observable<Domain[]> {
    // ordenado por "order" como en el admin
    return this.collection$<Domain>('domains', 'order');
  }

  getEnemies(): Observable<Enemy[]> {
    return this.collection$<Enemy>('enemies', 'name');
  }

  getGuides(): Observable<Guide[]> {
    return this.collection$<Guide>('guides', 'title');
  }

  getStories(): Observable<Story[]> {
    return this.collection$<Story>('stories', 'title');
  }

  getTraps(): Observable<Trap[]> {
    return this.collection$<Trap>('traps', 'title');
  }
}
