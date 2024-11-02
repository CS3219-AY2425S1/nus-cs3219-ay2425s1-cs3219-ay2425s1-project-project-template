import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;

  constructor() {}

  connect(sessionId: string): void {
    if (this.socket$) {
      this.disconnect();
    }
    this.socket$ = webSocket(`ws://localhost:8081/${sessionId}`); // Replace with your WebSocket server URL if different
  }

  sendMessage(message: any): void {
    this.socket$.next(message); // Send the message as an object
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  disconnect(): void {
    this.socket$.complete(); // Close the WebSocket connection
  }
}
