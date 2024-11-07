import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { SessionResponse } from "../app/models/session.model"
import { Question } from "../app/models/question.model"
import { baseUrlProduction } from "../../constants"

@Injectable({
  providedIn: "root",
})

export class CollabService {
    private baseUrl = this.isProduction() ? `${baseUrlProduction}/collab` : "http://localhost:4003/collab";
    isProduction(): boolean {
        return window.location.hostname !== "localhost";
    }
    
    constructor(private http: HttpClient) {}

    // Fetches session data by sessionId
    getSession(sessionId: string): Observable<SessionResponse> {
        return this.http.get<SessionResponse>(`${this.baseUrl}/${sessionId}`);
    }

    // Save code
    saveSession(docId: string, code: string): Observable<any> {
      return this.http.post<void>(`${this.baseUrl}/save`, {
        documentId: docId,
        code: code
      })
    }

    
}