import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PixelTragectoryPage } from '../pixel-tragectory/pixel-tragectory.page';

@Component({
  selector: 'app-relatorio',
  templateUrl: 'relatorio.page.html',
  styleUrls: ['relatorio.page.scss'],
})
export class RelatorioPage implements OnInit {
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
    center: L.latLng([-21.3726284, -45.5167047]),
  };

  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    private modalCtrl: ModalController
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
    this.map.on('click', (element) => {
      this.presentAlert(element.latlng.lat, element.latlng.lng);
    });
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
        }
      },
      (error) => {
        console.log('erro ao pegar dados do usuário');
      }
    );
  }

  async presentAlert(lat, long) {
    const alert = await this.alertController.create({
      header: 'Tragetória do Pixel Selecionado',
      message: `Deseja visualizar a tragetória do pixel de latitude ${lat} e longitude ${long}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Sim',
          handler: () => {
            this.expandeGrafico({lat, long});
          }
        }
      ]
    });

    await alert.present();
  }

  async expandeGrafico(latLong) {
    const modal = await this.modalCtrl.create({
      component: PixelTragectoryPage,
      cssClass: 'default-modal',
      componentProps: {
        latLong
      }
    });
    return await modal.present();
  }
}
