import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-legend-info-modal',
  templateUrl: 'legend-info-modal.html',
  styleUrls: ['legend-info-modal.scss']
})
export class LegendInfoModalComponent {
  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
