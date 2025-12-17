import { Component,Input, OnInit } from '@angular/core';
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
export class CardsToReview {

  @Input() reviewedCard?: any
  @Input() reviews: any[] = [];


  //reviews: any[] = [];

  //constructor(private flaskService: FlaskServer){}


  /*loadReviews(){
    this.flaskService.getReviews().subscribe({
      next: (flaskReviews : any[]) =>{
        this.reviews = flaskReviews
      }
    });
  }
    

  refreshRev(){
    this.loadReviews();
  }
*/


  getIdReview(idProdotto: string|number): any[]{
    return this.reviews.filter(review => review.idProdotto === idProdotto.toString());
  }
}
