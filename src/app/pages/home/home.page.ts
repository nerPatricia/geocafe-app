import { CampoModalComponent } from '../../components/campo-modal/campo-modal';
import { AuthService } from 'src/app/service/auth.service';
import { Component, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { kml } from '@tmcw/togeojson';
import { LeafletDrawDirective } from '@asymmetrik/ngx-leaflet-draw';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  map: any;
  viewModeFlag = false;
  drawMessage = 'Posicione um ponto para demarcar uma área.'; // msg no header enquanto o desenho da área é feito
  campoControl = 0; // 0 - apenas exibição; 1 - seleção de campo; 2 - novo campo (draw)
  campoList = []; // lista de áreas de desenho completo
  // Layer base de mapa satélite
  sateliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    detectRetina: true,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '.....'
  });
  // Layer de dados geoJSON iniciada vazia
  kmlMaps = L.geoJSON(null, {});
  layersControl;
  // Objeto das opções iniciais do mapa
  // pode ser utilizado tbm como bind no input leafletLayers
  options = {
    layers: [ this.sateliteMap ],
    zoom: 14,
    center: L.latLng([ -21.3726284, -45.5167047 ])
  };
  // Objetos usados pra desenhar os campos e configurar labels
  drawItems: L.FeatureGroup = L.featureGroup();
  drawOptions;
  drawLocal = {
    draw: {
      toolbar: {
        actions: {
          title: 'Cancelar desenho',
          text: 'Cancelar'
        },
        finish: {
          title: 'Finalizar desenho',
          text: 'Finalizar'
        },
        undo: {
          title: 'Apagar último ponto desenhado',
          text: 'Apagar último ponto'
        },
        buttons: {
          polygon: 'Desenhe um poligono',
        }
      },
      handlers: {
        polygon: {
          tooltip: {
            start: 'Posicione o primeiro ponto da área.',
            cont: 'Posicione um ponto para continuar a demarcar uma área.',
            end: 'Toque no primeiro ponto para finalizar a área.'
          }
        },
        polyline: {
          error: '<strong>Atenção:<strong> você não pode fazer isso!'
        }
      }
    },
    edit: {
      toolbar: {
        actions: {
            save: {
                title: 'Salvar mudanças',
                text: 'Salvar'
            },
            cancel: {
                title: 'Cancelar edição, descarta todas as mudanças.',
                text: 'Cancelar'
            },
            clearAll: {
                title: 'Apaga todas as layers.',
                text: 'Apagar tudo'
            }
        },
        buttons: {
            edit: 'Editar áreas',
            editDisabled: 'Sem áreas para editar',
            remove: 'Apagar áreas',
            removeDisabled: 'Sem áreas para apagar'
        }
      },
      handlers: {
        edit: {
          tooltip: {
              text: 'Arraste as arestas ou marcadores para editar uma área.',
              subtext: 'Clique em cancelar para desfazer as mudanças.'
          }
        },
        remove: {
            tooltip: {
                text: 'Clique em uma área para remover.'
            }
        }
      }
    }
  };


  @ViewChild(LeafletDrawDirective)
  leafletDirective: LeafletDrawDirective;

  constructor(private authService: AuthService, private modalCtrl: ModalController) {
    authService.campoControl.subscribe(data => {
      this.campoControl = data;
      if (data == 2) {
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
    console.log('ON DRAW START: ', this.drawLocal.draw.handlers.polygon.tooltip.start);
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
      }
    };
  }

  ionViewDidEnter() {
    this.viewModeFlag =  true;
    this.invalidateSize();
  }

  // Transforma o KML de três pontas em geoJSON e adiciona na layer
  loadGeoJson() {
    fetch('../../../assets/maps/areaCafeeiraTresPontas.kml')
    .then(response => {
      return response.text();
    })
    .then(xml => {
      console.log(kml(new DOMParser().parseFromString(xml, 'text/xml')));
      const result = kml(new DOMParser().parseFromString(xml, 'text/xml'));
      this.kmlMaps.addData(result);
    });
  }

  public onDrawCreated(e: any) {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const polygonCoordinates = layer._latlngs;
      this.drawMessage = 'Você pode adicionar mais áreas.';
      // this.campoList.push(polygonCoordinates);
      this.presentModal('center-modal', { type: 'nomeCampoSelecionado', layer, campoList: this.campoList });

      console.log('ON DRAW CREATE: Você pode adicionar mais áreas.');
      console.log(polygonCoordinates);
    }
    // this.drawItems.addLayer(e.layer); // isso aqui q adiciona o desenho na layer
    // this.drawItems.addLayer((e as L.DrawEvents.Created).layer);
  }

  // TODO: verificar se vale a pena mesmo manter isso daqui
  // já que as unicas opções de ficaram foi editar poligono e apagar tudo
  setDrawOption() {
    this.drawOptions = {
      position: 'topright',
      draw: {
        // polygon: {
        //   allowIntersection: false, // Restricts shapes to simple polygons
        //   drawError: {
        //     color: '#e1e100', // Color the shape will turn when intersects
        //     message: '<strong>Atenção:<strong> você não pode fazer isso!' // Message that will show when intersect
        //   },
        //   shapeOptions: {
        //     color: '#cefc3d'
        //   }
        // },
        polygon: false,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawItems
      }
    };
  }

  next() {
   
  }

  async presentModal(cssClass = 'default', props?: any) {
    const modal = await this.modalCtrl.create({
      component: CampoModalComponent,
      cssClass,
      componentProps: { props },
      // componentProps: {
      //   campoList: this.campoList,
      //   map: this.map,
      //   layersControl: this.layersControl
      // },
      backdropDismiss: false
    });
    return await modal.present();
  }
}
