import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel, MatHint, MatError } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import jsonData from '../backEnd/reviews.json'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuData } from '../services/menu-data';
import {MatSelectModule} from '@angular/material/select';


interface Food{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-input-card',
  templateUrl: './input-card.html', 
  styleUrls: ['./input-card.css'],  
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormField, MatLabel, MatIcon, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,MatSelectModule ]
})  


export class InputCardComponent { 
  @Output() newReview = new EventEmitter<any>();
  
  constructor(public _menudata: MenuData,){}
  
  nome = '';
  cognome = '';
  testoRecensione = '';
  idRistorante = '';
  isSubmitting = false;

  foodInMemory: Food[] = [
    {value:'1',viewValue:'Da Gustave'},
    {value:'2',viewValue:'Lune s Dream'},
    {value:'3',viewValue:'Maelle s Sorrow'},
    {value:'4',viewValue:'Sciel and Cariddi'},
    {value:'5',viewValue:'Verso s Piano'},
    {value:'6',viewValue:'Esquie s Rocks'}
  ]
  
  inviaRecensione() {
    if (!this.nome || !this.cognome || !this.testoRecensione || !this.idRistorante) { 
      alert('Per favore compila tutti i campi');
      return;
    }
    
    this.isSubmitting = true;

    const recensione = {
      nome: this.nome,
      cognome : this.cognome,
      testoRecensione : this.testoRecensione,
      idRistorante : this.idRistorante
    };
    
    this.newReview.emit(recensione);
    
    this.nome = '';
    this.cognome = '';
    this.testoRecensione = '';
    this.idRistorante = '';
    this.isSubmitting = false;
    
    alert('Recensione inviata con successo');

    return recensione
  }

  // result = this.inviaRecensione


}