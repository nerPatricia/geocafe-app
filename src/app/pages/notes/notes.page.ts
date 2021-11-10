import { LoadingService } from 'src/app/service/loading.service';
import { NoteService } from './../../service/note.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Component } from '@angular/core';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { NoteModalComponent } from 'src/app/components/note-modal/note-modal';

@Component({
  selector: 'app-notes',
  templateUrl: 'notes.page.html',
  styleUrls: ['notes.page.scss'],
})
export class NotesPage {
  authData: any = {};
  notesData: any = [];

  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private noteService: NoteService,
    private modalCtrl: ModalController,
    private loading: LoadingService
  ) {}

  ionViewDidEnter() {
    this.authService.getAuthData().then((data: any) => {
      this.authData = data;
      console.log(this.authData);
      this.getNotes(data.user_id);
    }, error => {
      console.log(error);
    });
  }

  getNotes(userId) {
    this.loading.present();
    this.noteService.getAllNotesByUser(userId).then(
      (response: any) => {
        this.notesData = response.data;
        this.loading.dismiss();
      }, error => {
        console.log(error);
        this.loading.dismiss();
      }
    );
  }

  addNote() {
    this.router.navigateByUrl('/home/tabs/field-note');
  }

  async editNoteModal(props) {
    console.log(props);
    const modal = await this.modalCtrl.create({
      component: NoteModalComponent,
      cssClass: 'note-center-modal',
      componentProps: {props}
    });

    modal.onDidDismiss().then((response: any) => {
      if (response) {
        if (response.data) {
          const sendData = {
            field_id: props.field_id,
            note_id: props.noteId,
            note: response.data.textNote
          };
          this.noteService.editNote(sendData).then(
            (response: any) => {
              this.ionViewDidEnter();
            }, error => {
              console.log(error);
            }
          );
        }
      }
    });

    return await modal.present();
  }

  deleteNote(props) {
    this.noteService.deleteNote(props).then(
      (response: any) => {
        this.notesData = [];
        this.ionViewDidEnter();
      }, error => {
        console.log(error);
      }
    );
  }

  async noteOptions(note, text) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções da nota:',
      buttons: [
        {
          text: 'Editar nota',
          icon: 'create-outline',
          handler: async () => {
            this.editNoteModal({field_id: note.id, name: note.name, noteId: text.id, noteText: text.text});
          }
        },
        {
          text: 'Apagar nota',
          icon: 'trash-outline',
          handler: async () => {
            swal
              .fire({
                title: 'Apagar nota',
                text: 'Deseja mesmo apagar a nota selecionada? Essa ação não pode ser revertida.',
                showDenyButton: true,
                confirmButtonText: 'Confirmar',
                denyButtonText: 'Cancelar',
              })
              .then((result) => {
                if (result.isConfirmed) {
                  this.deleteNote({fieldId: note.id, noteId: text.id});
                }
              });
          },
        }
      ],
    });
    await actionSheet.present();
  }
}
