import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  private initialized = false;

  constructor() {}

  /**
   * Inicialización de notificaciones push.
   *
   * IMPORTANTE:
   * De momento está DESACTIVADA en Android porque Firebase nativo
   * (google-services.json) no está configurado y provoca que la app
   * se cierre al arrancar.
   */
  async initPush() {
    // Si no es plataforma nativa (ej. navegador) no hacemos nada
    if (!Capacitor.isNativePlatform()) {
      console.log('[Push] Web/PWA: push nativo deshabilitado.');
      return;
    }

    // Temporalmente deshabilitado para evitar el crash por Firebase
    console.log(
      '[Push] Init ignorado: Firebase nativo no está configurado. ' +
        'Se desactiva PushNotifications.register() para evitar cierres de la app.'
    );

    // Cuando configures Firebase para Android (google-services.json, etc.),
    // podrás quitar este return y poner aquí la lógica real de:
    //  - pedir permisos
    //  - registrar el dispositivo
    //  - manejar listeners de notificaciones
    return;
  }
}
