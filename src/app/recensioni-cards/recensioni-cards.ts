import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataChildChild } from '../services/data-child-child';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-recensioni-cards',
  standalone: false,
  templateUrl: './recensioni-cards.html',
  styleUrl: './recensioni-cards.css',
})
export class RecensioniCards {

  @Input() reviewData?: any
  //@Output() reviewedCard = new EventEmitter<any>()

  //inviaRec(){
  //  return this.reviewedCard.emit(this.reviewData)
  // }+


  constructor(private dataService: DataChildChild ){
  }

  sendData(){
    this.dataService.changeData(this.reviewData)
  }


}
