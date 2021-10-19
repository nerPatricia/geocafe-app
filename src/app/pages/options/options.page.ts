import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.event = this.router.getCurrentNavigation().extras.state.event;
    //   }
    // });
  }

  async logout() {
    await this.authService.deleteAuthData();
    this.router.navigateByUrl('/');
  }

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

//   ngOnDestroy() {
//     if (this.map) {
//       this.map.remove();
//     }
//   }
}
