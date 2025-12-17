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
  idProdotto = '';
  isSubmitting = false;

  foodInMemory: Food[] = [
    {value:'1',viewValue:'Cappelletti con patate fontina e manzo'},
    {value:'2',viewValue:'Tortellini con uova di salmone'},
    {value:'3',viewValue:'Spaghetti con bisque di gamberetti'},
    {value:'4',viewValue:'Insalata 3D con feta,melone e cetrioli (minecraft edition)'},
    {value:'5',viewValue:'Tonno scottato in crosta di sesamo'},
    {value:'6',viewValue:'Tranche di salmone con pistacchio sciolto'}
  ]
  
  inviaRecensione() {
    if (!this.nome || !this.cognome || !this.testoRecensione || !this.idProdotto) { 
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
    this.idProdotto = '';
    this.isSubmitting = false;
    
    alert('Recensione inviata con successo');

    return recensione
  }

  // result = this.inviaRecensione


}