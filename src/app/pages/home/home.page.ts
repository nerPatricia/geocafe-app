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
  authData: any; // TODO: definir uma interface aqui, são os dados do usuário logado salvos no localstorage
  viewModeFlag = false;
  drawMessage = 'Posicione um ponto para demarcar uma área.'; // msg no header enquanto o desenho da área é feito
  polygonDrawer; // OBJETO DO DESENHO NO MAPA
  // 0 - apenas exibição; 1 - seleção de campo em área que ja existe; 2 - novo campo (draw)
  // 3 - criou um poligono valido; 4 - salvou um poligono e recuperou o geotiff
  campoControl = 0;
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
    // O CONTROLE DE ESTADO DO MAPA É FEITO POR ESSE CAMPOCONTROL
    // 0 - apenas exibição do mapa; 1 - tela de seleção de area que ja existe; 2 - inicializa um novo campo (novo draw)
    // 3 - criou um poligono valido; 4 - salvou um poligono e recuperou o geotiff
    this.authService.campoControl.subscribe((data: any) => {
      console.log('SUBSCRIBE: ', data);
      this.campoControl = data;
      if (data === 2) {
        this.setDrawOption();
      } else if (data === 1) {
        this.setDrawOption();
        this.selecionaAreaDoKML = true;
        this.verifyClickKMLArea();
      } else if (data === 0) {
        this.polygonDrawer.disable();
        this.campoList = [];
        this.drawItems.clearLayers();
      }
    });

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
  }

  onDrawReady(drawControl?: L.Control.Draw) {
    // SE FOR NO MODO DE SELEÇÃO DE AREA PELO KML
    // NÃO PODE TER CAMPOCONTROL 2 AQUI SENÃO VAI LIBERAR O DRAW DE POLIGONO
    if (!this.selecionaAreaDoKML) {
      // INICIALIZA O OBJETO QUE VAI DESENHAR O POLIGONO
      this.polygonDrawer = new L.Draw.Polygon(this.map);
      // ATIVA O OBJETO PRA PODER DESENHAR
      this.polygonDrawer.enable();
      this.authService.campoControl.next(2);
      console.log('DRAW READY');
    } else {
      // DEPOIS DA PRIMEIRA VALIDAÇÃO JÁ PODE LIBERAR O DRAW DE POLIGONO
      // SE NÃO, NA HORA DE ADICIONAR NOVO CAMPO VAI TA BLOQUEADO
      this.selecionaAreaDoKML = !this.selecionaAreaDoKML;
    }
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
        KML_Map: this.kmlMaps,
      },
    };
  }

  verifyClickKMLArea() {
    // trás a layer com o KML pra destaque no mapa
    this.map.addLayer(this.layersControl.overlays.KML_Map);

    this.kmlMaps.eachLayer((layers) => {
      layers.on('click', (layerClicada) => {
        console.log(layerClicada);
        this.presentModal('center-modal', {
          type: 'nomeCampoSelecionado',
          layer: layerClicada,
          campoList: this.campoList,
        });
      });
    });
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

  atualizaAuthData() {
    this.authService.getAuthData().then(
      (data: any) => {
        this.authData = data;
      },
      (error) => {
        console.log('erro ao pegar dados do usuário');
      }
    );
  }

  async atualizaFieldsAuthData(userId) {
    this.fieldService.getAllFieldsByUser(userId).then(
      async (responseFields: any) => {
        this.authData.fields = responseFields.data;
        await this.authService.saveAuth(this.authData);
      },
      (error) => {
        console.log('erro ao atualizar authData');
      }
    );
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
    console.log('ON DRAW CREATED');
  }

  onDrawDeleted(e: any) {
    console.log('ON DRAW DELETED');
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

    console.log(this.layersControl.overlays.campos);

    this.fieldService.saveField(this.campoList).then(
      (res: any) => {
        console.log(res);
        // TODO: verificar esse [0] aqui pra ver se nao ta pegando só o primeiro elemento
        fetch(`${this.url}field/cut/${res.data[0].id}?date=05_05_2021`)
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

              this.getValuesOnClick(georaster); // pega os valores de potencial hidrico no click
              this.createMapLegend(); // cria a lengenda no mapa
              this.map.fitBounds(newLayer.getBounds()); // trás a nova layer como prioritária
              this.atualizaFieldsAuthData(this.authData.user_id); // atualiza os campos do usuário em localStorage
              this.authService.campoControl.next(0); // volta a tela pra modo de exibição do mapa
            });
          });
      },
      (error) => {
        console.log(error);
      }
    );
    // TODO: antes de salvar os campos, exibir, editar ou excluir campos selecionados
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
          let innerLayer = null;
          if (props.layer.layer) {
            innerLayer = props.layer.layer;
          } else {
            innerLayer = props.layer;
          }
          const infoCampo = {
            coordinates: innerLayer._latlngs[0],
            name: retorno.nomeCampo,
            user_id: this.authData ? this.authData.user_id : '0',
          };
          this.campoList.push(infoCampo);
          this.drawItems.addLayer(innerLayer);
          // SE CRIOU UM POLIGONO VALIDO, ENTÃO SETA O CONTROLE PRA MODO 3
          // VAI LIBERAR OS BOTÕES DE SALVAR E ADICIONAR
          this.authService.campoControl.next(3);
        }
      }
    });
    return await modal.present();
  }
}
