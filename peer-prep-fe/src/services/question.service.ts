import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private baseUrl = 'http://localhost:8080/questions'
  constructor(private http: HttpClient) { }

  getQuestion(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateQuestion(id: string, updatedQuestion: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updatedQuestion);
  }

  addQuestion(newQuestion: any): Observable<any> {
    return this.http.post(this.baseUrl, newQuestion);
  }
}
