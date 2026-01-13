import { Component,Input, OnInit,signal } from '@angular/core';
import {ChangeDetectionStrategy } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { DataChildChild } from '../services/data-child-child';
import { FlaskServer } from '../services/flask-server';


@Component({
  selector: 'app-cards-to-review',
  standalone: false,
  templateUrl: './cards-to-review.html',
  styleUrl: './cards-to-review.css',
})
export class CardsToReview implements OnInit {

  @Input() reviewedCard?: any
  @Input() reviews: any[] = [];

  isShown = signal(true);

  ngOnInit() {
    //this.toggle()
  }


  toggle(){
    return this.isShown.update((isShown) => !isShown);
  }


  getIdReview(idRistorante: string|number): any[]{
    return this.reviews.filter(review => review.idRistorante === idRistorante.toString());
  }
}
