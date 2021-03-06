import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { GraficaBarrasComponent } from '../grafica-barras/grafica-barras.component';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  private UsrLog:User
  public Fechas:string[]=[]
  private RitmoCardiacoPromedio:Number = 0
  private OxigenoPromedio:Number = 0
  private TemperaturaPromedio:Number = 0
  private VelocidadPromedio:Number = 0
  private DistanciaPromedio:Number = 0


  @ViewChild('GraficoBarras') private Graph:GraficaBarrasComponent;
  @ViewChild('Tabla') private table:TablaComponent;

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
        this.table.Fechas=result
        
        this.ValoresGrafica();
      },error =>{

      }
    );
  }

  private ValoresGrafica(){
    let RTC:any[]=[]
    let OX:any[]=[]
    let TMP:any[]=[]
    let VEL:any[]=[]
    let DIS:any[]=[]
    for (let i = 0; i < this.Fechas.length; i++) {
      this.RitmoCardiacoPromedio=0
      this.OxigenoPromedio=0
      this.TemperaturaPromedio=0
      this.VelocidadPromedio=0
      this.DistanciaPromedio=0
      let fecha=this.Fechas[i].replace(/\//gi,"_")
      this.Servicio.GetListadoMediciones(this.UsrLog.Username,fecha).subscribe(
        result=>{
          for (let j = 0; j < result.length; j++) {
            this.RitmoCardiacoPromedio = Number(this.RitmoCardiacoPromedio) + Number(result[j].RitmoCardiaco)
            this.OxigenoPromedio = Number(this.OxigenoPromedio) + Number(result[j].PulsoOxigeno)
            this.TemperaturaPromedio = Number(this.TemperaturaPromedio) + Number(result[j].Temperatura)
            if(result[j].Velocidad == null || result[j].Velocidad==undefined){
              this.VelocidadPromedio = Number(this.VelocidadPromedio) + 0
            }else{
              this.VelocidadPromedio = Number(this.VelocidadPromedio) + (Number(result[j].Velocidad)/100)
            }

            if(result[j].Distancia == null || result[j].Distancia==undefined){
              this.DistanciaPromedio = Number(this.DistanciaPromedio) + 0
            }else{
              this.DistanciaPromedio = Number(this.DistanciaPromedio) + (Number(result[j].Distancia)/100)
            }
            
          }

          this.RitmoCardiacoPromedio=Number(this.RitmoCardiacoPromedio)/result.length
          this.OxigenoPromedio=Number(this.OxigenoPromedio)/result.length
          this.TemperaturaPromedio=Number(this.TemperaturaPromedio)/result.length
          this.VelocidadPromedio=Number(this.VelocidadPromedio)/result.length
          this.DistanciaPromedio=Number(this.DistanciaPromedio)/result.length
          this.Graph.barChartLabels.push(this.Fechas[i])

          RTC.push(this.RitmoCardiacoPromedio)
          OX.push(this.OxigenoPromedio)
          TMP.push(this.TemperaturaPromedio)
          VEL.push(this.VelocidadPromedio)
          DIS.push(this.DistanciaPromedio)
          

          if(this.Fechas.length-1==i){
          console.log(RTC);
          console.log(OX);
          console.log(TMP);
          console.log(VEL);
          console.log(DIS);

            this.Graph.barChartData[0].data=RTC
            this.Graph.barChartData[1].data=OX
            this.Graph.barChartData[2].data=TMP
            this.Graph.barChartData[3].data=VEL
            this.Graph.barChartData[4].data=DIS
          }
        }
      );
    }
  }
}
