import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib/callback_api.js';
import { EnterQueueDto } from 'src/dto/EnterQueue.dto';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

@Injectable()
export class RabbitMQService {
  private readonly queueName = 'matching_queue';
  private readonly rabbitmqUrl = 'amqp://rabbitmq';
  private unmatchedRequests: Record<string, any> = {};

  enterQueue(enterQueueDto: EnterQueueDto): void {
    // const jwtToken = localStorage.getItem('access_token');
    // let decodedToken: CustomJwtPayload | null = null;

    // if (jwtToken) {
    //   decodedToken = jwtDecode<CustomJwtPayload>(jwtToken);
    // } else {
    //   console.log('No token found in localStorage');
    // }

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
}
