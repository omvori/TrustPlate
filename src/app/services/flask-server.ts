import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlaskServer {

  private baseUrl = "http://127.0.0.1:5000/api";

  constructor(private http: HttpClient){}
  
  getReviews(){
    return this.http.get<any[]>(`${this.baseUrl}/reviews`);
  }

  sendReview(review:any){
    return this.http.post(`${this.baseUrl}/reviews`,review)
  }

  clearReviews() {
    return this.http.delete(`${this.baseUrl}/clear`);
  }

  updateGradimento(reviewId: string,incremento:number){
    return this.http.put<any>(`${this.baseUrl}/reviews/${reviewId}/gradimento`,{incremento:incremento})

  };
}
