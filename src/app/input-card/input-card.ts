import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-card',
  templateUrl: './input-card.html', 
  styleUrls: ['./input-card.css'],  
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class InputCardComponent { 
  @Output() newReview = new EventEmitter<any>();
  
  nome = '';
  cognome = '';
  testoRecensione = '';
  valutazione = 0;
  isSubmitting = false;

  inviaRecensione() {
    if (!this.nome || !this.cognome || !this.testoRecensione) { 
      alert('Per favore compila tutti i campi');
      return;
    }
    
    this.isSubmitting = true;

    const recensione = {
      name: this.nome + ' ' + this.cognome,
      text: this.testoRecensione,
    };
    
    this.newReview.emit(recensione);
    
    this.nome = '';
    this.cognome = '';
    this.testoRecensione = '';
    this.valutazione = 0;
    this.isSubmitting = false;
    
    alert('Recensione inviata con successo');

    return recensione
  }

  result = this.inviaRecensione


}