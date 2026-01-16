import { Component,Input, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { FlaskServer } from '../services/flask-server';

@Component({
  selector: 'app-like-dislike-component',
  standalone: false,
  templateUrl: './like-dislike-component.html',
  styleUrl: './like-dislike-component.css',
})
export class LikeDislikeComponent implements OnInit,OnChanges {
  
  
  @Input() reviewId!:string
  @Input() initialLikes: number = 0;
  @Input() initialDislikes: number = 0;
  
  numberOfLikes : number = 0 ;
  numberOfDislikes : number = 0; 
  
  constructor(private flaskService: FlaskServer){}

  ngOnInit() {
    this.numberOfLikes = this.initialLikes
    this.numberOfDislikes = this.initialDislikes
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.numberOfLikes = this.initialLikes
  }

  likeButtonClick(){
    if(this.reviewId){
      this.flaskService.updateGradimento(this.reviewId,1).subscribe({
        next:(response)=>{
          this.numberOfLikes = response.nuovo_gradimento;
        },
        error: (errore) =>{
          console.error("Errore nel like",errore);
          this.numberOfLikes++;
        }
      });
    } else{
      this.numberOfLikes++;
    }
  }

  dislikeButtonClick(){
    if(this.reviewId){
      this.flaskService.updateContrasto(this.reviewId,-1).subscribe({
        next: (response)=>{
          this.numberOfDislikes = response.nuovo_contrasto;
        }, error: (errore)=>{
          console.error("Errore nel dislike",errore);
          this.numberOfDislikes--;
        }
      });
    }else{
      this.numberOfDislikes--;
    }
  }

  

 
}
