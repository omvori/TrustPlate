import { Component,OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import { FlaskServer } from '../services/flask-server';
import jsonData from '../backEnd/reviews.json'


@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit,OnDestroy {

  reviews : any [] = [];
  showHero: boolean = true;

  constructor(private flaskService: FlaskServer,private cdr:ChangeDetectorRef){}


  ngOnInit(){
    if('scrollRestoration' in history){
      history.scrollRestoration ='manual';
    }
    window.scrollTo(0,0);
    document.body.style.overflow = 'hidden';
    this.showHero = true;
    this.loadReviews();
    console.log(this.reviews)
  }
  
  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    
  }

  scrollToMain(){
    const element = document.getElementById('main-content');
    if(element){
      element.scrollIntoView({
        behavior:'smooth',
        block:'start'
      });
      setTimeout(() =>{
        this.showHero = false;
        window.scrollTo(0,0);
        document.body.style.overflow = 'auto';
        this.cdr.detectChanges();
        
        setTimeout(() =>{
          window.scrollTo(0,0);
          document.body.style.overflow = 'auto';
        },10)
      
      },1000)
    }
  }
  

  
  loadReviews(){

    this.flaskService.getReviews().subscribe({
      next: (flaskReviews : any []) =>{
        console.log('Recensioni del server:',flaskReviews)
        this.reviews = flaskReviews.map(review => ({
          id: review.id || '',
          nome : review.nome || '',
          cognome: review.cognome || '',
          testoRecensione: review.testoRecensione || '',
          idRistorante: review.idRistorante || '',
          gradimento: review.gradimento || 0
        }));
        this.cdr.detectChanges();

      }
    });
  }

  addReview(review: any){
    //this.reviews.push(review)

    this.flaskService.sendReview(review).subscribe({
      next: (newReview: any) => {
        const formattedReview = {
          nome: newReview.nome || '',
          cognome: newReview.cognome || '',
          testoRecensione: newReview.testoRecensione || '',
          idRistorante: newReview.idRistorante
        };
        this.reviews.push(formattedReview);
        this.loadReviews()
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
}
