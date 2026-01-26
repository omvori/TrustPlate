import { Injectable } from '@angular/core';
import {GoogleGenerativeAI} from '@google/generative-ai'
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GeminiAi {


  private genAi: GoogleGenerativeAI;
  private model: any;

  constructor(){
    this.genAi = new GoogleGenerativeAI(environment.API_KEY)

    this.model = this.genAi.getGenerativeModel({model:'gemini-2.5-flash-lite'});

    

  }
}
