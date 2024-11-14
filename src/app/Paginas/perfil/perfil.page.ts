import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: string = '';

  constructor(private route: ActivatedRoute, private router: Router, navCtrl: NavController) {}

  ngOnInit() {
    // Intentar obtener el usuario de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const usuario = params['usuario'];
      if (usuario) {
        this.usuario = usuario;
      } else {
        // Si no hay parámetro en la URL, intentar cargar desde localStorage
        this.loadUsuarioFromStorage();
      }
    });
  }

  ionViewWillEnter() {
    // Asegurarse de recargar el usuario desde el localStorage cada vez que se entre a la página
    this.loadUsuarioFromStorage();
  }

  // Función para cargar el usuario desde el localStorage
  loadUsuarioFromStorage() {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      this.usuario = storedUsuario;
    } else {
      console.error('No se encontró el usuario en el localStorage.');
      this.usuario = 'Invitado'; // Valor por defecto si no hay usuario
    }
  }

}
