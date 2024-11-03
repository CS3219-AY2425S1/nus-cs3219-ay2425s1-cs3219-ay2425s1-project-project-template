import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EditorService } from './editor.service';

interface CodeChangePayload {
  sessionId: string;
  questionId: string;
  code: string;
  language: string;
}

interface SubmissionPayload {
  sessionId: string;
  questionId: string;
  code: string;
  language: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly editorService: EditorService) {}

  async handleConnection(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    const questionId = client.handshake.query.questionId as string;
    
    try {
      await this.editorService.addUserToSession(sessionId, client.id);
      
      const session = await this.editorService.getSession(sessionId);
      if (session) {
        const questionAttempt = session.questionAttempts.find(
          qa => qa.questionId === questionId
        );
        
        if (questionAttempt) {
          client.emit('codeChange', {
            code: questionAttempt.currentCode,
            language: questionAttempt.currentLanguage
          });
        } else {
          await this.editorService.createQuestionAttempt(sessionId, questionId);
        }
        
        const activeUsers = await this.editorService.getActiveUsers(sessionId);
        this.server.to(sessionId).emit('activeUsers', activeUsers);
      }
      
      client.join(`${sessionId}:${questionId}`);
      client.to(`${sessionId}:${questionId}`).emit('userJoined', client.id);
    } catch (error) {
      console.error('Error in handleConnection:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    const questionId = client.handshake.query.questionId as string;
    
    try {
      await this.editorService.removeUserFromSession(sessionId, client.id);
      
      const activeUsers = await this.editorService.getActiveUsers(sessionId);
      this.server.to(`${sessionId}:${questionId}`).emit('activeUsers', activeUsers);
      
      client.leave(`${sessionId}:${questionId}`);
    } catch (error) {
      console.error('Error in handleDisconnect:', error);
    }
  }

  @SubscribeMessage('codeChange')
  async handleCodeChange(client: Socket, payload: CodeChangePayload) {
    const { sessionId, questionId, code, language } = payload;
    
    try {
      await this.editorService.updateQuestionCode(sessionId, questionId, code, language);
      client.to(`${sessionId}:${questionId}`).emit('codeChange', { code, language });
    } catch (error) {
      console.error('Error in handleCodeChange:', error);
      client.emit('error', 'Failed to update code');
    }
  }

  @SubscribeMessage('submitCode')
  async handleSubmission(client: Socket, payload: SubmissionPayload) {
    const { sessionId, questionId, code, language } = payload;
    
    try {
      await this.editorService.submitQuestionAttempt(sessionId, questionId, {
        code,
        language,
        submittedBy: client.id,
      });
      
      this.server.to(`${sessionId}:${questionId}`).emit('submissionMade', {
        submittedBy: client.id,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error in handleSubmission:', error);
      client.emit('error', 'Failed to submit code');
    }
  }
}