import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;

  usuario: string = '';
  password: string = ''; // Nueva contraseña
  currentPassword: string = ''; // Contraseña actual
  profileImageSrc: string | null = null;
  animation: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationController: AnimationController,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const usuario = params['usuario'];
      if (usuario) {
        this.usuario = usuario;
      } else {
        this.loadUsuarioFromStorage();
      }
    });
    this.loadProfileData();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  loadUsuarioFromStorage() {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      this.usuario = storedUsuario;
    } else {
      console.error('No se encontró el usuario en el localStorage.');
      this.usuario = 'Invitado';
    }
  }

  loadProfileData() {

    const storedImage = localStorage.getItem('userProfileImage');
    if (storedImage) {
      this.profileImageSrc = storedImage;
    }
  }

  async saveProfile() {
    if (!this.validateInputs()) {
      return;
    }

    const storedPassword = localStorage.getItem('loginPassword');
    if (!storedPassword) {
      this.presentToast('Error: No se encontró la contraseña del login en el sistema', 'danger');
      return;
    }

    if (this.currentPassword !== storedPassword) {
      this.presentToast('Error: La contraseña actual no es correcta', 'danger');
      return;
    }

    if (this.password) {
      localStorage.setItem('loginPassword', this.password);
    }

    this.presentToast('Perfil actualizado correctamente', 'success');

    this.password = '';
    this.currentPassword = '';
  }

  validateInputs(): boolean {
    if (this.password && this.password.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres', 'danger');
      return false;
    }

    return true;
  }

  async logout() {
    localStorage.removeItem('usuario');
    this.navCtrl.navigateRoot('/home');
    this.presentToast('Sesión cerrada correctamente', 'medium');
  }

  goToHome() {
    this.navCtrl.navigateRoot('/inicio');
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
