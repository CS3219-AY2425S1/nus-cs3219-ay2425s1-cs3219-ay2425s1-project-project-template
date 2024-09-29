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

  getFilteredQuestions(filterBy?: string, filterValues?: string): Observable<Question[]> {
    const url = filterBy ? `${this.baseUrl}?filterBy=${filterBy}&filterValues=${filterValues}` : this.baseUrl;
    // const url = `${this.baseUrl}?filterBy=question_categories&filterValues=Arrays`;
    return this.http.get<Question[]>(url);
  }
  
  getQuestionCategories(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/categories`);
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

  searchQuestion(searchTerm: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?prefix=${searchTerm}`);
  }
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
