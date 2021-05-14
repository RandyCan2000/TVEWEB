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

    async ngOnInit() {
	  
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
				if(this.TemperaturaAtleta >= this.TemperaturaAmbiente + 5) {
					
					
					// Verificar Si EStoy En Login 
					if(this.navigate.url != "/Login") {
						
						this.navigate.navigate(['/NewFunc']);
						
					}
					
					this.EstadoAtleta = "Advertencia: Posible Golpe De Calor!";
					
					document.getElementById('card').style.background = "#FF0000";						
					
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
			let DistanciaACumplir = this.DistanciaNumber;
			this.Distancia = this.DistanciaNumber;
			this.EstadoMeta = "En Progreso";
			document.getElementById('card2').style.background = "#EF7F1A";
			this.DistanciaNumber = null;
			
			let DistanciaInicial = null;
			
			await this.servicios.GetTemperaturaAtleta(JSON.parse(sessionStorage.getItem('UsrLog'))["Username"], FormattedDate).then(function(valor) {
					
				DistanciaInicial = valor;					
					
			});
			
			var Intervalo_ = setInterval(async() => {
			
				// Verificar Si Ruta ES Login 
				if(this.navigate.url == "/Login") {
					
					clearInterval(Intervalo_);
					
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
						if(this.navigate.url == "/NewFunc" && DistanciaRecorrida < DistanciaACumplir) {
							
							this.Distancia = DistanciaACumplir;
							this.EstadoMeta = "En Progreso";
							document.getElementById('card2').style.background = "#EF7F1A";
											
						}
						
						this.Progreso = DistanciaRecorrida;
															
					}			
					
					if(DistanciaRecorrida == 0) {
						
						this.Progreso = 0;
						
					}
					
					// Verificar 
					if(DistanciaRecorrida >= DistanciaACumplir) {
						
						
						// Verificar Si EStoy En Login 
						if(this.navigate.url != "/Login") {
							
							this.navigate.navigate(['/NewFunc']);
							
						}
						
					
						this.EstadoMeta = "Completada!";
					
						document.getElementById('card2').style.background = "#008000";

						clearInterval(Intervalo_);
						
					}
					
				}	
			
			}, 500);
			
		}
		else {
			
			this.showFail("Debe De Ingresar Una Cantidad Valida!");
			
		}
		
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

}
