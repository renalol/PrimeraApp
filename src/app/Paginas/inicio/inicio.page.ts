import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

interface Actividad {
  asignatura: string;
  descripcion: string;
  fecha: string;
}

interface Nota {
  titulo: string;
  asignatura: string;
  contenido: string;
  fecha: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuario: string = '';
  isExpandedMap: { [key: string]: boolean } = {};
  selectedSegment: string = 'agendar';
  selectedNotesSegment: string = 'crear';

  consulta: {
    email: string;
    description: string;
    isSent: boolean;
  } = {
    email: '',
    description: '',
    isSent: false
  };

  nuevaActividad: Actividad = {
    asignatura: '',
    descripcion: '',
    fecha: new Date().toISOString()
  };

  nuevaNota: Nota = {
    titulo: '',
    asignatura: '',
    contenido: '',
    fecha: new Date().toISOString()
  };

  actividadesPendientes: Actividad[] = [];
  notas: Nota[] = [];
  editandoNota: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const usuario = params['usuario'];
      if (usuario) {
        this.usuario = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
      } else {
        this.loadUsuarioFromStorage();
      }
    });
    this.loadActividades();
    this.loadNotas();
  }

  ionViewWillEnter() {
    this.loadUsuarioFromStorage();
  }

  loadUsuarioFromStorage() {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      this.usuario = JSON.parse(storedUsuario);
    } else {
      console.error('No se encontró el usuario en el localStorage.');
      this.usuario = 'Invitado';
    }
  }

  loadActividades() {
    const storedActividades = localStorage.getItem('actividades');
    if (storedActividades) {
      this.actividadesPendientes = JSON.parse(storedActividades);
    }
  }

  loadNotas() {
    const storedNotas = localStorage.getItem('notas');
    if (storedNotas) {
      this.notas = JSON.parse(storedNotas);
    }
  }

  agregarActividad() {
    if (this.nuevaActividad.asignatura && this.nuevaActividad.descripcion) {
      this.actividadesPendientes.push({ ...this.nuevaActividad });
      localStorage.setItem('actividades', JSON.stringify(this.actividadesPendientes));

      // Reset form
      this.nuevaActividad = {
        asignatura: '',
        descripcion: '',
        fecha: new Date().toISOString()
      };

      // Cambiar a la vista de agenda después de agregar
      this.selectedSegment = 'agenda';
    }
  }

  eliminarActividad(index: number) {
    this.actividadesPendientes.splice(index, 1);
    localStorage.setItem('actividades', JSON.stringify(this.actividadesPendientes));
  }

  guardarNota() {
    if (this.nuevaNota.titulo && this.nuevaNota.contenido) {
      if (this.editandoNota >= 0) {
        // Actualizar nota existente
        this.notas[this.editandoNota] = { ...this.nuevaNota };
        this.editandoNota = -1;
      } else {
        // Agregar nueva nota
        this.notas.unshift({ ...this.nuevaNota });
      }

      // Guardar en localStorage
      localStorage.setItem('notas', JSON.stringify(this.notas));

      // Resetear el formulario
      this.nuevaNota = {
        titulo: '',
        asignatura: '',
        contenido: '',
        fecha: new Date().toISOString()
      };

      // Cambiar a la vista de notas
      this.selectedNotesSegment = 'ver';
    }
  }

  eliminarNota(index: number) {
    this.notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(this.notas));
  }
















  toggleExpand(cardId: string) {
    if (!this.isExpandedMap[cardId]) {
      Object.keys(this.isExpandedMap).forEach(key => this.isExpandedMap[key] = false);
    }
    this.isExpandedMap[cardId] = !this.isExpandedMap[cardId];
  }

  sendConsulta() {
    this.consulta.isSent = true;
    this.showSuccessMessage();
  }

  resetConsulta() {
    this.consulta = {
      email: '',
      description: '',
      isSent: false
    };
  }

  showSuccessMessage() {
    console.log('Consulta enviada exitosamente');
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuario = '';
    this.router.navigate(['/login']);
  }

  navigateToPage() {
    this.router.navigate(['/act-1']);
  }

  navigateToPage2() {
    this.router.navigate(['/actividad-dos']);
  }

  navigateToCalendar() {
    this.router.navigate(['/calendario']);
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }
}