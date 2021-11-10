import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  url = environment.url;

  constructor(public http: HttpClient) {}

  saveNote(noteData) {
    const url = this.url + 'note';
    return this.http.post(url, noteData).toPromise();
  }

  editNote(noteData) {
    const url = this.url + 'note';
    return this.http.put(url, noteData).toPromise();
  }

  deleteNote(deleteData) {
    const url = this.url + 'note/' + deleteData.fieldId + '/' + deleteData.noteId;
    return this.http.delete(url).toPromise();
  }

  getAllNotesByUser(userId) {
    const url = this.url + 'note/?user_id=' + userId;
    return this.http.get(url).toPromise();
  }
}
