import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/Services/servicios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-functions',
  templateUrl: './new-functions.component.html',
  styleUrls: ['./new-functions.component.css']
})
export class NewFunctionsComponent implements OnInit {

	constructor(private servicios:ServiciosService, private navigate:Router) { }
  
	public TemperaturaAmbiente;
	public TemperaturaAtleta;
	public EstadoAtleta = "Normal";
	public Distancia = 0;
	public EstadoMeta = "-";
	public DistanciaNumber;
	public Progreso = 0;
	private Intervalo_Distancia;
	public EstadoAmbiente=""

    async ngOnInit() {
	  
		if(sessionStorage.getItem('Distancia_cumplir')){
			this.DistanciaNumber = Number(sessionStorage.getItem('Distancia_cumplir'))
			this.Comenzar()
		}

		document.getElementById('card').style.background = "#008000";
		document.getElementById('card2').style.background = "#000080";
	  
		// Solicitar Json De Datos 
		let JsonAux;
		let JsonTemperatura;		
		const Date_ = new Date();
		let Fecha = Date_.toISOString().split("T")[0];
		let Er = /-/gi;
		Fecha = Fecha.replace(Er, ""); 

		let FormattedDate = Date_.toLocaleString().split(" ")[0];
		let ArrayFecha = FormattedDate.split("/");
		FormattedDate = "";
		
		for(let i = 0; i < ArrayFecha.length; i++) {
			
			if(i < ArrayFecha.length - 1) {
				
				FormattedDate += ArrayFecha[i] + "_";
				
			}		
			else 
			{
				
				FormattedDate += ArrayFecha[i];
				
			}
			
		}
		
		FormattedDate += " " + Date_.getHours() + ":" + Date_.getMinutes();

		this.servicios.GetUltimoInicioSesion().subscribe(
			result=>{
				FormattedDate=result.Fecha.toString();
			}
		)
		  
		await this.servicios.GetPosGeografica().then(function(valor) { 

            JsonAux = valor;
			
		});	
			
		await this.servicios.GetTemperaturaGeografica(JsonAux["longitude"], JsonAux["latitude"]).then(function(valor) {
			
			JsonTemperatura = valor;
			
		});
		
		JsonTemperatura = JsonTemperatura["dataseries"];
		
		let JsonMaxMin;
		
		for(let i = 0; i < JsonTemperatura.length; i++) {
			
			if(JsonTemperatura[i]["date"].toString() == Fecha) {
				
				JsonMaxMin = JsonTemperatura[i]["temp2m"];
				break;
				
			}			
			
		}
		
		this.TemperaturaAmbiente = (JsonMaxMin["max"] + JsonMaxMin["min"]) / 2;
		
		let TemperaturaAtleta;
		let PromedioTemperatura: number = 0;
			
		var Intervalo = await setInterval(async() => {
			
			// Verificar Si Ruta ES Login 
			if(this.navigate.url == "/Login") {
				
				clearInterval(Intervalo);
				
			}
			
			// Verificar 
			if(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"] != null) {
				
				await this.servicios.GetTemperaturaAtleta(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"], FormattedDate).then(function(valor) {
				
					TemperaturaAtleta = valor;
					
				});
				
				if(TemperaturaAtleta.length > 0) {
					
					PromedioTemperatura = 0;
					
					TemperaturaAtleta.forEach((Temp, index) => {
					
						
						PromedioTemperatura += Number(Temp["Temperatura"]);
						
					});
					
					this.TemperaturaAtleta = (PromedioTemperatura / TemperaturaAtleta.length).toFixed(2);
														
				}			
				
				if(PromedioTemperatura == 0) {
					
					this.TemperaturaAtleta = 0;
					
				}
				
				// Verificar
				if(this.TemperaturaAtleta < 35) {
					this.EstadoAtleta = "Temperatura Corporal Baja";
					document.getElementById('card').style.background = "#FF0000";						
				}
				if(this.TemperaturaAtleta >= 35 && this.TemperaturaAtleta <36) {
					this.EstadoAtleta = "Temperatura Corporal Estable";
					document.getElementById('card').style.background = "#DFD500";						
				}
				if(this.TemperaturaAtleta >= 36 && this.TemperaturaAtleta <37) {
					this.EstadoAtleta = "Temperatura Corporal Normal";
					document.getElementById('card').style.background = "#008000";						
				}
				if(this.TemperaturaAtleta >= 37 && this.TemperaturaAtleta < 38) {
					this.EstadoAtleta = "Temperatura Corporal Estable";
					document.getElementById('card').style.background = "#DFD500";						
				}
				if(this.TemperaturaAtleta >= 38 && this.TemperaturaAtleta < 39) {
					this.EstadoAtleta = "Temperatura Corporal Elevada";
					document.getElementById('card').style.background = "#F37200";						
				}
				if(this.TemperaturaAtleta >= 39 && this.TemperaturaAtleta < 40) {
					this.EstadoAtleta = "Temperatura Corporal muy elevada";
					document.getElementById('card').style.background = "#F33700";						
				}
				if(this.TemperaturaAtleta >= 40 ){
					if(this.navigate.url != "/Login") {
						this.navigate.navigate(['/NewFunc']);
					}
					this.EstadoAtleta = "Advertencia: Posible Golpe De Calor!";
					document.getElementById('card').style.background = "#FF0000";
				}	
				
				if(this.TemperaturaAmbiente >= 20 && this.TemperaturaAmbiente <= 22){
					this.EstadoAmbiente = "Temperatura Ambiente Ideal para Ejercitarse"
					document.getElementById('card').style.background = "linear-gradient(to bottom,"+document.getElementById('card').style.background+", #008000)"
				}
				if(this.TemperaturaAmbiente < 20 || this.TemperaturaAmbiente > 22){
					this.EstadoAmbiente = "Temperatura Ambiente Ideal No Es Optima"
					document.getElementById('card').style.background = "linear-gradient(to bottom,"+document.getElementById('card').style.background+", #EA8300)"
				}
				
			}					
			
		}, 500);
		
	}
	
	async Comenzar() {
		// Verificar 
		if(this.DistanciaNumber != null || this.DistanciaNumber != undefined) {
			
			// Solicitar Json De Datos 
			const Date_ = new Date();
			let Fecha = Date_.toISOString().split("T")[0];
			let Er = /-/gi;
			Fecha = Fecha.replace(Er, ""); 

			let FormattedDate = Date_.toLocaleString().split(" ")[0];
			let ArrayFecha = FormattedDate.split("/");
			FormattedDate = "";
			
			for(let i = 0; i < ArrayFecha.length; i++) {
				
				if(i < ArrayFecha.length - 1) {
					
					FormattedDate += ArrayFecha[i] + "_";
					
				}		
				else 
				{
					
					FormattedDate += ArrayFecha[i];
					
				}
				
			}
			
			FormattedDate += " " + Date_.getHours() + ":" + Date_.getMinutes();

			await this.servicios.GetUltimoInicioSesionPromise().then(
				result=>{
					FormattedDate=result.Fecha.toString();					
				}
			)

			let DistanciaACumplir = this.DistanciaNumber;
			this.Distancia = this.DistanciaNumber;
			this.EstadoMeta = "En Progreso";
			document.getElementById('card2').style.background = "#EF7F1A";
			this.DistanciaNumber = null;
			
			let DistanciaInicial = null;
			
			await this.servicios.GetTemperaturaAtleta(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"], FormattedDate).then(function(valor) {
					
				DistanciaInicial = valor;					
				
			});
			
			if(!sessionStorage.getItem("Distancia_Inicial")){
				sessionStorage.setItem("Distancia_Inicial",JSON.stringify(DistanciaInicial))
				sessionStorage.setItem("Distancia_cumplir",DistanciaACumplir)
			}
			
			let DistanciaAtleta;
			let DistanciaRecorrida;
			let intervar = true
			await this.servicios.GetTemperaturaAtleta(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"], FormattedDate).then(function(valor) {
				DistanciaAtleta = valor;					
			});
			if(DistanciaAtleta.length > 0) {
				DistanciaInicial = JSON.parse(sessionStorage.getItem("Distancia_Inicial"))
				DistanciaRecorrida = (Number(DistanciaAtleta[DistanciaAtleta.length - 1]["Distancia"]) - Number(DistanciaInicial[DistanciaInicial.length - 1]["Distancia"])) / 100;
				// Verificar Si EStoy En New Func 
				if(DistanciaRecorrida >= DistanciaACumplir) {
					intervar = false		
					document.getElementById("comenzar").style.visibility="visible"
					document.getElementById("terminar").style.visibility="hidden"
					document.getElementById('card2').style.background = "#000080";
					sessionStorage.removeItem("Distancia_Inicial")
					sessionStorage.removeItem("Distancia_cumplir")
					this.EstadoMeta = "Completada!";
					// Verificar Si EStoy En Login 
					if(this.navigate.url != "/Login") {
						
						this.navigate.navigate(['/NewFunc']);
						
					}
					this.showSucces("Meta Completada")	
					clearInterval(this.Intervalo_Distancia);
				}							
			}

			if(intervar){
				this.Intervalo_Distancia = setInterval(async() => {

					document.getElementById("comenzar").style.visibility="hidden"
					document.getElementById("terminar").style.visibility="visible"
	
					DistanciaInicial = JSON.parse(sessionStorage.getItem("Distancia_Inicial"))
					DistanciaACumplir = sessionStorage.getItem("Distancia_cumplir")
	
					// Verificar Si Ruta ES Login 
					if(this.navigate.url == "/Login") {
						
						clearInterval(this.Intervalo_Distancia);
						
					}
					if(this.navigate.url != "/NewFunc") {
						
						clearInterval(this.Intervalo_Distancia);
						
					}
					
					let DistanciaAtleta;
					let DistanciaRecorrida;
				
					// Verificar 
					if(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"] != null) {
						
						await this.servicios.GetTemperaturaAtleta(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"], FormattedDate).then(function(valor) {
						
							DistanciaAtleta = valor;					
						
						});
						
						if(DistanciaAtleta.length > 0) {
							
							
							DistanciaRecorrida = (Number(DistanciaAtleta[DistanciaAtleta.length - 1]["Distancia"]) - Number(DistanciaInicial[DistanciaInicial.length - 1]["Distancia"])) / 100;
							
							// Verificar Si EStoy En New Func 
							if(DistanciaRecorrida < DistanciaACumplir) {
								
								this.Distancia = DistanciaACumplir;
								this.EstadoMeta = "En Progreso";
								document.getElementById('card2').style.background = "#EF7F1A";
												
							}
							
							this.Progreso = DistanciaRecorrida;
																
						}			
						
						if(DistanciaRecorrida == 0) {
							
							this.Progreso = 0;
							
						}
						const porcentaje = this.Progreso*100/DistanciaACumplir
						if(porcentaje > 0){
							document.getElementById('card2').style.background = "linear-gradient(90deg, #008000 "+porcentaje.toString()+"%, #EF7F1A 100%)"
						}else{
							document.getElementById('card2').style.background = "#EF7F1A"
						}
						
	
						// Verificar 
						if(DistanciaRecorrida >= DistanciaACumplir) {
							document.getElementById("comenzar").style.visibility="visible"
							document.getElementById("terminar").style.visibility="hidden"
							document.getElementById('card2').style.background = "#000080";
							sessionStorage.removeItem("Distancia_Inicial")
							sessionStorage.removeItem("Distancia_cumplir")
							this.EstadoMeta = "Completada!";
							// Verificar Si EStoy En Login 
							if(this.navigate.url != "/Login") {
								
								this.navigate.navigate(['/NewFunc']);
								
							}
							this.showSucces("Meta Completada")
							clearInterval(this.Intervalo_Distancia);
							
						}
						
					}	
				
				}, 500);
			}
			
		}
		else {
			
			this.showFail("Debe De Ingresar Una Cantidad Valida!");
			
		}
		
	}

	private validar(){
		
	}

	public Terminar(){
		clearInterval(this.Intervalo_Distancia);
		document.getElementById("comenzar").style.visibility="visible"
		document.getElementById("terminar").style.visibility="hidden"
		document.getElementById('card2').style.background = "#000080";
		sessionStorage.removeItem("Distancia_Inicial")
		sessionStorage.removeItem("Distancia_cumplir")
		this.showFail("Su intento a sido fallido");
	}
	
	public showFail(texto :string){
    Swal.fire({
      position: 'top',
      icon: 'error',
      text: texto,
      showConfirmButton: false,
      timer: 3000
    })
  }
  public showSucces(texto :string){
	Swal.fire({
	  position: 'top',
	  icon: 'success',
	  text: texto,
	  showConfirmButton: false,
	  timer: 3000
	})
	}

}
