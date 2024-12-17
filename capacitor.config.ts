import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MiAplicacion',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: 'body' as any, // Solución temporal
    },
    Camera: {
      allowEditing: true, // Permite editar la foto antes de seleccionarla
      saveToGallery: false, // Decide si guardar la foto en la galería
    },
  },
};

export default config;
