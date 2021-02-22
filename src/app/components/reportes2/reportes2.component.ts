import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mediciones } from 'src/app/Model/Mediciones';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { GraficasComponent } from '../graficas/graficas.component';

@Component({
  selector: 'app-reportes2',
  templateUrl: './reportes2.component.html',
  styleUrls: ['./reportes2.component.css']
})
export class Reportes2Component implements OnInit {

  private UsrLog:User
  private UsrNameView:string

  public RitmoCardiacoPromedio:number=0
  public TemperaturaValue={
    Promedio:0,
    Maxima:0,
    Minima:0
  }
  public OxigenoPromedio:number=0

  constructor(private router:ActivatedRoute,private navigate:Router,private servicios:ServiciosService) {
    this.UsrLog=JSON.parse(sessionStorage.getItem("UsrLog"))
    if(this.UsrLog==null){
      this.navigate.navigate(["Login"])
    }else if(this.UsrLog.Rol=="A"){
      this.navigate.navigate(["Login"])
    }
    this.UsrNameView=sessionStorage.getItem("USER_VIEW")
    this.BotonPresionado="RitmoCardiaco"
  }
  @ViewChild('Grafica') private Graph:GraficasComponent;
  public datosY:any[]=[]
  public LabelsX:any[]=[]
  private BotonPresionado:String=""

  private ListadoMediciones:Mediciones[]=[]

  ngOnInit():void  {
    console.log(this.router.snapshot.routeConfig.path);
    
    setTimeout(()=>{this.RitmoCardiaco(0)}, 500)

    let Fecha=this.router.snapshot.paramMap.get("Fecha")
    console.log(Fecha);
    
    if(Fecha!=null){
      this.servicios.GetListadoMediciones(this.UsrNameView,Fecha).subscribe(
        result =>{
          this.ListadoMediciones=result
          for (let i = 0; i < result.length; i++) {
            this.datosY[i]=result[i].RitmoCardiaco
            this.LabelsX[i]=i.toString()
          }
        },error =>{
          console.log("Error")
        }
      );
    }else{//Grafica en vivo
      //let datenow:Date=new Date()
      //let day=datenow.getDate()<10?`0${datenow.getDate().toString()}`:`${datenow.getDate().toString()}`
      //let month=datenow.getMonth()+1<10?`0${(datenow.getMonth()+1).toString()}`:`${(datenow.getMonth()+1).toString()}`
      var FechaLive=sessionStorage.getItem("FECHA_LIVE")//day+"_"+month+"_"+datenow.getFullYear().toString()
      
      this.servicios.GetUltimoInicioSesion().subscribe(
        result=>{
          if(FechaLive!=String(result.Fecha)){
            FechaLive=String(result.Fecha)
            sessionStorage.setItem("FECHA_LIVE",result.Fecha.toString())
          }
        },error=>{

        }
      );
      var Interval=setInterval(()=>{
        
        this.servicios.GetListadoMediciones(this.UsrNameView,FechaLive).subscribe(
          result=>{
            this.ListadoMediciones=result
            if(this.BotonPresionado=="Temperatura"){
              for (let i = 0; i < result.length; i++) {
                this.datosY[i]=result[i].Temperatura
                this.LabelsX[i]=i.toString()
              }
            }
            if(this.BotonPresionado=="Oxigeno"){
              for (let i = 0; i < result.length; i++) {
                this.datosY[i]=result[i].PulsoOxigeno
                this.LabelsX[i]=i.toString()
              }
            }
            if(this.BotonPresionado=="RitmoCardiaco"){
              for (let i = 0; i < result.length; i++) {
                this.datosY[i]=result[i].RitmoCardiaco
                this.LabelsX[i]=i.toString()
              }
            }
          },error=>{
            console.log("Error")
          }
        );
        
        //Detener ciclo
        if(this.navigate.url!="/Historia/Coach/Live"){
          clearInterval(Interval)
          console.log("End Interval");
        } 
      },500);
    }
  }

