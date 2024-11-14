import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service'; // Replace with actual import path
import { AlertController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';


@Component({
  selector: 'app-registro', // Corrected selector 'app-registro'
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  nuevoUsuario: string = '';
  nuevaContrasena: string = '';
  animation: any; // Declarar la propiedad animation


  constructor(
    private dbService: DbService,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {}

  async registrarUsuario() { // Corrected method name 'registrarUsuario'
    if (!this.nuevoUsuario || !this.nuevaContrasena) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un nuevo usuario y contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      // Guarda los nuevos datos del usuario
      await this.dbService.setUserData(this.nuevoUsuario, this.nuevaContrasena);
      const alert = await this.alertController.create({
        header: 'Registro exitoso', // More user-friendly message
        message: 'Tu usuario y contraseña se han creado.', // Clarify action
        buttons: ['OK']
      });
      await alert.present();

      // Redirige al login
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.animacionTexto();
  }
  animacionTexto() {
    const texto = document.getElementById('tPrincipal') as HTMLElement;

    if (texto) {
      this.animation = this.animationController.create()
        .addElement(texto)
        .duration(5000)
        .iterations(Infinity)
        .fromTo('transform', 'translateX(-250px)', 'translateX(400px)');

      this.animation.play();
    }
  }
}