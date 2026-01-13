import { Component, OnInit,signal,OnDestroy } from '@angular/core';
import { ExampleComponent } from './example/example';
import { FlaskServer } from './services/flask-server';
import jsonData from './backEnd/reviews.json'


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Progetto Recensioni');



  constructor(){}


  ngOnInit(){
    console.log('App avviata normalmente')
  }

  

}

