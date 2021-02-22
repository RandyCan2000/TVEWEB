import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Model/User';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Servicio:ServiciosService, private router:Router) {
  }

  public UsuarioLog:User={
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


  ngOnInit(): void {
    if(sessionStorage.getItem("UsrLog")!=null){
      this.router.navigate(['/', 'Graficas']);
    }
  }

  public LogIn(){
    this.Servicio.GetUser(this.UsuarioLog.Username,this.UsuarioLog.Password).subscribe(
      result => {
        if(result.length==0){
          alert("El Usuario no existe")
        }else if(result.length==1){
          sessionStorage.setItem("UsrLog",JSON.stringify(result[0]))
          this.router.navigate(['Graficas'])
        }else{
          alert("Error al iniciar sesion")
        }
      },
      error=>{
        alert("Usuario Inexistente")
      }
    );
    this.Servicio.GetUltimoInicioSesion().subscribe(
      result=>{
        sessionStorage.setItem("FECHA_LIVE",result.Fecha.toString())
      }
    );
  }

  public registrarse(){
    this.router.navigate(["Informacion","Registro"])
  }
}
