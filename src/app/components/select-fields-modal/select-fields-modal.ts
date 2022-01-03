import { ToastService } from '../../service/toast.service';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-fields-modal',
  templateUrl: 'select-fields-modal.html',
  styleUrls: ['select-fields-modal.scss']
})
export class SelectFieldsModalComponent {
  @Input() props: any;
  selectedField: any = null;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {}

  ionViewDidEnter() {
    console.log(this.props);
  }

  saveEventDetails(event) {
    this.selectedField = event.detail.value;
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  add() {
    if (!this.selectedField) {
      this.toastService.present({ message: 'Selecione um campo para continuar.' });
    } else {
      this.modalCtrl.dismiss({ event: this.selectedField.geometry.coordinates[0][0]});
    }
  }
}
