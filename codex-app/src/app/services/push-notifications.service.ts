// src/app/services/push-notifications.service.ts
import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
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

  async init() {
    if (Capacitor.getPlatform() === 'web') {
      // En navegador no vamos a usar notificaciones push nativas
      return;
    }

    // 1) Permisos
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.log('Permiso de notificaciones NO concedido');
      return;
    }

    // 2) Registrar con FCM / APNS
    await PushNotifications.register();

    // 3) Escuchar token
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token push:', token.value);

      // Guardamos el token en Firestore (colección deviceTokens)
      const ref = doc(collection(this.db, 'deviceTokens'), token.value);
      await setDoc(
        ref,
        {
          token: token.value,
          platform: Capacitor.getPlatform(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Error registrando push', err);
    });

    // 4) Recibir notificaciones mientras la app está abierta (log opcional)
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Notificación recibida en foreground', notification);
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('Acción en notificación', action);
      },
    );
  }
}
