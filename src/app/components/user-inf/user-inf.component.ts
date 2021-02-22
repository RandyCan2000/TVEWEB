import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'app-user-inf',
  templateUrl: './user-inf.component.html',
  styleUrls: ['./user-inf.component.css']
})
export class UserInfComponent implements OnInit {

  public Usuario:User={
    Nombre: "",
    Apellido: "",
    Edad: 0,
    Genero: "N",
    Peso: 0,
    Estatura: 0,
    Username: "",
    Password: "",
    Rol: "N"
  }

  public Title:string="Registrarse"

  constructor(private Servicio:ServiciosService,private router:ActivatedRoute,private navigate:Router) {}

  ngOnInit(): void {
    if(this.router.snapshot.paramMap.get("User")!=null){
      let UsrLog:User=JSON.parse(sessionStorage.getItem("UsrLog"))
      if(UsrLog.Username==this.router.snapshot.paramMap.get("User")){
        this.Usuario=UsrLog
        this.Title="Informacion"
        let boton=document.getElementById("Btn")
        boton.style.display="none"
      }else{
        this.navigate.navigate(["Login"])
      }
    }
  }

  public Registrar(){
    this.Servicio.PostUser(this.Usuario).subscribe(
      result => {
        alert("Usuario Agregado con exito")
        this.Usuario={
          Nombre: "",
          Apellido: "",
          Edad: 0,
          Genero: "N",
          Peso: 0,
          Estatura: 0,
          Username: "",
          Password: "",
          Rol: "N"
        }
      },
      error=>{
        alert("Error al Agregar El Usuario")
      }
    );
  }

}
