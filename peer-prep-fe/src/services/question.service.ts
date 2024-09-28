import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Question } from "../app/models/question.model";
@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private baseUrl = 'http://localhost:8080/questions'
  constructor(private http: HttpClient) { }

  getAllQuestion(): Observable<Question[]> {
    return this.http.get<Question[]>(this.baseUrl);
  }

  // separate function from ^ for clarity 
  getAllQuestionSorted(sortBy?: string, orderBy?:string): Observable<Question[]> {
    const url = (sortBy && orderBy) ? `${this.baseUrl}?sortBy=${sortBy}&orderBy=${orderBy}` : this.baseUrl;
    return this.http.get<Question[]>(url);
  }

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
