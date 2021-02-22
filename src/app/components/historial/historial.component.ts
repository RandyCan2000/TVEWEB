import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { GraficaBarrasComponent } from '../grafica-barras/grafica-barras.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  private UsrLog:User
  public Fechas:string[]=[]
  private RitmoCardiacoPromedio:Number=0
  private OxigenoPromedio:Number=0
  private TemperaturaPromedio:Number=0



  @ViewChild('GraficoBarras') private Graph:GraficaBarrasComponent;

  constructor(private Servicio:ServiciosService,private route:Router) {
    this.UsrLog=JSON.parse(sessionStorage.getItem("UsrLog"))
    if(this.UsrLog==null){
      this.route.navigate(["Login"])
    }
  }

  ngOnInit(): void {
    this.Servicio.GetFechaUser(this.UsrLog.Username).subscribe(
      result =>{
        for (let i = 0; i < result.length; i++) {
          result[i]=result[i].replace(/_/gi,"/")
        }
        this.Fechas=result
        console.log(this.Fechas);
        
        this.ValoresGrafica();
      },error =>{

      }
    );
  }

  private ValoresGrafica(){
    let RTC:any[]=[]
    let OX:any[]=[]
    let TMP:any[]=[]
    for (let i = 0; i < this.Fechas.length; i++) {
      let fecha=this.Fechas[i].replace(/\//gi,"_")
      this.Servicio.GetListadoMediciones(this.UsrLog.Username,fecha).subscribe(
        result=>{
          
          
          this.RitmoCardiacoPromedio=0
          this.OxigenoPromedio=0
          this.TemperaturaPromedio=0
          for (let j = 0; j < result.length; j++) {
            this.RitmoCardiacoPromedio = Number(this.RitmoCardiacoPromedio) + Number(result[j].RitmoCardiaco)
            this.OxigenoPromedio = Number(this.OxigenoPromedio) + Number(result[j].PulsoOxigeno)
            this.TemperaturaPromedio = Number(this.TemperaturaPromedio) + Number(result[j].Temperatura)
          }

          this.RitmoCardiacoPromedio=Number(this.RitmoCardiacoPromedio)/result.length
          this.OxigenoPromedio=Number(this.OxigenoPromedio)/result.length
          this.TemperaturaPromedio=Number(this.TemperaturaPromedio)/result.length
          this.Graph.barChartLabels.push(this.Fechas[i])

          RTC.push(this.RitmoCardiacoPromedio)
          OX.push(this.OxigenoPromedio)
          TMP.push(this.TemperaturaPromedio)

          console.log(RTC);
          console.log(OX);
          console.log(TMP);
          
          if(this.Fechas.length-1==i){
            this.Graph.barChartData[0].data=RTC
            this.Graph.barChartData[1].data=OX
            this.Graph.barChartData[2].data=TMP
            //this.Graph.barChartData.push({ data: RTC, label: 'Ritmo Cardiaco' })
           // this.Graph.barChartData.push({ data: OX, label: 'Oxigeno' })
           //this.Graph.barChartData.push({ data: TMP, label: 'Temperatura' })
            console.log(this.Graph.barChartData);
          }
        }
      );
    }
  }

  public VerHistoria(Fecha:String){
    Fecha=Fecha.replace(/\//gi,"_");
    this.route.navigate(["Graficas","Day",Fecha])
  }


}
