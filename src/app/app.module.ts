import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserInfComponent } from './components/user-inf/user-inf.component';
import { GraficasComponent } from './components/graficas/graficas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http'
import { ServiciosService } from './Services/servicios.service';
import { HistorialComponent } from './components/historial/historial.component';
import { CoachTableComponent } from './components/coach-table/coach-table.component';
import { Reportes2Component } from './components/reportes2/reportes2.component';
import { GraficaBarrasComponent } from './components/grafica-barras/grafica-barras.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserInfComponent,
    GraficasComponent,
    ReportesComponent,
    HistorialComponent,
    CoachTableComponent,
    Reportes2Component,
    GraficaBarrasComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    HttpClientModule
  ],
  providers: [
    ServiciosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
