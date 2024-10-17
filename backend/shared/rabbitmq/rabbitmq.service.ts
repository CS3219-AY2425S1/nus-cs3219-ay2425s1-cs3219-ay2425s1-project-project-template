import { Injectable } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import {Channel} from 'amqplib';

@Injectable()
export class RabbitMQService {
    constructor(private readonly config: {url: String}) {}
    private connection: amqp.AmqpConnectionManager
    private channel: amqp.ChannelWrapper

    async connect(url: string) {
        this.connection = amqp.connect(url)
        this.channel = this.connection.createChannel({
            json: true,
            setup: () => {
                console.log('RabbitMq connected')
            }
        })
    }

    async sendToQueue(queueName: string, message: any) {
        await this.channel.sendToQueue(queueName, message)
    }

    async consumeFromQueue(queueName: string, callback: (message: any)=> Promise<void>) {
        await this.channel.addSetup(async (chan: Channel)=> {
            await chan.consume(queueName, message => {
                if (message) {
                    callback(JSON.parse(message.content.toString()))
                    chan.ack(message)
                }
            })

            console.log(`Consumer connection to ${queueName} is setup`)
        })
    }

}
