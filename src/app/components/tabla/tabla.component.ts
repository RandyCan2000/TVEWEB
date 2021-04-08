import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  @Input() Fechas:string[]=[]

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  public VerHistoria(Fecha:String){
    Fecha=Fecha.replace(/\//gi,"_");
    this.route.navigate(["Graficas","Day",Fecha])
  }

}
