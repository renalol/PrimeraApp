import { Component } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { Keyboard } from '@capacitor/keyboard';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
  
}
Keyboard.setResizeMode({ mode: 'body' as any }); // Forzar el tipo

async function requestCameraPermissions() {
  const status = await Camera.requestPermissions();
  console.log('Permiso para la cámara:', status);
}
requestCameraPermissions();

