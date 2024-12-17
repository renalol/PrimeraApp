import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

async function takePhoto() {
  const image = await Camera.getPhoto({
    quality: 90,                 // Calidad de la imagen
    allowEditing: true,          // Permitir edición
    resultType: CameraResultType.DataUrl, // Tipo de resultado (DataURL, Base64 o URI)
    source: CameraSource.Prompt, // Permitir elegir entre cámara o galería
  });

  console.log('Foto capturada:', image.dataUrl); // Base64 para subir o mostrar
  return image.dataUrl; // Devuelve la imagen en formato DataURL
}
