import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Session } from "../app/models/session.model"
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
    getSession(sessionId: string): Observable<Session> {
        return this.http.get<Session>(`${this.baseUrl}/${sessionId}`);
    }

    
}