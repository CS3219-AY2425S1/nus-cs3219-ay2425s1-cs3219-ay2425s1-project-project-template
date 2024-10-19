import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib/callback_api.js';
import { EnterQueueDto } from 'src/dto/EnterQueue.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';



@Injectable()
export class RabbitMQService {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  private readonly queueName = 'matching_queue';
  private readonly rabbitmqUrl = 'amqp://localhost:5672';
  private unmatchedRequests: Record<string, any> = {};

  enterQueue(enterQueueDto: EnterQueueDto): void {

    amqp.connect(this.rabbitmqUrl, (err, connection) => {
      if (err) {
        console.error('Failed to connect to RabbitMQ:', err);
        throw err;
      }

      connection.createChannel((channelErr, channel) => {
        if (channelErr) {
          console.error('Failed to create a channel:', channelErr);
          throw channelErr;
        }

        channel.assertQueue(this.queueName, { durable: false });
        console.log(
          'messegae sent is ',
          Buffer.from(JSON.stringify(enterQueueDto)),
        );
        channel.sendToQueue(
          this.queueName,
          Buffer.from(JSON.stringify(enterQueueDto)),
        );
        console.log('User sent to queue:', enterQueueDto);

        setTimeout(() => {
          connection.close();
        }, 500);
      });
    });
  }

  consumeQueue(): void {
    amqp.connect(this.rabbitmqUrl, (err, connection) => {
      if (err) {
        console.error('Failed to connect to RabbitMQ:', err);
        throw err;
      }

      connection.createChannel((channelErr, channel) => {
        if (channelErr) {
          console.error('Failed to create a channel:', channelErr);
          throw channelErr;
        }

        channel.assertQueue(this.queueName, { durable: false });
        console.log('Waiting for users in queue...');

        channel.consume(this.queueName, (msg) => {
          console.log('parsed to', JSON.parse(msg.content.toString()));
          if (msg !== null) {
            const userRequest = JSON.parse(msg.content.toString());
            console.log(
              `Received match request for user ${userRequest.userId}`,
            );
            this.matchUser(userRequest);
            channel.ack(msg);
          } else {
            console.log('Received a null user, skipping.');
          }
        });
      });
    });
  }

  private matchUser(userRequest: EnterQueueDto): void {
    const { email, categories, complexity, language } = userRequest;
    const matchingKey = `${categories}-${complexity}-${language}`;

    if (this.unmatchedRequests[matchingKey]) {
      const matchedUser = this.unmatchedRequests[matchingKey];
      console.log(`Match found between ${email} and ${matchedUser.email}`);
      delete this.unmatchedRequests[matchingKey];
      this.notifyMatchFound(email, matchedUser.email)
    } else {
      this.unmatchedRequests[matchingKey] = userRequest;
      console.log(`No match found for user ${email}, waiting for a match...`);

      setTimeout(() => {
        if (
          this.unmatchedRequests[matchingKey] &&
          this.unmatchedRequests[matchingKey].userId === email
        ) {
          console.log(`No match found for user ${email}, timing out.`);
          delete this.unmatchedRequests[matchingKey];
        }
      }, 60000);
    }
  }

  notifyMatchFound(userEmail: string, matchEmail: string) {
    const time = new Date().toISOString(); // Current timestamp in ISO format
    // const matchData = {
    //   users: [
    //     { email: userEmail, matchedWith: matchEmail },
    //     { email: matchEmail, matchedWith: userEmail },
    //   ],
    //   timestamp: new Date().toISOString(), // Current timestamp in ISO format
    // };

    // matchData.users.forEach(user => {
      const userData = {
        userEmail: userEmail,
        timestamp: time
      };
      
      const matchData = {
        userEmail: matchEmail,
        timestamp: time
      };

      // Emit the event as a JSON string
      this.eventEmitter.emit('match.found', JSON.stringify(userData));
      this.eventEmitter.emit('match.found', JSON.stringify(matchData));
      // this.eventEmitter.emit('match.found', JSON.stringify(matchData));
    // });
  }

  createSSEStream(userEmail: string): Observable<any> {
    return new Observable((subscriber) => {
      const handleMatchFound = (data) => {
        // if (data === userEmail) {
        subscriber.next(data);
        console.log("Notifying", data);

        //   console.log(data)
        // } else {
        //   console.log("NOOOO")
        //   console.log(userEmail)
        //   console.log(data)
        // }
      };

      this.eventEmitter.on('match.found', handleMatchFound);

      return () => {
        console.log("ENded")
        this.eventEmitter.off('match.found', handleMatchFound);

      };
    });
  }
}
