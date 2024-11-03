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
    const userId = client.handshake.query.userId as string;
    
    try {
      await this.editorService.addUserToSession(sessionId, userId);
      
      let session = await this.editorService.getSessionIfActive(sessionId);
      // TODO: Remove later
      if (!session) {
        session = await this.editorService.createSession(sessionId);
      }
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
        client.join(`${sessionId}:${questionId}`);
        this.server.to(`${sessionId}:${questionId}`).emit('activeUsers', activeUsers);
      }
    } catch (error) {
      console.error('Error in handleConnection:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    const questionId = client.handshake.query.questionId as string;
    const userId = client.handshake.query.userId as string;
    
    try {
      await this.editorService.removeUserFromSession(sessionId, userId);
      
      const activeUsers = await this.editorService.getActiveUsers(sessionId);
      this.server.to(`${sessionId}:${questionId}`).emit('activeUsers', activeUsers);
      if (activeUsers.length === 0) {
        await this.editorService.completeSession(sessionId);
      }
      client.leave(`${sessionId}:${questionId}`);
      client.disconnect();
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
      });
      
      this.server.to(`${sessionId}:${questionId}`).emit('submissionMade', {
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error in handleSubmission:', error);
      client.emit('error', 'Failed to submit code');
    }
  }
}