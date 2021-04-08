import { Component, OnInit,OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  
  @ViewChild("HORA") Hora: ElementRef;
  public Interval:any

  constructor(private route:Router,private renderer: Renderer2) {
  }

  

  ngOnInit(): void {
    console.log("NavBar");

    this.Interval=setInterval(()=>{
      let hoy = new Date()
      let texto=String(hoy.getHours())+':'+String(hoy.getMinutes())+':'+String(hoy.getSeconds())
      this.renderer.setProperty(this.Hora.nativeElement,'innerHTML',texto)
    },1000)
  }

  ngOnDestroy():void{
    clearInterval(this.Interval)
    console.log("adios navbar");
  }

  public LogOut(){
    sessionStorage.clear()
    this.route.navigate(["Login"])
  }

  public informacion(){
    let usra:User=JSON.parse(sessionStorage.getItem("UsrLog"))
    this.route.navigate(["Informacion","view",usra.Username])
  }

}
