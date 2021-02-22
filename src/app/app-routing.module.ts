import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachTableComponent } from './components/coach-table/coach-table.component';
import { GraficasComponent } from './components/graficas/graficas.component';
import { HistorialComponent } from './components/historial/historial.component';
import { LoginComponent } from './components/login/login.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { Reportes2Component } from './components/reportes2/reportes2.component';
import { UserInfComponent } from './components/user-inf/user-inf.component';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo:'Login'
  },
  {
    path:'Login',
    component:LoginComponent
  },
  {
    path:'Informacion',
    children:[
      {
        path:'',
        pathMatch:'full',
        redirectTo:'Registro'
      },
      {
        path:'Registro',
        component:UserInfComponent
      },
      {
        path:'view/:User',
        component:UserInfComponent
      }
    ]
  },
  {
    path:'Graficas',
    children:[
      {
        path:'',
        pathMatch:'full',
        redirectTo:'Live'
      },{
        path:'Live',
        //Colocar Contenedor de graficas
        component:ReportesComponent
      },{
        path:'Day/:Fecha',
        //Colocar Contenedor de graficas
        component:ReportesComponent
      }
    ]
  },
  {
    path:"Historia",
    children:[
      {
        path:"",
        component:HistorialComponent
      },{
        path:"Coach",
        children:[
          {
            path:"",
            pathMatch:"full",
            redirectTo:"Live",
          },{
            path:"Live",
            component:Reportes2Component
          },
          {
            path:'Day/:Fecha',
            component:Reportes2Component
          }
        ]
      }
    ]
  },{
    path:"Coach",
    component:CoachTableComponent
  },
  {
    path: '**',
    pathMatch:'full',
    redirectTo:"Login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
