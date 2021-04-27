import { LoadingService } from './../../service/loading.service';
import { environment } from './../../../environments/environment';
import { FieldService } from './../../service/field.service';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  url = environment.url;
  map: any;
  viewModeFlag = false;
  drawMessage = 'Posicione um ponto para demarcar uma área.'; // msg no header enquanto o desenho da área é feito
  campoControl = 0; // 0 - apenas exibição; 1 - seleção de campo em área que ja existe; 2 - novo campo (draw)
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
  drawItems: L.FeatureGroup = L.featureGroup();
  drawOptions;
  // TODO: botar essa variavel em algum outro lugar, ocupa muito espaço
  drawLocal = {
    draw: {
      toolbar: {
        actions: {
          title: 'Cancelar desenho',
          text: 'Cancelar',
        },
        finish: {
          title: 'Finalizar desenho',
          text: 'Finalizar',
        },
        undo: {
          title: 'Apagar último ponto desenhado',
          text: 'Apagar último ponto',
        },
        buttons: {
          polygon: 'Desenhe um poligono',
        },
      },
      handlers: {
        polygon: {
          tooltip: {
            start: 'Posicione o primeiro ponto da área.',
            cont: 'Posicione um ponto para continuar a demarcar uma área.',
            end: 'Toque no primeiro ponto para finalizar a área.',
          },
        },
        polyline: {
          error: '<strong>Atenção:<strong> você não pode fazer isso!',
        },
      },
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: 'Salvar mudanças',
            text: 'Salvar',
          },
          cancel: {
            title: 'Cancelar edição, descarta todas as mudanças.',
            text: 'Cancelar',
          },
          clearAll: {
            title: 'Apaga todas as layers.',
            text: 'Apagar tudo',
          },
        },
        buttons: {
          edit: 'Editar áreas',
          editDisabled: 'Sem áreas para editar',
          remove: 'Apagar áreas',
          removeDisabled: 'Sem áreas para apagar',
        },
      },
      handlers: {
        edit: {
          tooltip: {
            text: 'Arraste as arestas ou marcadores para editar uma área.',
            subtext: 'Clique em cancelar para desfazer as mudanças.',
          },
        },
        remove: {
          tooltip: {
            text: 'Clique em uma área para remover.',
          },
        },
      },
    },
  };

  @ViewChild(LeafletDrawDirective)
  leafletDirective: LeafletDrawDirective;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private fieldService: FieldService,
    private loading: LoadingService
  ) {
    this.authService.campoControl.subscribe((data) => {
      this.campoControl = data;
      if (data === 2) {
        this.setDrawOption();
      }
    });
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
  }

  onDrawReady(drawControl?: L.Control.Draw) {
    // TODO: deixar a linha amarela e não azul
    // não sei pq ta azul na vdd
    const polygonDrawer = new L.Draw.Polygon(this.map);
    polygonDrawer.enable();
  }

  onDrawStart(event) {
    // antes do primeiro click é draw start
    // após o primeiro click é draw cont
    // ao finalizar é draw end
    // TODO: adicionar uma msg pra cada ação:
    // 1 - adicionar o primeiro ponto para iniciar
    // 2 - clicar no primeiro ponto para finalizar a area
    // 3 - adicionar mais areas no campo
    console.log(
      'ON DRAW START: ',
      this.drawLocal.draw.handlers.polygon.tooltip.start
    );
    this.drawMessage = 'Posicione um ponto para demarcar uma área.';
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
        'KML Maps': this.kmlMaps,
      },
    };
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

  public onDrawCreated(e: any) {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      this.drawMessage = 'Você pode adicionar mais áreas.';
      this.presentModal('center-modal', {
        type: 'nomeCampoSelecionado',
        layer,
        campoList: this.campoList,
      });
    }
  }

  // TODO: verificar se vale a pena mesmo manter isso daqui
  // já que as unicas opções de ficaram foi editar poligono e apagar tudo
  setDrawOption() {
    this.drawOptions = {
      position: 'topright',
      draw: {
        polygon: false,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: this.drawItems,
      },
    };
  }

  async save() {
    console.log(this.campoList);

    if (this.campoList.length === 0) {
      return;
    }

    this.fieldService.saveField(this.campoList).then(
      (res: any) => {
        console.log(res);
        fetch(`${this.url}field/cut/${res.data[0].id}`)
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => {
            parseGeoRaster(arrayBuffer).then((georaster) => {
              console.log(georaster);
              const min = georaster.mins[0]; // pega o min dinamico
              const range = georaster.ranges[0]; // pega o range dinamico
              // TODO: FIX RANGE - min e max do potencial hidrico
              // const min = -7;
              // const range = 7;
              // console.log(Chroma.brewer); // exibe escalas de cores pré prontas
              const scale = Chroma.scale('Viridis');
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
              this.map.addLayer(this.layersControl.overlays.campos);
              // console.log(this.layersControl.overlays.campos);

              this.map.fitBounds(newLayer.getBounds());

              // pega os valores do pixel do georaster no click
              this.map.on('click', element => {
                const latlng = [element.latlng.lng, element.latlng.lat];
                // results is an array, which each item representing a separate band
                const results = Geoblaze.identify(georaster, latlng);
                console.log(results);
              });
            });
          });
      },
      (error) => {
        console.log(error);
      }
    );

    // TODO: antes de salvar os campos, exibir, editar ou excluir campos selecionados
  }

  async presentModal(cssClass = 'default', props?: any) {
    const modal = await this.modalCtrl.create({
      component: CampoModalComponent,
      cssClass,
      componentProps: { props },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response: any) => {
      const retorno = response.data || null;
      if (retorno) {
        if (retorno.addCampo) {
          const infoCampo = {
            coordinates: props.layer._latlngs[0],
            name: retorno.nomeCampo,
            user_id: '0',
          };
          this.campoList.push(infoCampo);
          this.drawItems.addLayer(props.layer);
        }
      }
    });
    return await modal.present();
  }
}
