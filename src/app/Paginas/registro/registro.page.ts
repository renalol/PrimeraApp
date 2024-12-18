import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { AlertController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  nuevoUsuario: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  animation: any;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {}

  async registrarUsuario() {
    // Validación de los campos
    if (!this.nuevoUsuario || !this.nuevaContrasena || !this.confirmarContrasena) {
      await this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.mostrarAlerta('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (this.nuevoUsuario.length < 3) {
      await this.mostrarAlerta('Error', 'El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      await this.mostrarAlerta('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // Intento de registrar al usuario
      const registrado = await this.supabaseService.registerUser(this.nuevoUsuario, this.nuevaContrasena);

      if (registrado) {
        // Si el registro es exitoso, intenta iniciar sesión automáticamente
        const usuario = await this.supabaseService.login(this.nuevoUsuario, this.nuevaContrasena);
        
        if (usuario) {
          await this.mostrarAlerta('Registro Exitoso', 'Tu usuario ha sido creado correctamente.');
          this.router.navigate(['/dashboard']);
        } else {
          await this.mostrarAlerta('Error', 'Registro exitoso, pero no se pudo iniciar sesión automáticamente.');
          this.router.navigate(['/login']);
        }
      } else {
        await this.mostrarAlerta('Error', 'No se pudo completar el registro. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error durante el registro.');
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

  ngAfterViewInit() {
    this.animacionTexto();
  }

  animacionTexto() {
    // Código para la animación del texto
  }
}