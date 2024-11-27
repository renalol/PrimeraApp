import { PushNotifications } from '@capacitor/push-notifications';

export class NotificationService {
  
  constructor() {}

  async initPushNotifications() {
    try {
      // Solicitar permiso para recibir notificaciones
      const permission = await PushNotifications.requestPermissions();

      if (permission.receive === 'granted') {
        // Registrar el dispositivo para recibir notificaciones push
        await PushNotifications.register();

        // Escuchar el token del dispositivo
        PushNotifications.addListener('registration', (token) => {
          console.log('Device registered with token:', token.value);
          // Envía este token al servidor para que pueda enviar notificaciones a este dispositivo
        });

        // Manejar errores de registro
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error during registration:', error);
        });

        // Escuchar cuando se recibe una notificación push
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notification received:', notification);
          alert(`Nueva notificación: ${notification.body}`);
        });

        // Escuchar cuando el usuario abre la notificación
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Notification action performed:', action);
        });
      } else {
        console.error('Permiso para recibir notificaciones no concedido.');
      }
    } catch (error) {
      console.error('Error al inicializar las notificaciones push:', error);
    }
  }
}
