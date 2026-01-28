import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* comando per avviare ollama senza restrizioni su angular : 
$env:OLLAMA_ORIGINS="*"; ollama serve */

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  
  private apiUrl = 'http://localhost:11434/api/generate';

  constructor(private http: HttpClient){}

  generate(prompt:string): Observable<any>{
    return this.http.post(this.apiUrl,{
      model:'gemma3:4b', /* qwen3:4b = prestazioni scadenti  , llama3-chatqa:8b = non capisce il contesto, gemma3:4b = il migliore   */
      prompt: prompt,
      stream: false
    });
  }
}