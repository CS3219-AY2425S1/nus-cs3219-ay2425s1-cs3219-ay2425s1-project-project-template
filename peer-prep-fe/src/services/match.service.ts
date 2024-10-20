import { CategoryService } from '../services/category.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import {MatchRequest, MatchResponse} from '../app/models/match.model';
import { UserData } from '../../../message-queue/src/types';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class MatchService {
    private apiUrl = 'http://localhost:3002/match';

    constructor(private http: HttpClient) {}

    // send user data and difficulty to rabbitMQ (match request)
    sendMatchRequest(userData: UserData, queueName: string): Observable<MatchRequest> {
        const matchRequest: MatchRequest = {
            userData,
            key: queueName
        }
        return this.http.post<MatchRequest>(`${this.apiUrl}`, matchRequest);
    }

    // get match response from rabbitMQ
    checkMatchResponse(queueName: string): Observable<MatchResponse> {
        return this.http.get<MatchResponse>(`${this.apiUrl}?queueName=${queueName}`);
    }
}