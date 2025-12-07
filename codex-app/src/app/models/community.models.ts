// src/app/models/community.models.ts

export interface NexoProfile {
  uid: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
  isStaff?: boolean;
  isSuperuser?: boolean;
  lastActive?: any; // Firestore Timestamp o Date
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

export interface Friendship {
  id?: string;
  participants: string[]; // [uid1, uid2] ordenados alfabéticamente
  fromUid: string;
  toUid: string;
  status: FriendshipStatus;
  createdAt?: any;
}

export interface ChatMessage {
  id?: string;
  chatId: string;
  fromUid: string;
  toUid: string;
  text: string;
  createdAt?: any;
}
