import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/User';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
    console.log("NavBar");
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
