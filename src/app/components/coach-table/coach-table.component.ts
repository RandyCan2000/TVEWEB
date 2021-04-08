import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coach_Atleta } from 'src/app/Model/Coach_Atleta';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';

@Component({
  selector: 'app-coach-table',
  templateUrl: './coach-table.component.html',
  styleUrls: ['./coach-table.component.css']
})
export class CoachTableComponent implements OnInit {

  constructor(private Servicio:ServiciosService,private route:Router) {
    this.UsrLog=JSON.parse(sessionStorage.getItem("UsrLog"))
    if(this.UsrLog!=null && this.UsrLog.Rol=="C"){
      this.AsignacionNueva.UsernameCoach=this.UsrLog.Username
    }
    if(this.UsrLog.Rol=="A"){
      this.route.navigate(["Graficas","Live"])
    }
  }

  public ListadoAtletas:Coach_Atleta[]=[]
  public TablaAtletasAsignados:Coach_Atleta[]=[]
  private UsrLog:User;
  private ListaFechas:any=[];
  public SelectOption:string="N"

  public AsignacionNueva:Coach_Atleta={
    UsernameAtleta:"",
    UsernameCoach:""
  }

  ngOnInit(): void {
    this.GetAtletasAsignados()
    this.datosCombo();
  }

  public datosCombo(){
    this.Servicio.GetAllAtletas().subscribe(
      result=>{
        this.Servicio.GetAllUsersAtletas().subscribe(
          result2=>{

            let Auxlist:Coach_Atleta[]=[]
            let Existe=false;
            for (let i = 0; i < result2.length; i++) {
              //console.log(result2[i].Username);
              
              for (let j = 0; j < result.length; j++) {
                if(result2[i].Username==result[j].UsernameAtleta){
                  Existe=true
                  break
                }
              }
              if(Existe==false){
                Auxlist.push({UsernameAtleta:result2[i].Username,UsernameCoach:""})
              }else{
                Existe=true
              }
            }
            this.ListadoAtletas=Auxlist
            for (let i = 0; i < result2.length; i++) {
              this.ListadoAtletas.push({UsernameAtleta:result2[i].Username,UsernameCoach:""})
            }
            Auxlist=[]
            for (let i = 0; i < this.ListadoAtletas.length; i++) {
              if(this.ListadoAtletas[i].UsernameCoach!=this.UsrLog.Username){
                Auxlist.push(this.ListadoAtletas[i])
              }
            }
            this.ListadoAtletas=Auxlist
            
            Auxlist=[]
            let add=false
            for (let i = 0; i < this.ListadoAtletas.length; i++) {
              for (let j = 0; j < this.TablaAtletasAsignados.length; j++) {
                if(this.TablaAtletasAsignados[j].UsernameAtleta==this.ListadoAtletas[i].UsernameAtleta){
                  add=true
                }
              }
              if(add==false){
                Auxlist.push(this.ListadoAtletas[i])
              }else{
                add=false
              }
            }
            this.ListadoAtletas=[]
            this.ListadoAtletas=Auxlist

          },error2=>{

          }
        );
      },error=>{

      }
    );
  }

  public GetAtletasAsignados(){
    this.TablaAtletasAsignados=[]
    this.Servicio.GetAllAtletas().subscribe(
      result=>{
        for (let i = 0; i < result.length; i++) {
          if(result[i].UsernameCoach==this.UsrLog.Username){
            this.TablaAtletasAsignados.push(result[i])
          }
        }
        this.ListaFechas=[]
        for (const iterator of this.TablaAtletasAsignados) {
          this.Servicio.GetFechaUser(iterator.UsernameAtleta.toString()).subscribe(
            result4 => {
              let Select=document.getElementById("USR"+iterator.UsernameAtleta) as HTMLSelectElement
              
              for (let i = 0; i < result4.length; i++) {
                let Option=document.createElement("option")
                Option.setAttribute("value",result4[i])
                Option.innerHTML=result4[i].replace(/_/gi,"/")
                Select.appendChild(Option)
              }
              //this.ListaFechas.push(result4)
            },error=>{

            }
          );
        }
      },error=>{

      }
    );
  }

  public Insertar(){
    this.Servicio.postAsignacion(this.AsignacionNueva).subscribe(
      result=>{
        this.GetAtletasAsignados();
        this.datosCombo()
      },error=>{

      }
    )
    
  };

  public Navegar(name:string){
    this.route.navigate(["Graficas","Live"])
    sessionStorage.setItem("USER_VIEW",name)
  }
  public NavegarFecha(name:string){
    this.route.navigate(["Graficas","Day",this.SelectOption])
    sessionStorage.setItem("USER_VIEW",name)
  }

}
