import { Component, signal } from '@angular/core';
import { ExampleComponent } from './example/example';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Progetto Recensioni');


  reviews : any [] = [];
  

  addReview(review: any){
    this.reviews.push(review)

    localStorage.setItem('reviews',JSON.stringify(this.reviews))
  }

  ngOnInit(){
    const savedRev = localStorage.getItem('reviews')
  
    if(savedRev){
      this.reviews = JSON.parse(savedRev)
    } else{
      this.reviews = [{
          name: 'Mario Rossi',
          text: 'servizio eccellente molto soddisfatto'
      },
        {
            name: 'Laura Bianchi',
            text: 'buona esperienza consigliato.'
        }
      ];
    }
  }

 
  removeReviews(){
    this.reviews = [];
    localStorage.removeItem('reviews')
  }

}

