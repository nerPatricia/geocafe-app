import { FieldService } from './../../service/field.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-date-modal',
  templateUrl: 'select-date-modal.html',
  styleUrls: ['select-date-modal.scss']
})
export class SelectDateModalComponent {
  @Input() props: any;
  datasMapasGeoTiff: [];
  selectedDate: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private fieldService: FieldService
  ) {
    this.getDateMaps();
  }

  ionViewDidEnter() {}

  getDateMaps() {
    this.fieldService.getDateOfGenerateMaps().then(
      (response: any) => {
        this.datasMapasGeoTiff = response.data.dates;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveEventDetails(event) {
    this.selectedDate = event;
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  add() {
    this.modalCtrl.dismiss({ event: this.selectedDate });
  }
}
