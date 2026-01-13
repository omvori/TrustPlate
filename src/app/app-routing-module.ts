import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaRistoranti } from './pagina-ristoranti/pagina-ristoranti';
import { HomeComponent } from './home-component/home-component';


const routes: Routes = [
  {path:'ristoranti/:id', component:PaginaRistoranti},
  {path: '', component: HomeComponent,pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
