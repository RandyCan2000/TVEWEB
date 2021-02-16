import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
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
        path:'view',
        component:UserInfComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
