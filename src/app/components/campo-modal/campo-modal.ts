import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-campo-modal',
  templateUrl: 'campo-modal.html',
  styleUrls: ['campo-modal.scss']
})
export class CampoModalComponent {
   @Input() campoList = [];

  constructor(
    public navCtrl: NavController,
    private router: Router,
  ) {}

  goToPerfil() {
    this.router.navigateByUrl('/user-detail');
  }
}
