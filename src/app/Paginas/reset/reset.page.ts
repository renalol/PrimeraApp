import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage {
  usuario: string = '';
  contrasena: string = '';
  animation: any;

  constructor(
    private navCtrl: NavController, 
    private animationController: AnimationController, 
    private dbService: DbService, // Inyección del servicio DbService
    private alertController: AlertController // AlertController para mostrar errores
  ) {}

  async guardarDatos() {
    if (!this.usuario || !this.contrasena) {
      // Mostrar alerta si los datos son inválidos
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor, ingresa un usuario y contraseña válidos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      // Guardar los datos en DbService
      await this.dbService.setUserData(this.usuario, this.contrasena);
      console.log('Datos guardados correctamente');
      this.navCtrl.navigateForward('/inicio'); // Redirigir a inicio
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al guardar los datos. Intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  ngOnInit() {
    // Ejecutar la animación cuando la vista esté cargada
    this.animacionTexto();
  }

  animacionTexto() {
    const texto = document.getElementById('tPrincipal') as HTMLElement;

    if (texto) {
      console.log('Texto encontrado, aplicando animación.');
      this.animation = this.animationController.create()
        .addElement(texto)
        .duration(5000)
        .iterations(Infinity)
        .fromTo('transform', 'translateX(-110px)', 'translateX(400px)');

      this.animation.play();
    } else {
      console.error('No se encontró el elemento con el id tPrincipal');
    }
  }

  async resetCredentials() {
    if (this.usuario && this.contrasena) {
      try {
        // Guardar nuevas credenciales en DbService
        await this.guardarDatos();
        // Redirigir a la página de inicio
        this.navCtrl.navigateForward('/inicio');
      } catch (error) {
        console.error('Error al actualizar las credenciales:', error);
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor, ingresa un nuevo usuario y contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
