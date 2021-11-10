import { FormControl, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-note-modal',
  templateUrl: 'note-modal.html',
  styleUrls: ['note-modal.scss'],
})
export class NoteModalComponent {
  @Input() props: any;
  note = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ionViewDidEnter() {
    if (this.props.noteId) {
      this.note.setValue(this.props.noteText);
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  add() {
    if (this.props.noteId) {
      this.modalCtrl.dismiss({ textNote: this.note.value });
    } else {
      this.modalCtrl.dismiss({ field_id: this.props.id, note: this.note.value });
    }
  }
}
