import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Session } from "../app/models/session.model"
import { Question } from "../app/models/question.model"

@Injectable({
  providedIn: "root",
})

export class CollabService {
    private baseUrl = 'http://localhost:4003/collab';
    
    constructor(private http: HttpClient) {}

    // Fetches session data by sessionId
    getSession(sessionId: string): Observable<Session> {
        return this.http.get<Session>(`${this.baseUrl}/${sessionId}`);
    }

    
}