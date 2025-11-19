import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private collectionName = 'profiles';

  constructor(private afs: AngularFirestore) {}

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const doc: AngularFirestoreDocument<UserProfile> = this.afs.doc(
      `${this.collectionName}/${uid}`,
    );

    return doc
      .valueChanges()
      .pipe(map(profile => (profile ? { ...profile } : null)));
  }

  async createOrUpdateProfile(uid: string, data: Partial<UserProfile>) {
    const docRef = this.afs.doc<UserProfile>(`${this.collectionName}/${uid}`);
    const snap = await docRef.ref.get();

    if (!snap.exists) {
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
      return docRef.set(payload);
    } else {
      return docRef.update({
        ...data,
      } as any);
    }
  }
}
