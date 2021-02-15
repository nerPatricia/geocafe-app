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
  mapErrorFlag = true;
  campoControl = 0 // 0 - apenas exibição; 1 - seleção de campo; 2 - novo campo (draw)
  // Layer base de mapa satélite
  sateliteMap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    detectRetina: true,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '.....'
  });
  // Layer de dados geoJSON iniciada vazia
  kmlMaps = L.geoJSON(null, {});
  layersControl;
  options;
  // Objetos usados pra desenhar os campos
  drawItems: L.FeatureGroup = L.featureGroup();
  drawOptions;

  constructor(private authService: AuthService) {
    authService.campoControl.subscribe(data => {
      this.campoControl = data;
      if (data == 2) {
        this.setDrawOption();
      }
    })
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

    // Objeto das opções iniciais do mapa
    // pode ser utilizado tbm como bind no input leafletLayers
    this.options = {
      layers: [ this.sateliteMap ],
      zoom: 14,
      center: L.latLng([ -21.3726284, -45.5167047 ])
    };
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
    this.drawItems.addLayer((e as L.DrawEvents.Created).layer);
  }

  setDrawOption() {
    this.drawOptions = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
              color: '#f357a1',
              weight: 10
          }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
      },
      edit: {
        featureGroup: this.drawItems
      }
    };
  }
}
