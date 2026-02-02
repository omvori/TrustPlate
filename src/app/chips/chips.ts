import { Component,Input, model,OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { OllamaService } from '../services/ollama-service';



@Component({
  selector: 'app-chips',
  standalone: false,
  templateUrl: './chips.html',
  styleUrl: './chips.css',
})
export class Chips implements OnChanges {

  @Input() contenutoAi = '';
  chipsAi: string = '';
  isLoadingChips: boolean = false;

  constructor (
    private ollamaService: OllamaService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnChanges(changes: SimpleChanges){
    
    if (changes['contenutoAi'] && this.contenutoAi){
      this.generateChips();
      this.cdr.detectChanges();
    }
    
  }

  
  generateChips(){

    if (this.contenutoAi) {

      this.isLoadingChips = true;

      const promptTemplate = 
      `in base a ${this.contenutoAi} forniscimi un riassunto in 3 parole che 
      descrivono l'umore generale del ristorante.
      **DA TENERE A MENTE**
      -Non inventare parole strane
      -Sii coerente con quello che dice il ${this.contenutoAi}
      -Usa aggettivi consoni 
      -Massimo 3 parole`

      this.ollamaService.generate(promptTemplate,'gemma3:4b',11435).subscribe({
        next:(data)=>{
          this.chipsAi = data.response;
          console.log("server 11435 acceso");
          this.isLoadingChips = false;
          this.cdr.detectChanges();
        }

      });

    }


    }


}
