import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080'); // Replace with your WebSocket server URL if different
  }

  sendMessage(message: any): void {
    this.socket$.next(message); // Send the message as an object
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
