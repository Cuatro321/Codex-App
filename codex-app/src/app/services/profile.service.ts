import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../environments/environment';

import {
  initializeApp,
  getApp,
  getApps,
  FirebaseApp,
} from 'firebase/app';

import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  bio?: string;
  city?: string;
  country?: string;
  createdAt: any;
  avatarUrl?: string;

  isStaff?: boolean;
  isSuperuser?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private app: FirebaseApp;
  private db: Firestore;
  private collectionName = 'profiles';

  constructor() {
    // Igual que en CodexService: reutilizamos la app de Firebase
    if (!getApps().length) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApp();
    }

    this.db = getFirestore(this.app);
  }

  // Leer perfil una vez desde Firestore
  getUserProfile(uid: string): Observable<UserProfile | null> {
    const ref = doc(this.db, `${this.collectionName}/${uid}`);

    return from(getDoc(ref)).pipe(
      map(snap => {
        if (!snap.exists()) {
          return null;
        }
        const data = snap.data() as Omit<UserProfile, 'uid'>;
        return { uid: snap.id, ...data };
      }),
    );
  }

  // Crear o actualizar perfil
  async createOrUpdateProfile(
    uid: string,
    data: Partial<UserProfile>,
  ): Promise<void> {
    const ref = doc(this.db, `${this.collectionName}/${uid}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const payload: UserProfile = {
        uid,
        displayName: data.displayName || data.username || 'Portador del Nexo',
        username: data.username || `portador_${uid.slice(0, 6)}`,
        bio: data.bio || '',
        city: data.city || '',
        country: data.country || '',
        avatarUrl: data.avatarUrl || '',
        createdAt: new Date(),
        isStaff: data.isStaff ?? false,
        isSuperuser: data.isSuperuser ?? false,
        isActive: data.isActive ?? true,
      };

      await setDoc(ref, payload);
    } else {
      const updatePayload: Partial<UserProfile> = {
        ...data,
      };

      await updateDoc(ref, updatePayload as any);
    }
  }
}
