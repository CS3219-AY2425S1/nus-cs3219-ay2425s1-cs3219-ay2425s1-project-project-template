import amqp from "amqplib/callback_api";
import { Options } from "amqplib/callback_api";
import AmqpConnectionError from "./errors/amqpConnectionError";
import AmqpCreateChannelError from "./errors/amqpCreateChannelError";
import { error } from "console";

amqp.connect(function(error0: AmqpConnectionError, connection: amqp.Connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1: AmqpCreateChannelError, channel: amqp.Channel) {
        if (error1) {
            throw error1;
        }
        const queue: string = "hello";
        const msg: string = "hello world";

        const options: Options.AssertQueue = {
            durable: false,
        }

        channel.assertQueue(queue, options);
        for (let i = 0; i < 5; i++) {
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        }
    });
    setTimeout(function() {
        connection.close();
    }, 500);
})

amqp.connect(function(error0: AmqpConnectionError, connection: amqp.Connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1: AmqpCreateChannelError, channel: amqp.Channel) {
        if (error1) {
            throw error1;
        }
        var queue = "hello";
        var options: Options.AssertQueue = {
            durable: false,
        }
        channel.assertQueue(queue, options);
        
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg: amqp.Message | null) {
            if (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }
        }, {
            noAck: true
        });
    })
})