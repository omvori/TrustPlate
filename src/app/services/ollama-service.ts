import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  
  private apiUrl = 'http://localhost:11434/api/generate';

  constructor(private http: HttpClient){}

  generate(prompt:string): Observable<any>{
    return this.http.post(this.apiUrl,{
      model:'gemma3:4b',
      prompt: prompt,
      stream: false
    });
  }
}
