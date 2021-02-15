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

  constructor(private router: Router) {}

  ngOnInit() { 
    this.drawMap();
  }

  drawMap() {
    this.map = L.map('map').setView(['-21.3726284', '-45.5167047'], 17);
    // L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    //   attribution: 'cafe © LeafLet',
    // }).addTo(this.map);
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

    fetch("../../../assets/maps/UsoTresPontas.kml")
    .then(response => {
      return response.text();
    })
    .then(xml => {
      console.log(kml(new DOMParser().parseFromString(xml, "text/xml")));
      const result = kml(new DOMParser().parseFromString(xml, "text/xml"));
      L.geoJson(result).addTo(this.map);
    });
  }
}
