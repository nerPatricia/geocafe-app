import { NoteModalComponent } from './../../components/note-modal/note-modal';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NoteService } from './../../service/note.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PixelTragectoryPage } from '../pixel-tragectory/pixel-tragectory.page';

@Component({
  selector: 'app-field-note',
  templateUrl: 'field-note.page.html',
  styleUrls: ['field-note.page.scss'],
})
export class FieldNotePage implements OnInit {
  map: any;
  viewModeFlag = false;
  meusMapas = L.geoJSON(null, {});
  authData: any; // INFOS DO USUARIO LOGADO
  // Layer base de mapa satélite
  sateliteMap = L.tileLayer(
    'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      detectRetina: true,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '.....',
    }
  );
  layersControl;
  // Objeto das opções iniciais do mapa
  // pode ser utilizado tbm como bind no input leafletLayers
  options = {
    layers: [this.sateliteMap],
    zoom: 14,
    center: L.latLng([-20.9471382, -44.9198533]),
  };

  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private noteService: NoteService,
    private router: Router
  ) {
    this.atualizaAuthData();
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      }, 0);
    }
  }

  onMapReady(map) {
    this.map = map;
    console.log('ON MAP READY');
    this.map.addLayer(this.layersControl.overlays.meus_mapas);
  }

  ngOnInit() {
    this.layersControl = {
      baseLayers: {
        'Satelite Maps': this.sateliteMap,
      },
      overlays: {
        meus_mapas: this.meusMapas,
      },
    };
  }

  ionViewDidEnter() {
    this.viewModeFlag = true;
    this.invalidateSize();
  }

  atualizaAuthData() {
    this.authService.getAuthData().then(
      (data: any) => {
        this.authData = data;
        if (this.authData.geoJsonFields) {
          this.meusMapas.addData(this.authData.geoJsonFields);
          this.selectField();
        }
      },
      (error) => {
        console.log('erro ao pegar dados do usuário');
      }
    );
  }

  selectField() {
    this.meusMapas.eachLayer((layers) => {
      console.log('meus mapas');
      layers.on('click', async (layerClicada) => {
        this.addNote(layerClicada);
      });
    });
  }

  saveNote(noteData) {
    this.noteService.saveNote(noteData).then(
      (response) => {
        console.log(response);
        swal
          .fire({
            title: 'Sucesso!',
            text: 'Nota adicionada com sucesso.',
            confirmButtonText: 'Confirmar',
          })
          .then((result) => {
            this.router.navigateByUrl('/home/tabs/notas');
          });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async addNote(props: any) {
    const modal = await this.modalCtrl.create({
      component: NoteModalComponent,
      cssClass: 'note-center-modal',
      componentProps: {props: props.target.feature.properties}
    });

    modal.onDidDismiss().then((response: any) => {
      if (response) {
        if (response.data) {
          this.saveNote(response.data);
        }
      }
    });

    return await modal.present();
  }
}
