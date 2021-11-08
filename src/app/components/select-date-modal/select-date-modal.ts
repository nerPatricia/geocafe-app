import { ToastService } from './../../service/toast.service';
import { FieldService } from './../../service/field.service';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-date-modal',
  templateUrl: 'select-date-modal.html',
  styleUrls: ['select-date-modal.scss']
})
export class SelectDateModalComponent {
  @Input() props: any;
  datasMapasGeoTiff: [];
  selectedDate: any = null;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private fieldService: FieldService,
    private toastService: ToastService
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
    if (!this.selectedDate) {
      this.toastService.present({ message: 'Selecione uma data para continuar' });
    } else {
      this.modalCtrl.dismiss({ event: this.selectedDate });
    }
  }
}
