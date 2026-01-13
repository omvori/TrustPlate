import { Component, OnInit,Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlaskServer } from '../services/flask-server';

@Component({
  selector: 'app-pagina-ristoranti',
  standalone: false,
  templateUrl: './pagina-ristoranti.html',
  styleUrl: './pagina-ristoranti.css',
})
export class PaginaRistoranti implements OnInit{

  ristoranteId: string = '';
  allreviews: any[] = [];  
  ristoReview: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private flaskService: FlaskServer,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ristoranteId = params['id'];
      console.log('ID Ristorante dalla route:', this.ristoranteId);
      this.caricaRecensioniRisto()
    });
  }

  caricaRecensioniRisto(){
    this.flaskService.getReviews().subscribe({
      next: (recensioni: any[]) => {
        console.log('Recensioni dal server:', recensioni);
        
        this.allreviews = recensioni;
        
        this.ristoReview = recensioni.filter(recensione => 
          recensione.idRistorante?.toString() === this.ristoranteId
        );
        
        console.log('Recensioni filtrate:', this.ristoReview);
        this.cdr.detectChanges();
      }
    });

  }

  getIdReview(idRistorante:string|number):any[]{
    return this.ristoReview.filter(review => review.idRistorante === idRistorante.toString())
  }
}