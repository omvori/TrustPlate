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
export class App implements OnInit,OnDestroy{
  protected readonly title = signal('Progetto Recensioni');

  reviews : any [] = jsonData;

  constructor(private flaskService: FlaskServer){}


  ngOnInit(){
    this.loadReviews();
    console.log(this.reviews)
  }

  loadReviews(){
    this.flaskService.getReviews().subscribe({
      next: (flaskReviews : any []) =>{
        this.reviews = flaskReviews.map(review => ({
          nome : review.nome || '',
          cognome: review.cognome || '',
          testoRecensione: review.testoRecensione || '',
          idProdotto: review.idProdotto || ''
        }));
      }
    });
  }

  addReview(review: any){
    //this.reviews.push(review)

    this.flaskService.sendReview(review).subscribe({
      next: (newReview: any) => {
        const formattedReview = {
          nome: (newReview.nome || '') + ' '+(newReview.cognome || ''),
          testoRecensione: newReview.testoRecensione || ''
        };
        this.reviews.push(formattedReview);
        //localStorage.setItem('reviews',JSON.stringify(this.reviews))
      }
    })
    

    //localStorage.setItem('reviews',JSON.stringify(this.reviews))
  }



 
  removeReviews(){
    //this.reviews = [];
    //localStorage.removeItem('reviews')

    this.flaskService.clearReviews().subscribe({
      next: () =>{

        this.reviews = []
        
        alert('Cancellate con successo')
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('reviews')
  }

}

