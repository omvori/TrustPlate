import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recensioni-cards',
  standalone: false,
  templateUrl: './recensioni-cards.html',
  styleUrl: './recensioni-cards.css',
})
export class RecensioniCards {

  @Input() reviewData?: any

  constructor(){
    
  }

}
