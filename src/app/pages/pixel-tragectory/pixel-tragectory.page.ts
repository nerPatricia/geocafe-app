import { FieldService } from './../../service/field.service';
import { MapService } from './../../service/map.service';
import {
  AlertController,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { Chart } from 'angular-highcharts';
import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-pixel-tragectory',
  templateUrl: 'pixel-tragectory.page.html',
  styleUrls: ['pixel-tragectory.page.scss'],
})
export class PixelTragectoryPage implements OnInit {
  public latLong: any = {};
  mesesPixel = [];
  valuesPixel = [];
  chart = new Chart({} as any);

  constructor(
    private mapService: MapService,
    private fieldService: FieldService,
    public alertController: AlertController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private screenOrientation: ScreenOrientation
  ) {
    this.latLong = this.navParams.get('latLong');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.getPixelValues();
  }

  ngOnInit() {}

  getDateRasterMaps() {
    this.fieldService.getDateOfGenerateMaps().then(
      (response: any) => {
        return response.data.dates;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPixelValues() {
    this.mapService
      .getPixelTragectory(this.latLong.lat, this.latLong.long)
      .then(
        (response: any) => {
          response.data.forEach(element => {
            this.mesesPixel.push(element.date);
            this.valuesPixel.push(element.value);
          });
          this.gerarGrafico();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  gerarGrafico() {
    this.chart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        text: `lat: ${this.latLong.lat}, long: ${this.latLong.long}`,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      xAxis: {
        categories: this.mesesPixel,
      },
      series: [
        {
          name: 'Pixel Selecionado',
          data: this.valuesPixel,
        },
      ],
    } as any);
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
