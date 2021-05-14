import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { observable, Observable } from 'rxjs';
import { User } from '../Model/User';
import { Mediciones } from '../Model/Mediciones';
import { Coach_Atleta } from '../Model/Coach_Atleta';
import { Dates_ } from '../Model/Dates_';
import { TestUser } from '../Model/TestUsers';
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

   //public Ruta:string="http://localhost:4000";
   public PosicionGeografica:string = "https://freegeoip.app/json/";   
   public Ruta:string="https://fast-thicket-73591.herokuapp.com"

  constructor(private http:HttpClient) { }

	public GetPosGeografica() 
	{		
		return this.http.get(this.PosicionGeografica).toPromise();		
	}
	
	public GetTemperaturaGeografica(Longitud: string, Latitud: string) 
	{
		
		return this.http.get(`http://www.7timer.info/bin/civillight.php?lon=${Longitud}&lat=${Latitud}%7D&ac=0&unit=metric&output=json`).toPromise();
		
	}
	
	public GetTemperaturaAtleta(UsrName:string, Fecha:String) {
		
		return this.http.get(this.Ruta+`/get/Mediciones/${UsrName}/${Fecha}`).toPromise();
	
	}

  public PostUser(NewUser:User):Observable<any>{
    return this.http.post<any>(this.Ruta+"/create_user",NewUser)
  }

  public GetUser(UsrName:string,Pass:string):Observable<User[]>{
    return this.http.get<User[]>(this.Ruta+`/one_user/${UsrName}/${Pass}`)
  }

  public GetFechaUser(UsrName:string):Observable<string[]>{
    return this.http.get<string[]>(this.Ruta+`/getHistoria/${UsrName}`)
  }

  public GetListadoMediciones(UsrName:string,Fecha:String):Observable<Mediciones[]>{
    return this.http.get<Mediciones[]>(this.Ruta+`/get/Mediciones/${UsrName}/${Fecha}`)
  }

  public GetListadoMedicionesRep(UsrName:string,Fecha:String,Repeticion:Number):Observable<Mediciones[]>{
    return this.http.get<Mediciones[]>(this.Ruta+`/Get/All/Registros/${Fecha}/${UsrName}/${Repeticion}`)
  }

  public GetAllAtletas():Observable<Coach_Atleta[]>{
    return this.http.get<Coach_Atleta[]>(this.Ruta+`/Get/All/Atletas`)
  }

  public GetAllUsersAtletas():Observable<User[]>{
    return this.http.get<User[]>(this.Ruta+`/Get/All/Atletas/Users`)
  }

  public postAsignacion(Asig:Coach_Atleta):Observable<any>{
    return this.http.post<any>(this.Ruta+`/create/asignacion`,Asig)
  }

  public GetUltimoInicioSesion():Observable<Dates_>{
    return this.http.get<Dates_>(this.Ruta+`/Ordenar/Fecha/Inicio/Sesion`)
  }

  public GetTestStatusUser(User:String):Observable<TestUser[]>{
    return this.http.get<TestUser[]>(this.Ruta+`/Get/All/Registros/${User}`)
  }

  public GetTestStatusUserforStatusEspecific(User:String,Status:String):Observable<TestUser[]>{
    return this.http.get<TestUser[]>(this.Ruta+`/Get/All/Registros/Approved/test/${User}/${Status}`)
  }
}
