import { AuthService } from 'src/app/service/auth.service';
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs') tabRef: IonTabs;

  constructor(private actionSheetCtrl: ActionSheetController, private authService: AuthService) {}

  ionViewDidLoad() {
    console.log(this.tabRef);
    let tab = this.tabRef.getSelected();
    console.log(tab);
  }

  async addCampo() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Adicionar novo campo:',
      buttons: [
        {
          text: 'Selecionar um limite existente no mapa',
          icon: 'golf-outline',
          handler: () => {
            // retorna pro mapa e ativa a seleção de área que ja existe
            this.authService.campoControl.next(1);
          }
        },
        {
          text: 'Desenhar novos limites',
          icon: 'analytics-outline',
          handler: () => {
            // retorna pro mapa e ativa a opção de draw
            this.authService.campoControl.next(2);
          }
        }
      ]
    });
    await actionSheet.present();
  }

}
