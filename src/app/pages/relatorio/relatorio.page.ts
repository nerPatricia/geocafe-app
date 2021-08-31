import { LoadingService } from '../../service/loading.service';
import { environment } from '../../../environments/environment';
import { FieldService } from '../../service/field.service';
import { CampoModalComponent } from '../../components/campo-modal/campo-modal';
import { AuthService } from 'src/app/service/auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { kml } from '@tmcw/togeojson';
import { LeafletDrawDirective } from '@asymmetrik/ngx-leaflet-draw';
import { ModalController } from '@ionic/angular';
import parseGeoRaster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import Chroma from 'chroma-js';
import Geoblaze from 'geoblaze';

@Component({
  selector: 'app-relatorio',
  templateUrl: 'relatorio.page.html',
  styleUrls: ['relatorio.page.scss'],
})
export class RelatorioPage implements OnInit {
  url = environment.url;
  map: any;
  authData: any; // INFOS DO USUARIO LOGADO
  viewModeFlag = false;
  polygonDrawer; // OBJETO DO DESENHO NO MAPA
  selecionaAreaDoKML = false;
  campoList = []; // lista de áreas de desenho completo
  // Layer base de mapa satélite
  sateliteMap = L.tileLayer(
    'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      detectRetina: true,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '.....',
    }
  );
  // Layer de dados geoJSON iniciada vazia
  kmlMaps = L.geoJSON(null, {});
  layersControl;
  // Objeto das opções iniciais do mapa
  // pode ser utilizado tbm como bind no input leafletLayers
  options = {
    layers: [this.sateliteMap],
    zoom: 14,
    center: L.latLng([-21.3726284, -45.5167047]),
  };
  // Objetos usados pra desenhar os campos e configurar labels
  // TODOS OS DESENHOS DE AREA SÃO SALVOS EM LAYER NO drawItems e no campoList
  drawItems: L.FeatureGroup = L.featureGroup();
  drawOptions;

  @ViewChild(LeafletDrawDirective)
  leafletDirective: LeafletDrawDirective;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private fieldService: FieldService
  ) {
    // this.polygonDrawer.disable();
    this.campoList = [];
    this.drawItems.clearLayers();
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
  }

  ngOnInit() {
    this.loadGeoJson();
    // Objeto de controle das layers
    // baseLayers são as de "baixo", no caso, o mapa satélite; É obrigatória a seleção de ao menos uma.
    // overlays são as de "cima", layers que não são obrigatórias e sobrepõe a baseLayer. Pode ter mais de uma selecionada.
    this.layersControl = {
      baseLayers: {
        'Satelite Maps': this.sateliteMap,
      },
      overlays: {
        KML_Map: this.kmlMaps,
      },
    };

    this.getFields();
  }

  ionViewDidEnter() {
    this.viewModeFlag = true;
    this.invalidateSize();
  }

  // Transforma o KML de três pontas em geoJSON e adiciona na layer
  loadGeoJson() {
    fetch('../../../assets/maps/areaCafeeiraTresPontas.kml')
      .then((response) => {
        return response.text();
      })
      .then((xml) => {
        console.log(kml(new DOMParser().parseFromString(xml, 'text/xml')));
        const result = kml(new DOMParser().parseFromString(xml, 'text/xml'));
        this.kmlMaps.addData(result);
      });
  }

  async getFields() {
    // VERIFICA SE O USUÁRIO POSSUI ALGUM FIELD
    // SE SIM, FAZ UM GET FIELD PELO ID PEGANDO O TIFF PELA DATA SELECIONADA
    // PASSAR POR TODOS OS FIELDS DO USUARIO
    // SE NÃO HOUVER ALGUM FIELD, RETORNAR UMA MSG

    this.authService.getAuthData().then(
      (data: any) => {
        this.authData = data;
        if (this.authData.fields.length > 0) {
          this.campoList = this.authData.fields;
          // TODO: verificar esse [0] aqui pra ver se nao ta pegando só o primeiro elemento
          fetch(`${this.url}field/cut/${this.authData.fields[0].id}?date=16_04_2021`)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
              parseGeoRaster(arrayBuffer).then((georaster) => {
                console.log(georaster);
                // const min = georaster.mins[0]; // pega o min dinamico
                // const range = georaster.ranges[0]; // pega o range dinamico
                // TODO: FIX RANGE - min e max do potencial hidrico
                const min = -7;
                const range = 7;
                // console.log(Chroma.brewer); // exibe escalas de cores pré prontas
                const scale = Chroma.scale(this.newPalette());
                const newLayer = new GeoRasterLayer({
                  georaster,
                  opacity: 0.9,
                  pixelValuesToColorFn: (pixelValues) => {
                    const pixelValue = pixelValues[0]; // só tem uma banda no georaster, então pega o [0]
                    // se o valor for 0, então não retorna uma cor
                    if (pixelValue === 0) {
                      return null;
                    }
                    // escala de 0 - 1 usado pelo chroma.js
                    const scaledPixelValue = (pixelValue - min) / range;
                    const color = scale(scaledPixelValue).hex();
                    return color;
                  },
                  resolution: 256, // optional parameter for adjusting display resolution
                });

                this.layersControl.overlays = {
                  ...this.layersControl.overlays,
                  campos: newLayer,
                };
                // TODO: criar uma layer com cada nome de campo que foi salvo
                // desse jeito que ta hoje, quando cria um novo ele substitui o anterior

                this.map.addLayer(this.layersControl.overlays.campos);
                // console.log(this.layersControl.overlays.campos);

                this.getValuesOnClick(georaster);
                this.createMapLegend();
                this.map.fitBounds(newLayer.getBounds());
                this.authService.campoControl.next(0);
              });
            });
          // TODO: antes de salvar os campos, exibir, editar ou excluir campos selecionados
        } else {
          console.log('USUARIO NAO TEM FIELD CADASTRADO');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  newPalette() {
    return Chroma.scale([
      '#f30f0f',
      '#f5530e',
      '#f6780d',
      '#f7970d',
      '#00d0ff',
    ]);
  }

  getValuesOnClick(georaster) {
    // pega os valores do pixel do georaster no click
    this.map.on('click', (element) => {
      const latlng = [element.latlng.lng, element.latlng.lat];
      // results is an array, which each item representing a separate band
      const results = Geoblaze.identify(georaster, latlng);
      const popupContent =
        '<p><b>Potencial Hídrico: </b>' + results + 'MPa</p>';
      let popup = L.popup()
        .setLatLng(new L.LatLng(element.latlng.lat, element.latlng.lng))
        .setContent(popupContent)
        .openOn(this.map);
    });
  }

  createMapLegend() {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = (map) => {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [-3.6, -2.5, -1.5, -0.5, 1.5];
      const labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<div style="height:20px; width:25px; text-align:center; background:' +
          this.getColor(grades[i]) +
          '">' +
          grades[i] +
          '</div> ';
      }
      return div;
    };

    legend.addTo(this.map);
  }

  getColor(d) {
    // azul - #00d0ff - valores ate 0,5/1.5
    // verde - #49d402 - valores de 0,5 até -1,4
    // amarelo - #f3ec0f - valores de -1,5 até -2,4
    // laranja - #f3a20f - valores de -2,5 até -3,5
    // vermelho - #f30f0f - valores de -3,5 pra baixo
    return d > 0.5
      ? '#00d0ff'
      : d <= 0.5 && d >= -1.4
      ? '#49d402'
      : d <= -1.5 && d >= -2.4
      ? '#f3ec0f'
      : d <= -2.5 && d >= -3.5
      ? '#f3a20f'
      : d < -3.5
      ? '#f30f0f'
      : '#fff';
  }
}
