const amqp = require('amqplib/callback_api');
const RABBITMQ_URL = 'amqp://localhost';

function connectRabbitMQ() {
    amqp.connect(RABBITMQ_URL, function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }
        });
      });
}

module.exports = { connectRabbitMQ };
