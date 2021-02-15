import { LoadingService } from './../../service/loading.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { kml } from "@tmcw/togeojson";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  mapErrorFlag = true;
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

  constructor(private router: Router, private loading: LoadingService) {}

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
    // this.map.on('click', this.onMapClick);
  }

  // onMapClick(e) {
  //   console.log(e);
  //   const popup = L.popup();
  //   popup.openOn(this.map);
  //   popup
  //       .setLatLng(e.latlng)
  //       .setContent("You clicked the map at " + e.latlng.toString())
  //       .openOn(this.map);
  // }

    // onMapReady(map) {
    //   map.fitBounds(this.route.getBounds(), {
    //     padding: L.point(24, 24),
    //     maxZoom: 12,
    //     animate: true
    //   });
    // }

      // Marker for the top of Mt. Ranier
      // this.summit = L.marker([ 46.8523, -121.7603 ], {
      //   icon: L.icon({
      //     iconSize: [ 25, 41 ],
      //     iconAnchor: [ 13, 41 ],
      //     iconUrl: 'leaflet/marker-icon.png',
      //     iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      //     shadowUrl: 'leaflet/marker-shadow.png'
      //   })
      // });
  
      // // Marker for the parking lot at the base of Mt. Ranier trails
      // this.paradise = L.marker([ 46.78465227596462,-121.74141269177198 ], {
      //   icon: L.icon({
      //     iconSize: [ 25, 41 ],
      //     iconAnchor: [ 13, 41 ],
      //     iconUrl: 'leaflet/marker-icon.png',
      //     shadowUrl: 'leaflet/marker-shadow.png'
      //   })
      // });
  
      // // Path from paradise to summit - most points omitted from this example for brevity
      // this.route = L.polyline([[ 46.78465227596462,-121.74141269177198 ],
      //   [ 46.80047278292477, -121.73470708541572 ],
      //   [ 46.815471360459924, -121.72521826811135 ],
      //   [ 46.8360239546746, -121.7323131300509 ],
      //   [ 46.844306448474526, -121.73327445052564 ],
      //   [ 46.84979408048093, -121.74325201660395 ],
      //   [ 46.853193528950214, -121.74823296256363 ],
      //   [ 46.85322881676257, -121.74843915738165 ],
      //   [ 46.85119913890958, -121.7519719619304 ],
      //   [ 46.85103829018772, -121.7542376741767 ],
      //   [ 46.85101557523012, -121.75431755371392 ],
      //   [ 46.85140013694763, -121.75727385096252 ],
      //   [ 46.8525277543813, -121.75995212048292 ],
      //   [ 46.85290292836726, -121.76049157977104 ],
      //   [ 46.8528160918504, -121.76042997278273 ]]);
}
