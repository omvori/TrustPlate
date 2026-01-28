import { Component, OnInit,Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlaskServer } from '../services/flask-server';
import { OllamaService } from '../services/ollama-service';

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
  
  /*roba Ai*/
  contenutoAi: string = '';
  isLoadingAi: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private flaskService: FlaskServer,
    private cdr:ChangeDetectorRef,
    private ollamaService: OllamaService
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


  generateComment(){

    if(this.ristoReview.length === 0){
      this.contenutoAi = "Dati non sufficienti, impossibile fornire una risposta adatta.";
      return;
    }

    this.isLoadingAi = true;
    this.contenutoAi = '';

    const testoRecensioni = this.ristoReview.map((r,index)=>{
      return `${index + 1}) ${r.testoRecensione}`;
    }).join('\n');

    const promptTemplate = `Sei un analista esperto e conciso di recensioni.
      Ecco un elenco di recensioni reali:

      ${testoRecensioni}

      Compito:
      ## Descrivi l'opinione generale in una frase di 5 righe massimo.Elencando eventuali problemi gravi (es. igiene, allergie) usando un elenco puntato (es. •problema numero 1). Se non ce ne sono, scrivi "Nessuno".
      ## Valutazione: Assegna un voto da 1 a 5 stelle usando l'emoji ⭐.

      Vincoli:
      - Sii moderatamente sintetico.
      - Non usare frasi introduttive o di chiusura (vai dritto al punto).`;
      
    console.log("prompt inviato: ", promptTemplate);

    this.ollamaService.generate(promptTemplate).subscribe({
      next:(data)=>{
        this.contenutoAi = data.response;
        this.isLoadingAi = false;
        this.cdr.detectChanges();
      }
    });


  }

}