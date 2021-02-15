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
  map: L.Map;
  watchLocalization: any;
  mapErrorFlag = true;

  constructor(private router: Router, private loading: LoadingService) {}

  ngOnInit() { 
    this.drawMap();
  }

  drawMap() {
    // cria o mapa e seta a visão para a cidade de três pontas
    this.map = L.map('map').setView(['-21.3726284', '-45.5167047'], 17);
    // adiciona visualização do mapa por satélite
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

    // transforma o kml de três pontas em geoJSON e adiciona no mapa
    fetch("../../../assets/maps/UsoTresPontas.kml")
    .then(response => {
      return response.text();
    })
    .then(xml => {
      console.log(kml(new DOMParser().parseFromString(xml, "text/xml")));
      const result = kml(new DOMParser().parseFromString(xml, "text/xml"));
      L.geoJson(result).addTo(this.map);
      // L.geoJson(result).addTo(this.map).bindPopup("I am a circle.");
    });

    this.map.on('click', this.onMapClick);
  }

  onMapClick(e) {
    console.log(e);
    const popup = L.popup();
    popup.openOn(this.map);
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
  }

  highlightFeature(e) {
    console.log(e);
    var info = L.control();
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }


}
