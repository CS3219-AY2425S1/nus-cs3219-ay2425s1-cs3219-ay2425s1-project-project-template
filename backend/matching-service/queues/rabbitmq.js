const amqp = require('amqplib/callback_api');

let channel = null;

const initRabbitMQ = () => {
  amqp.connect('amqp://127.0.0.1', function (error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function (error1, ch) {
      if (error1) throw error1;
      channel = ch;

      const requestQueue = 'match_request_queue';
      const replyQueue = 'match_reply_queue';

      channel.assertQueue(requestQueue, { durable: true });
      channel.assertQueue(replyQueue, { durable: true });

      console.log("RabbitMQ connected and queues are ready.");
    });
  });
};

const getChannel = () => channel;

module.exports = { initRabbitMQ, getChannel };