  public Seleccionar(btn:number){
    let Boton = document.getElementsByClassName("Button")[btn]
    Boton.setAttribute("class","Button active")
    let Nbtn:number = document.getElementsByClassName("Button").length
    for (let index = 0; index < Nbtn; index++) {
      if(index!=btn){
        document.getElementsByClassName("Button")[index].setAttribute("class","Button")
      }
    }
    this.Graph.lineChartData[0].data=this.datosY
    this.Graph.lineChartLabels=this.LabelsX
  }

  public RitmoCardiaco(btn:number){
    this.Graph.lineChartData[0].label="Ritmo Cardiaco"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    for (let i = 0; i < this.ListadoMediciones.length; i++) {
      this.datosY[i]=this.ListadoMediciones[i].RitmoCardiaco
      this.LabelsX[i]=i.toString()
    }
    this.BotonPresionado="RitmoCardiaco"
    let div= document.getElementsByClassName("RitmoCardiaco")[0] as HTMLDivElement
    div.style.visibility="visible"
    let div2= document.getElementsByClassName("Oxigeno")[0] as HTMLDivElement
    div2.style.visibility="hidden"
    let div3= document.getElementsByClassName("Temperatura")[0] as HTMLDivElement
    div3.style.visibility="hidden"
    this.RitmoCardiacoPromedio=Number(this.Promedio(this.datosY))
  }

  public TemperaturaCorporal(btn:number){
    this.Graph.lineChartData[0].label="Temperatura Corporal"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    for (let i = 0; i < this.ListadoMediciones.length; i++) {
      this.datosY[i]=this.ListadoMediciones[i].Temperatura
      this.LabelsX[i]=i.toString()
    }
    this.BotonPresionado="Temperatura"
    let div= document.getElementsByClassName("RitmoCardiaco")[0] as HTMLDivElement
    div.style.visibility="hidden"
    let div2= document.getElementsByClassName("Oxigeno")[0] as HTMLDivElement
    div2.style.visibility="hidden"
    let div3= document.getElementsByClassName("Temperatura")[0] as HTMLDivElement
    div3.style.visibility="visible"
    this.TemperaturaValue.Promedio=Number(this.Promedio(this.datosY))
    this.TemperaturaValue.Maxima=Number(this.Maximo(this.datosY))
    this.TemperaturaValue.Minima=Number(this.Minimo(this.datosY,this.TemperaturaValue.Maxima))
  }

  public ExigenoEnSangre(btn:number){
    this.Graph.lineChartData[0].label="Oxigeno en Sangre"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    for (let i = 0; i < this.ListadoMediciones.length; i++) {
      this.datosY[i]=this.ListadoMediciones[i].PulsoOxigeno
      this.LabelsX[i]=i.toString()
    }
    this.BotonPresionado="Oxigeno"
    let div= document.getElementsByClassName("RitmoCardiaco")[0] as HTMLDivElement
    div.style.visibility="hidden"
    let div2= document.getElementsByClassName("Oxigeno")[0] as HTMLDivElement
    div2.style.visibility="visible"
    let div3= document.getElementsByClassName("Temperatura")[0] as HTMLDivElement
    div3.style.visibility="hidden"
    this.OxigenoPromedio=Number(this.Promedio(this.datosY))
  }

  public Promedio(Listado:any[]):Number{
    let promedio=0
    for (let i = 0; i < Listado.length; i++) {
      promedio = Listado[i] + promedio
    }
    promedio=promedio/Listado.length
    return promedio
  }

  public Maximo(Listado:any[]):Number{
    let Maximo=0;
    for (let i = 0; i < Listado.length; i++) {
      if(Maximo<Listado[i]){
        Maximo=Listado[i]
      }
    }
    return Maximo
  }

  public Minimo(Listado:any[],Maximo:number):Number{
    let Minimo=Maximo;
    for (let i = 0; i < Listado.length; i++) {
      if(Minimo>Listado[i]){
        Minimo=Listado[i]
      }
    }
    return Minimo
  }

}
