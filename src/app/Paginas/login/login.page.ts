import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { DbService } from '../../services/db.service'; 
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
  animation: any; // Declarar la propiedad animation

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private animationController: AnimationController,
    private dbService: DbService  // Inyecta el servicio de almacenamiento
  ) {}

  async iniciarSesion() {
    if (!this.usuario || !this.contrasena) {
      const alert = await this.alertController.create({
        header: 'Error de inicio de sesión',
        message: 'Por favor, ingresa tu usuario y contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      // Validar si el usuario y contraseña coinciden
      const isValid = await this.dbService.validateLogin(this.usuario, this.contrasena);
      
      if (isValid) {
        this.router.navigate(['/inicio'], { queryParams: { usuario: this.usuario } });
      } else {
        const alert = await this.alertController.create({
          header: 'Error de inicio de sesión',
          message: 'Usuario o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }

    addIcons({ eye, lockClosed });
  }

  async navigateToReset() {
    this.router.navigate(['/reset']);
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
