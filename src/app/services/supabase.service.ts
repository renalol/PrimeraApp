import { Injectable } from '@angular/core';
import { createClient, PostgrestError } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = 'https://ptpbeqmiydvzikuljtoh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cGJlcW1peWR2emlrdWxqdG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMTA2NTAsImV4cCI6MjA0ODU4NjY1MH0.4dvEstJmwtb16yOLrxtR8OG0O1StVsCmGfXScdbzdAQ';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  constructor() {}

  /**
   * Manejo de errores centralizado
   * @param error Error de Supabase
   * @param operation Operación que falló
   */
  private handleError(error: PostgrestError | null, operation: string): void {
    if (error) {
      console.error(`Error en la operación "${operation}": ${error.message}`);
      throw new Error(`Operación fallida (${operation}): ${error.message}`);
    }
  }

  /**
   * Registrar un nuevo usuario
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns True si el registro fue exitoso, false en caso contrario
   */
  async registerUser(username: string, password: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('usuarios').insert([{ username, password }]);
      this.handleError(error, 'registrar usuario');
      return true;
    } catch (error) {
      console.error('Error en registerUser:', error);
      return false;
    }
  }

  /**
   * Iniciar sesión
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Datos del usuario si es exitoso, null en caso contrario
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      this.handleError(error, 'iniciar sesión');

      if (data) {
        localStorage.setItem('Id', data.id);
        console.log('Usuario autenticado:', data);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  /**
   * Obtener actividades de un usuario
   * @param username Nombre de usuario
   * @returns Lista de actividades o null si falla
   */
  async getActividades(username: string): Promise<any[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('actividades')
        .select('*')
        .eq('username', username);

      this.handleError(error, 'obtener actividades');
      return data;
    } catch (error) {
      console.error('Error en getActividades:', error);
      return null;
    }
  }

  /**
   * Agregar una nueva actividad
   * @param username Nombre de usuario
   * @param asignatura Asignatura asociada
   * @param descripcion Descripción de la actividad
   * @returns True si fue exitoso, false en caso contrario
   */
  async addActividad(username: string, asignatura: string, descripcion: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('actividades').insert([
        { username, asignatura, descripcion },
      ]);
      this.handleError(error, 'agregar actividad');
      return true;
    } catch (error) {
      console.error('Error en addActividad:', error);
      return false;
    }
  }

  /**
   * Actualizar la contraseña de un usuario
   * @param username Nombre de usuario
   * @param newPassword Nueva contraseña
   * @returns True si fue exitoso, false en caso contrario
   */
  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('usuarios')
        .update({ password: newPassword })
        .eq('username', username);

      this.handleError(error, 'actualizar contraseña');
      return true;
    } catch (error) {
      console.error('Error en updatePassword:', error);
      return false;
    }
  }

  /**
   * Obtener alertas de un usuario
   * @param username Nombre de usuario
   * @returns Lista de alertas o null si falla
   */
  async getAlertas(username: string): Promise<any[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('alertas')
        .select('*')
        .eq('username', username);

      this.handleError(error, 'obtener alertas');
      return data;
    } catch (error) {
      console.error('Error en getAlertas:', error);
      return null;
    }
  }

  /**
   * Agregar una nueva alerta
   * @param username Nombre de usuario
   * @param asignatura Asignatura asociada
   * @param descripcion Descripción de la alerta
   * @param fecha Fecha de la alerta
   * @returns True si fue exitoso, false en caso contrario
   */
  async addAlerta(
    username: string,
    asignatura: string,
    descripcion: string,
    fecha: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('alertas').insert([
        { username, asignatura, descripcion, fecha },
      ]);
      this.handleError(error, 'agregar alerta');
      return true;
    } catch (error) {
      console.error('Error en addAlerta:', error);
      return false;
    }
  }
}