import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs') tabRef: IonTabs;

  constructor() {}

  ionViewDidLoad() {
    console.log(this.tabRef);
    let tab = this.tabRef.getSelected();
    console.log(tab);
  }

}
