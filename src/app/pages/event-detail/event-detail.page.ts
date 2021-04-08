import { Component } from '@angular/core';
// import * as Leaflet from 'leaflet';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// import { ActivatedRoute, Router } from '@angular/router';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-detail',
  templateUrl: 'event-detail.page.html',
  styleUrls: ['event-detail.page.scss'],
})
export class EventDetailPage {
//   map: Leaflet.Map;
//   watchLocalization: any;

//   event: any = {};
//   mapErrorFlag = false;

//   constructor(
//     private nativeGeocoder: NativeGeocoder, 
//     private route: ActivatedRoute, 
//     private router: Router,
//   ) {
//     this.route.queryParams.subscribe(params => {
//       if (this.router.getCurrentNavigation().extras.state) {
//         this.event = this.router.getCurrentNavigation().extras.state.event;
//       }
//     });
//   }

//   ionViewDidEnter() { 
//     this.getEventLocalization();
//   }

//   getEventLocalization() {
//     let options: NativeGeocoderOptions = {
//       useLocale: true,
//       maxResults: 5
//     };
  
//   this.nativeGeocoder.forwardGeocode(this.event.address, options)
//     .then((result: NativeGeocoderResult[]) => {
//       this.leafletMap(result[0].latitude,  result[0].longitude);
//     }).catch(
//       (error: any) => {
//         console.log(error);
//         this.mapErrorFlag = true;
//     });
//   }

//   getLocalization() {
    
//   }

//   leafletMap(latitude, longitude) {
//     let icon = Leaflet.icon({
//       iconUrl: '../../assets/icon/favicon.png',
    
//       iconSize:     [38, 95], // size of the icon
//       shadowSize:   [50, 64], // size of the shadow
//       iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//       shadowAnchor: [4, 62],  // the same for the shadow
//       popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
//     });

//     this.map = Leaflet.map('mapId').setView([latitude, longitude], 13);
//     Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//       attribution: 'eventex © LeafLet',
//     }).addTo(this.map);

//     const markPoint = Leaflet.marker([latitude, longitude], { icon: icon });
//     markPoint.bindPopup('<p>Super Lógica Experience</p>');
//     this.map.addLayer(markPoint);
//   }

//   schedule() {
//     this.eventService.schedule(this.event.id).then(
//       (response)=> {
//         Swal.fire({
//           title: 'Sucesso',
//           text: 'Evento agendado com sucesso e foi adicionado ao seu perfil.',
//           icon: 'success',
//           confirmButtonText: 'OK'
//         }).then(() => {
//           this.router.navigateByUrl('/home');
//         });
//       }, error => {
//         console.log(error);
//       }
//     )
//   }

//   ngOnDestroy() {
//     if (this.map) {
//       this.map.remove();
//     }
//   }
}
