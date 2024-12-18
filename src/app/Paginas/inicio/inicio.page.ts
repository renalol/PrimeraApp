import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import axios from 'axios';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

interface Palabra {
  word: string;
  score: number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  photo: string | null = null; // Variable para almacenar la foto
  selectedNotesAgendaSegment: string = 'agregar'; // Valor por defecto
  notasAgendadas: any[] = [];
  nuevaNotaAgendada = { titulo: '', fecha: '', contenido: '' };
  nuevaAlerta = {
    fecha: '',
    asignatura: '',
    descripcion: ''
  };
  alertasPendientes: any[] = [];
  usuario: string = '';
  isExpandedMap: { [key: string]: boolean } = {
    consulta: false,
    agendar: false,
    notas: false
  };
  selectedSegment: string = 'agendar';
  selectedNotesSegment: string = 'crear';
  palabraBuscada: string = '';
  palabrasRelacionadas: Palabra[] = [];
  palabrasCargando: boolean = false;

  consulta: {
    email: string;
    description: string;
    isSent: boolean;
  } = {
    email: '',
    description: '',
    isSent: false,
  };

  nuevaActividad: Actividad = {
    asignatura: '',
    descripcion: '',
    fecha: new Date().toISOString(),
  };

  nuevaNota: Nota = {
    titulo: '',
    asignatura: '',
    contenido: '',
    fecha: new Date().toISOString(),
  };

  actividadesPendientes: Actividad[] = [];
  notas: Nota[] = [];
  editandoNota: number = -1;
  correo = {
    destinatario: '',
    asunto: '',
    contenido: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
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

  guardarNotaAgendada() {
    if (this.nuevaNotaAgendada.titulo && this.nuevaNotaAgendada.fecha && this.nuevaNotaAgendada.contenido) {
      this.notasAgendadas.push({ ...this.nuevaNotaAgendada });
      this.nuevaNotaAgendada = { titulo: '', fecha: '', contenido: '' };
      alert('Nota agendada guardada exitosamente.');
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
  
  eliminarNotaAgendada(index: number) {
    this.notasAgendadas.splice(index, 1);
  }

  loadUsuarioFromStorage() {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      this.usuario = JSON.parse(storedUsuario);
    } else {
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
      localStorage.setItem(
        'actividades',
        JSON.stringify(this.actividadesPendientes)
      );

      this.nuevaActividad = {
        asignatura: '',
        descripcion: '',
        fecha: new Date().toISOString(),
      };

      this.selectedSegment = 'agenda';
    }
  }

  eliminarActividad(index: number) {
    this.actividadesPendientes.splice(index, 1);
    localStorage.setItem(
      'actividades',
      JSON.stringify(this.actividadesPendientes)
    );
  }

  guardarNota() {
    if (this.nuevaNota.titulo && this.nuevaNota.contenido) {
      if (this.editandoNota >= 0) {
        this.notas[this.editandoNota] = { ...this.nuevaNota };
        this.editandoNota = -1;
      } else {
        this.notas.unshift({ ...this.nuevaNota });
      }

      localStorage.setItem('notas', JSON.stringify(this.notas));

      this.nuevaNota = {
        titulo: '',
        asignatura: '',
        contenido: '',
        fecha: new Date().toISOString(),
      };

      this.selectedNotesSegment = 'ver';
    }
  }

  eliminarNota(index: number) {
    this.notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(this.notas));
  }

  toggleExpand(cardId: string) {
    if (!this.isExpandedMap[cardId]) {
      Object.keys(this.isExpandedMap).forEach(
        (key) => (this.isExpandedMap[key] = false)
      );
    }
    this.isExpandedMap[cardId] = !this.isExpandedMap[cardId];
  }

  async enviarCorreo() {
    if (this.correo.destinatario && this.correo.asunto && this.correo.contenido) {
      console.log("Enviando correo a:", this.correo.destinatario);
      console.log("Asunto:", this.correo.asunto);
      console.log("Contenido:", this.correo.contenido);

      await this.mostrarToast('Correo enviado exitosamente.');
    } else {
      await this.mostrarToast('Por favor, complete todos los campos.');
    }
  }

  async buscarPalabras() {
    const palabraTrimmed = this.palabraBuscada.trim();
  
    if (palabraTrimmed === '') {
      this.palabrasRelacionadas = [];
      return;
    }

    try {
      this.palabrasCargando = true;
    
      const response = await axios.get<Palabra[]>(`https://api.datamuse.com/words`, {
        params: {
          ml: palabraTrimmed,
          max: 6
        }
      });

      this.palabrasRelacionadas = response.data.map((palabra: Palabra) => ({
        word: palabra.word,
        score: palabra.score
      }));

      if (this.palabrasRelacionadas.length === 0) {
        await this.mostrarToast('No se encontraron palabras relacionadas');
      }
    } catch (error) {
      console.error('Error al buscar palabras:', error);
      this.palabrasRelacionadas = [];
      await this.mostrarToast('Error al buscar palabras relacionadas');
    } finally {
      this.palabrasCargando = false;
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  async agregarAlerta() {
    if (!this.nuevaAlerta.fecha || !this.nuevaAlerta.asignatura || !this.nuevaAlerta.descripcion) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, completa todos los campos antes de agendar.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.alertasPendientes.push({ ...this.nuevaAlerta });

    const alert = await this.alertController.create({
      header: 'Alerta Agendada',
      message: `
        <strong>Título:</strong> ${this.nuevaAlerta.asignatura} <br>
        <strong>Descripción:</strong> ${this.nuevaAlerta.descripcion} <br>
        <strong>Fecha y hora:</strong> ${this.nuevaAlerta.fecha}`,
      buttons: ['OK'],
    });
    await alert.present();

    this.nuevaAlerta = {
      fecha: '',
      asignatura: '',
      descripcion: ''
    };
  }

  eliminarAlerta(index: number) {
    this.alertasPendientes.splice(index, 1);
  }

  async capturePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    this.photo = image.dataUrl ?? null; // Store the photo URL
  }
}
