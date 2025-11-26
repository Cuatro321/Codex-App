// src/app/services/codex.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../environments/environment';

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

/* ==========================
 * Helpers para URLs de media
 * ========================== */

const LOCAL_DJANGO_HOSTS = [
  'http://127.0.0.1:8000',
  'http://localhost:8000',
];

/**
 * Ajusta una URL de media para que apunte SIEMPRE
 * a tu dominio de PythonAnywhere.
 *
 * - data:image/... se deja igual.
 * - /media/... → https://elnexodelosecos.pythonanywhere.com/media/...
 * - http://127.0.0.1:8000/... → https://elnexodelosecos.pythonanywhere.com/...
 */
function normalizeMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // data URL (base64, etc): no tocamos
  if (url.startsWith('data:')) {
    return url;
  }

  const base = environment.backendBaseUrl.replace(/\/+$/, ''); // sin barra final

  // /media/...  →  https://elnexo.../media/...
  if (url.startsWith('/media/')) {
    return `${base}${url}`;
  }

  // http://127.0.0.1:8000/...  o  http://localhost:8000/...
  for (const host of LOCAL_DJANGO_HOSTS) {
    if (url.startsWith(host)) {
      return base + url.substring(host.length);
    }
  }

  // Ya es una URL http(s) con otro dominio (por ejemplo ya el correcto)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Cualquier otro caso raro (p.ej. 'media/imagen.png'): la tratamos como path relativa
  return `${base}/${url.replace(/^\/+/, '')}`;
}

/**
 * Recorre las propiedades de un documento Firestore y, si alguna
 * parece una URL de media (*.url, *imageUrl, *fileUrl, etc.), la normaliza.
 */
function normalizeMediaInDoc<T extends Record<string, any>>(doc: T): T {
  const copy: any = { ...doc };

  Object.keys(copy).forEach((key) => {
    const value = copy[key];
    if (typeof value === 'string') {
      const lower = key.toLowerCase();
      if (
        lower.endsWith('url') ||
        lower.endsWith('imageurl') ||
        lower.endsWith('fileurl')
      ) {
        copy[key] = normalizeMediaUrl(value);
      }
    }
  });

  return copy as T;
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
    if (!getApps().length) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }

    this.db = getFirestore(this.app);
  }

  private collection$<T extends Record<string, any>>(
    path: string,
    orderField?: string
  ): Observable<T[]> {
    const colRef = collection(this.db, path);
    const q = orderField ? query(colRef, orderBy(orderField, 'asc')) : colRef;

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((docSnap) => {
          const raw = docSnap.data() as T;
          const normalized = normalizeMediaInDoc(raw);
          return {
            id: docSnap.id,
            ...(normalized as T),
          } as T;
        })
      )
    );
  }

  getEmblems(): Observable<Emblem[]> {
    return this.collection$<Emblem>('emblems', 'name');
  }

  getCharacters(): Observable<Character[]> {
    return this.collection$<Character>('characters', 'name');
  }

  getAssets(): Observable<Asset[]> {
    return this.collection$<Asset>('assets', 'id');
  }

  getDomains(): Observable<Domain[]> {
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
