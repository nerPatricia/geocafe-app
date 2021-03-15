import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  ) {}

  ionViewDidEnter() {
    if (this.props.campoList) {
      this.nomeCampo.setValue('Campo ' + this.props.campoList.length + 1);
    }
  }

  add() {
    console.log(this.props);
  }
}
