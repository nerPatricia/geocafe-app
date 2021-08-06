import { Router } from '@angular/router';
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
  campoControl = 0; // 0 - apenas exibição; 1 - seleção de campo; 2 - novo campo (draw); 3 - adicionou um campo valido

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router
  ) {
    // this.authService.campoControl.subscribe((data) => {
    //   this.campoControl = data;
    // });
  }

  ionViewDidLoad() {
    console.log(this.tabRef);
    const tab = this.tabRef.getSelected();
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
            this.campoControl = 1;
          }
        },
        {
          text: 'Desenhar novos limites',
          icon: 'analytics-outline',
          handler: () => {
            // retorna pro mapa e ativa a opção de draw
            this.authService.campoControl.next(2);
            this.campoControl = 2;
          }
        }
      ]
    });
    await actionSheet.present();
  }

  closeAddCampo() {
    console.log('CLOSE ADD CAMPO NO TAB COMPONENT');
    this.authService.campoControl.next(0);
    this.campoControl = 0;
    // TODO: quando fechar a adição de campo,
    // se não salvou o campo, apagar desenho do mapa
  }

  logout() {
    this.router.navigateByUrl('/');
  }

}
