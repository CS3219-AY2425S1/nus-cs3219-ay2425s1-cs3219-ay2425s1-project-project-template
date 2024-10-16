var amqp = require('amqplib/callback_api');
const { json } = require('express');

exports.send = (complexity, category) => {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            console.log("here")
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'match_queue';
            var msg = { complexity: complexity, category: category };

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}
