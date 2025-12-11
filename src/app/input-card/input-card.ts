import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel, MatHint, MatError } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import jsonData from '../backEnd/reviews.json'

@Component({
  selector: 'app-input-card',
  templateUrl: './input-card.html', 
  styleUrls: ['./input-card.css'],  
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatProgressSpinner, MatIcon]
})
export class InputCardComponent { 
  @Output() newReview = new EventEmitter<any>();
  
  nome = '';
  cognome = '';
  testoRecensione = '';
  idProdotto = '';
  isSubmitting = false;

  inviaRecensione() {
    if (!this.nome || !this.cognome || !this.testoRecensione || this.idProdotto) { 
      alert('Per favore compila tutti i campi');
      return;
    }
    
    this.isSubmitting = true;

    const recensione = {
      nome: this.nome,
      cognome : this.cognome,
      testoRecensione : this.testoRecensione,
      idProdotto : this.idProdotto
    };
    
    this.newReview.emit(recensione);
    
    this.nome = '';
    this.cognome = '';
    this.testoRecensione = '';
    this.isSubmitting = false;
    
    alert('Recensione inviata con successo');

    return recensione
  }

  result = this.inviaRecensione


}