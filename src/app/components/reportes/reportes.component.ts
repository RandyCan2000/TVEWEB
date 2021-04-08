import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mediciones } from 'src/app/Model/Mediciones';
import { TestUser } from 'src/app/Model/TestUsers';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { GraficasComponent } from '../graficas/graficas.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  private UsrLog:User
  private UsrNameView:String

  public RitmoCardiacoPromedio:number=0
  public TemperaturaValue={
    Promedio:0,
    Maxima:0,
    Minima:0
  }
  public OxigenoPromedio:number=0
  public VelocidadValue={
    Promedio:0,
    Maxima:0,
    Minima:0
  }
  public Repeticion_Fecha = []

  private Repeticion = 'All'

  public StatusTestUser:TestUser[]= []

  public Status_count:number=0

  @ViewChild('Grafica') private Graph:GraficasComponent;
  public datosY:any[]=[]
  public LabelsX:any[]=[]
  private BotonPresionado:String=""

  private ListadoMediciones:Mediciones[]=[]

  constructor(private router:ActivatedRoute,private navigate:Router,private servicios:ServiciosService) {
    this.UsrLog=JSON.parse(sessionStorage.getItem("UsrLog"))
    if(this.UsrLog==null){
      this.navigate.navigate(["Login"])
    }
    this.BotonPresionado="RitmoCardiaco"
  }

  ngOnInit():void  {
    setTimeout(()=>{this.RitmoCardiaco(0)}, 500)

    if(this.UsrLog.Rol == 'C'){
      let sesionUserView = sessionStorage.getItem("USER_VIEW")
      if(sesionUserView == null || sesionUserView == undefined){
        this.UsrNameView = this.UsrLog.Username
      }else{
        this.UsrNameView = sessionStorage.getItem("USER_VIEW")
        sessionStorage.removeItem("USER_VIEW")
      }
    }else if(this.UsrLog.Rol == 'A'){
      this.UsrNameView = this.UsrLog.Username
    }

    let Fecha=this.router.snapshot.paramMap.get("Fecha")
    if(Fecha!=null){
      this.servicios.GetListadoMediciones(this.UsrNameView.toString(),Fecha).subscribe(
        result =>{
          this.ListadoMediciones=result
          for (let i = 0; i < result.length; i++) {
            this.datosY[i]=result[i].RitmoCardiaco
            this.LabelsX[i]=i.toString()
          }
          try {
            let periodo_maximo = result[result.length - 1].Periodo
            this.Repeticion_Fecha = new Array()
            if(periodo_maximo != null && periodo_maximo != undefined){
              for (let index = 1; index <= Number(periodo_maximo); index++) {
                this.Repeticion_Fecha.push(index);
              }
            }
          } catch (error) {
            console.log("No tiene Repeticiones")
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
        
        if(this.Repeticion == 'All'){
          this.servicios.GetListadoMediciones(this.UsrNameView.toString(),FechaLive).subscribe(
            result=>{
              this.ListadoMediciones=result
              if(this.BotonPresionado=="Temperatura"){
                for (let i = 0; i < result.length; i++) {
                  this.datosY[i]=result[i].Temperatura
                  this.LabelsX[i]=i.toString()
                }
                this.TemperaturaValue.Promedio=Number(this.Promedio(this.datosY))
                this.TemperaturaValue.Maxima=Number(this.Maximo(this.datosY))
                this.TemperaturaValue.Minima=Number(this.Minimo(this.datosY,this.TemperaturaValue.Maxima))
              }
              if(this.BotonPresionado=="Oxigeno"){
                for (let i = 0; i < result.length; i++) {
                  this.datosY[i]=result[i].PulsoOxigeno
                  this.LabelsX[i]=i.toString()
                }
                this.OxigenoPromedio=Number(this.Promedio(this.datosY))
              }
              if(this.BotonPresionado=="RitmoCardiaco"){
                for (let i = 0; i < result.length; i++) {
                  this.datosY[i]=result[i].RitmoCardiaco
                  this.LabelsX[i]=i.toString()
                }
                this.RitmoCardiacoPromedio=Number(this.Promedio(this.datosY))
              }
              if(this.BotonPresionado=="Velocidad"){
                for (let i = 0; i < result.length; i++) {
                  this.datosY[i]=result[i].Velocidad
                  this.LabelsX[i]=i.toString()
                }
                this.VelocidadValue.Promedio=Number(this.Promedio(this.datosY))
                this.VelocidadValue.Maxima=Number(this.Maximo(this.datosY))
                this.VelocidadValue.Minima=Number(this.Minimo(this.datosY,this.VelocidadValue.Maxima))
              }
              if(this.BotonPresionado=="Distancia"){
                for (let i = 0; i < result.length; i++) {
                  this.datosY[i]=result[i].Distancia
                  this.LabelsX[i]=i.toString()
                }
              }
              
              try {
                let periodo_maximo = result[result.length - 1].Periodo
                this.Repeticion_Fecha = new Array()
                if(periodo_maximo != null && periodo_maximo != undefined){
                  for (let index = 1; index <= Number(periodo_maximo); index++) {
                    this.Repeticion_Fecha.push(index);
                  }
                } 
              } catch (error) {
                console.log("No tiene Repeticiones")
              }
              
            },error=>{
              console.log("Error")
            }
          );
        }else{
          if (this.Repeticion_Fecha.length != 1){
            this.Repeticion_Fecha = new Array()
            this.Repeticion_Fecha.push(Number(this.Repeticion))
          }
          this.servicios.GetListadoMedicionesRep(this.UsrNameView.toString(),FechaLive,Number(this.Repeticion)).subscribe(result =>{
            this.ListadoMediciones = result
            if(this.BotonPresionado=="Velocidad"){
              this.Graph.Datos
              this.datosY = []
              this.LabelsX = []
              for (let i = 0; i < this.ListadoMediciones.length; i++) {
                this.datosY[i]=this.ListadoMediciones[i].Velocidad
                this.LabelsX[i]=i.toString()
              }

              this.VelocidadValue.Promedio=Number(this.Promedio(this.datosY))
              this.VelocidadValue.Maxima=Number(this.Maximo(this.datosY))
              this.VelocidadValue.Minima=Number(this.Minimo(this.datosY,this.VelocidadValue.Maxima))
            }
            if(this.BotonPresionado=="Distancia"){
              this.datosY = []
              this.LabelsX = []
              for (let i = 0; i < this.ListadoMediciones.length; i++) {
                this.datosY[i]=this.ListadoMediciones[i].Velocidad
                this.LabelsX[i]=i.toString()
              }
            }
          },error =>{
            console.log("Error")
          })
        }
        this.Graph.lineChartData[0].data=this.datosY
        this.Graph.lineChartLabels=this.LabelsX

        if(this.navigate.url!="/Graficas/Live"){
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
    this.Repeticion= 'All'
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
    this.Show_hide_div("RitmoCardiaco")
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
    this.Show_hide_div("Temperatura")
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
    this.Show_hide_div("Oxigeno")
    this.OxigenoPromedio=Number(this.Promedio(this.datosY))
  }

  public Velocidad(btn:number){
    this.Graph.lineChartData[0].label="Velocidad"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    //for
    for (let i = 0; i < this.ListadoMediciones.length; i++) {
      this.datosY[i]=this.ListadoMediciones[i].Velocidad
      this.LabelsX[i]=i.toString()
    }
    this.Show_hide_div("Velocidad")
    this.VelocidadValue.Promedio=Number(this.Promedio(this.datosY))
    this.VelocidadValue.Maxima=Number(this.Maximo(this.datosY))
    this.VelocidadValue.Minima=Number(this.Minimo(this.datosY,this.VelocidadValue.Maxima))
  }

  public Distancia(btn:number){
    this.Graph.lineChartData[0].label="Distancia"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    //for
    for (let i = 0; i < this.ListadoMediciones.length; i++) {
      this.datosY[i]=this.ListadoMediciones[i].Distancia
      this.LabelsX[i]=i.toString()
    }
    this.Show_hide_div("Distancia")
  }

  public TestsStatus(btn:number){
    this.Graph.lineChartData[0].label="Test Status"
    this.datosY=[]
    this.LabelsX=[]
    this.Seleccionar(btn)
    this.SelectStatus("All")
    this.Show_hide_div("Test_Status")
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

  private Show_hide_div(Div:String){
    this.BotonPresionado="Temperatura"
    let divs= document.getElementsByClassName("DIV_DESCRIPCION")
    for (let index = 0; index < divs.length; index++) {
      let div = divs[index] as HTMLDivElement
      div.style.visibility="hidden"
    }
    document.getElementById(Div.toString()).style.visibility = 'visible'
    this.BotonPresionado=Div
  }

  public SelectRep(numero:any){
    this.Repeticion = numero
    console.log(this.Repeticion)
    let fecha=this.router.snapshot.paramMap.get("Fecha")
    if(fecha != null && fecha != undefined){
      console.log("FECHA ANTERIOR");
      
      if(this.BotonPresionado == "Velocidad"){
        if(this.Repeticion == 'All'){
          this.Velocidad(2)
        }else{

          this.servicios.GetListadoMedicionesRep(this.UsrNameView.toString(),fecha,Number(this.Repeticion)).subscribe(result=>{
            
            this.datosY=new Array()
            this.LabelsX=new Array()
            for (let i = 0; i < result.length; i++) {
              this.datosY.push(result[i].Velocidad)
              this.LabelsX.push(i.toString())
            }
            this.Graph.lineChartData[0].data=this.datosY
            this.Graph.lineChartLabels=this.LabelsX

            this.VelocidadValue.Promedio=Number(this.Promedio(this.datosY))
            this.VelocidadValue.Maxima=Number(this.Maximo(this.datosY))
            this.VelocidadValue.Minima=Number(this.Minimo(this.datosY,this.VelocidadValue.Maxima))
          })

        }
      }else if(this.BotonPresionado == "Distancia"){
        if(this.Repeticion == 'All'){
          this.Distancia(3)
        }else{
          
          this.servicios.GetListadoMedicionesRep(this.UsrNameView.toString(),fecha,Number(this.Repeticion)).subscribe(result=>{
            
            this.datosY=new Array()
            this.LabelsX=new Array()
            for (let i = 0; i < result.length; i++) {
              this.datosY.push(result[i].Distancia)
              this.LabelsX.push(i.toString())
            }
            this.Graph.lineChartData[0].data=this.datosY
            this.Graph.lineChartLabels=this.LabelsX
          })

        }
      }
    }

  }

  public SelectStatus(Status:String){
    this.GetAllStatusGraph()
    this.StatusTestUser = []
    if(Status == 'All'){
      this.servicios.GetTestStatusUser(this.UsrNameView).subscribe(result=>{
        this.StatusTestUser = result
        document.getElementById("Status_count").innerHTML = "Cantidad de Registros: "
        this.Status_count = result.length
      })
    }else{
      this.servicios.GetTestStatusUserforStatusEspecific(this.UsrNameView,Status).subscribe(result=>{
        this.StatusTestUser = result
        document.getElementById("Status_count").innerHTML = "Cantidad de "+Status+": "
        this.Status_count = result.length
      })
    }
    
  }

  private GetAllStatusGraph(){
    this.datosY=[]
    this.LabelsX=[]
    this.servicios.GetTestStatusUserforStatusEspecific(this.UsrNameView,"NO APROBADO").subscribe(
      result=>{
        this.datosY.push(result.length)
        this.LabelsX.push("NO APROBADO")
      }
    )
    this.servicios.GetTestStatusUserforStatusEspecific(this.UsrNameView,"RENDICION").subscribe(
      result=>{
        this.datosY.push(result.length)
        this.LabelsX.push("RENDICION")
      }
    )
    this.servicios.GetTestStatusUserforStatusEspecific(this.UsrNameView,"APROBADO").subscribe(
      result=>{
        this.datosY.push(result.length)
        this.LabelsX.push("APROBADO")
      }
    )
    this.Graph.lineChartData[0].data=this.datosY
    this.Graph.lineChartLabels=this.LabelsX
  }

  public Replace(texto:String){
    return texto.replace(/_/gi,"/")
  }

}
