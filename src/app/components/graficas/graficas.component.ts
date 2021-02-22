import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'
import {Color,BaseChartDirective,Label} from 'ng2-charts'

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit{
  ngOnInit(): void {
  }

  @Input() Datos:any[]  = []
  @Input() Labels:any[] = []

  public ActualizarDatos(){
    console.log(this.Datos);
    console.log(this.Labels);
  }

  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' }
  ];
  public lineChartLabels: Label[] = [];
 
  public lineChartOptions: any = {
    responsive: true,
  };

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];
}
