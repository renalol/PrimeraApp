import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';
import { addIcons } from 'ionicons';
import { eye, lockClosed } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  usuario: string = '';
  contrasena: string = '';
  animation: any;

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private animationController: AnimationController,
    private supabaseService: SupabaseService
  ) {
    addIcons({ eye, lockClosed });
  }

  async iniciarSesion() {
    // Validación de los campos de entrada
    if (!this.usuario || !this.contrasena) {
      await this.mostrarAlerta(
        'Error de inicio de sesión', 
        'Por favor, ingresa tu usuario y contraseña.'
      );
      return;
    }

    try {
      // Intento de iniciar sesión usando el servicio Supabase
      const usuario = await this.supabaseService.login(this.usuario, this.contrasena);
      
      if (usuario) {
        // Si el inicio de sesión es exitoso, navega a la página de inicio con la información del usuario
        this.router.navigate(['/inicio'], { 
          queryParams: { 
            usuario: this.usuario 
          } 
        });
      } else {
        // Muestra un error si el inicio de sesión falla
        await this.mostrarAlerta(
          'Error de inicio de sesión', 
          'Usuario o contraseña incorrectos.'
        );
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      await this.mostrarAlerta(
        'Error', 
        'Ocurrió un error durante el inicio de sesión. Intenta nuevamente.'
      );
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async navigateToReset() {
    this.router.navigate(['/reset']);
  }

  ngAfterViewInit() {
    this.animacionTexto();
  }

  animacionTexto() {
    // Código para la animación del texto
  }
}