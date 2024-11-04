import { CategoryService } from '../services/category.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import {MatchRequest, MatchResponse} from '../app/models/match.model';
import { UserData } from '../types/userdata';

import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MatchService {
    private apiUrl = 'http://localhost:3002/match';

    constructor(private http: HttpClient) {}

    // send user data and difficulty to rabbitMQ (match request)
    // this is a post request, which returns a response 
    async sendMatchRequest(userData: UserData, queueName: string): Promise<MatchResponse> {
        const matchRequest: MatchRequest = {
            userData,
            key: queueName
        }
        // return lastValueFrom(this.http.post<MatchResponse>(`${this.apiUrl}`, matchRequest));
        const response = await this.http.post<MatchResponse>(`${this.apiUrl}`, matchRequest).toPromise();
        if (!response) {
            throw new Error('Match response is undefined');
        }
        return response;
    }
}
