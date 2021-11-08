import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage {
  constructor(
    private authService: AuthService,
    private router: Router,
    public alertController: AlertController
  ) {
    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.event = this.router.getCurrentNavigation().extras.state.event;
    //   }
    // });
  }

  async infosModal() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: 'Informações do Projeto',
      message: 'Esse aplicativo foi desenvolvido em parceria entre a Universidade Federal de Itajubá - '
        + 'Instituto de Matemática e Computação (IMC - UNIFEI) com a Empresa de Pesquisa Agropecuária de Minas Gerais (EPAMIG).<br><br>'
        + '<b>É um produto acadêmico e não comercial.</b><br><br>'
        + 'Os valores de potencial hídrico apresentados são resultado de um modelo baseado em imagens do satélite Landsat 8.'
        + 'Detalhes sobre o modelo podem ser vistos em: <i>Maciel DA, Silva VA, Alves HMR, Volpato MML, Barbosa JPRAd, Souza VCOd, et al. (2020)</i>'
        + '<b>Leaf water potential of coffee estimated by landsat-8 images.</b> <i>PLoS ONE 15(3): e0230013.</i>'
        + '<a>https://doi.org/10.1371/journal.pone.0230013</a>. Os modelos foram gerados na plataforma online Google Earth Engine.<br><br>'
        + 'O modelo pode sofrer interferências quando há presença de nuvens, nebulosidade e sombra de nuvens nas imagens.'
        + 'Os valores apresentados representam uma estimativa do potencial hídrico e não o valor <i>in-loco</i> medido na planta.<br><br>'
        + 'As áreas de café delineadas são do mapeamento de 2018 (<a>http://portaldocafedeminas.emater.mg.gov.br</a>)',
      buttons: ['OK']
    });

    await alert.present();
  }

  async logout() {
    await this.authService.deleteAuthData();
    this.router.navigateByUrl('/');
  }
}
