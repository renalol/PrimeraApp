import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async setUserData(usuario: string, contrasena: string) {
    await this._storage?.set('usuario', usuario);
    await this._storage?.set('contrasena', contrasena);
  }

  async validateLogin(usuario: string, contrasena: string): Promise<boolean> {
    const storedUser = await this._storage?.get('usuario');
    const storedPassword = await this._storage?.get('contrasena');

    // Comparación exacta, sin espacios en blanco adicionales
    return storedUser === usuario && storedPassword === contrasena;
  }
}