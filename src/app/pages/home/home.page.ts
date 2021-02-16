import { AuthService } from 'src/app/service/auth.service';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { kml } from "@tmcw/togeojson";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  map: any;
  viewModeFlag = false;
  campoControl = 0 // 0 - apenas exibição; 1 - seleção de campo; 2 - novo campo (draw)
  // Layer base de mapa satélite
  sateliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    detectRetina: true,
    subdomains:['mt0','mt1','mt2','mt3'],
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
  };;
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
            start: 'Clique para começar a desenhar uma área.',
            cont: 'Clique para continuar a desenhar uma área.',
            end: 'Clique no primeiro ponto para finalizar a área.'
          }
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

  constructor(private authService: AuthService) {
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
        this.map.invalidateSize(true)
      }, 0);
    }
  }

  onMapReady(map) {
    this.map = map;
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
    fetch("../../../assets/maps/UsoTresPontas.kml")
    .then(response => {
      return response.text();
    })
    .then(xml => {
      console.log(kml(new DOMParser().parseFromString(xml, "text/xml")));
      const result = kml(new DOMParser().parseFromString(xml, "text/xml"));
      this.kmlMaps.addData(result);
    });
  }

  public onDrawCreated(e: any) {
    const { layerType, layer } = e;
		if (layerType === "polygon") {
			const polygonCoordinates = layer._latlngs;
			console.log(polygonCoordinates);
		}
		this.drawItems.addLayer(e.layer);
    // this.drawItems.addLayer((e as L.DrawEvents.Created).layer);
  }

  setDrawOption() {
    this.drawOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Atenção:<strong> você não pode fazer isso!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#cefc3d'
          }
        },
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
}
