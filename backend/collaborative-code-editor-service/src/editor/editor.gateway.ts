import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EditorService } from './editor.service';
import { set } from 'mongoose';

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

  private sessionTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly editorService: EditorService) { }

  async handleConnection(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    const questionId = client.handshake.query.questionId as string;
    const username = client.handshake.query.username as string;
    const username_socket_id = `${username}:${client.id}`

    console.log('Client connected', username_socket_id, sessionId, questionId);

    try {
      await this.editorService.addUserToSession(sessionId, username_socket_id);

      let session = await this.editorService.getSessionIfActive(sessionId);
      // TODO: Remove later
      if (!session) {
        session = await this.editorService.createSessionIfNotCompleted(sessionId);
      }
      console.log('Session', session);

      if (session) {
        const questionAttempt = session.questionAttempts.find(
          qa => qa.questionId === questionId
        );

        if (questionAttempt) {
          console.log('Initial code sent', questionAttempt.currentCode, questionAttempt.currentLanguage);
          client.emit('codeChange', {
            code: questionAttempt.currentCode,
            language: questionAttempt.currentLanguage
          });
        } else {
          console.log('Calling createQuestionAttempt', sessionId, questionId, username_socket_id);
          await this.editorService.createQuestionAttempt(sessionId, questionId);
        }

        let activeUsers = await this.editorService.getActiveUsers(sessionId);
        activeUsers = activeUsers.filter(userId => this.server.sockets.sockets.get(userId.split(':')[1])?.connected ?? false);
        console.log('Active users', activeUsers);
        this.editorService.setActiveUsers(sessionId, activeUsers);
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
    const username = client.handshake.query.username as string;
    const username_socket_id = `${username}:${client.id}`


    console.log('Client disconnected', username_socket_id, sessionId, questionId);

    try {
      await this.editorService.removeUserFromSession(sessionId, username_socket_id);

      let activeUsers = await this.editorService.getActiveUsers(sessionId);
      // activeUsers = activeUsers.filter(userId => this.server.sockets.sockets.get(userId.split(':')[1])?.connected ?? false);
      // console.log('Active users', activeUsers);
      // this.editorService.setActiveUsers(sessionId, activeUsers);
      this.server.to(`${sessionId}:${questionId}`).emit('activeUsers', activeUsers);
      if (activeUsers.length === 0) {
        // Clear any existing timeout for this session
        if (this.sessionTimeouts.has(sessionId)) {
          clearTimeout(this.sessionTimeouts.get(sessionId));
        }

        // Create new timeout
        const timeout = setTimeout(async () => {
          try {
            // Remove the timeout from the map once it executes
            this.sessionTimeouts.delete(sessionId);

            const currentActiveUsers = await this.editorService.getActiveUsers(sessionId);
            // const filteredUsers = currentActiveUsers.filter(
            //   userId => this.server.sockets.sockets.has(userId.split(':')[1])
            // );

            // this.editorService.setActiveUsers(sessionId, filteredUsers);

            if (currentActiveUsers.length === 0) {
              await this.editorService.completeSession(sessionId);
              this.server.to(`${sessionId}:${questionId}`).emit('sessionCompleted');
            }
          } catch (error) {
            console.error('Error in completion timeout handler:', error);
          }
        }, 1000);

        // Store the new timeout
        this.sessionTimeouts.set(sessionId, timeout);
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
      console.log('Code changed', sessionId, questionId, code, language);
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