import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-campo-modal',
  templateUrl: 'campo-modal.html',
  styleUrls: ['campo-modal.scss']
})
export class CampoModalComponent {
  @Input() props: any;
  nomeCampo = new FormControl(null, [Validators.required]);

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ionViewDidEnter() {
    if (this.props.campoList) {
      this.nomeCampo.setValue('Campo ' + (this.props.campoList.length + 1));
    }
  }

  cancel() {
    this.modalCtrl.dismiss({ addCampo: false });
  }

  add() {
    this.modalCtrl.dismiss({ addCampo: true, nomeCampo: this.nomeCampo.value });
  }
}
