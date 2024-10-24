import amqp from 'amqplib';
const RABBITMQ_URL = 'amqp://localhost';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        console.log('Succesfully connected to RabbitMQ.');
        return { connection, channel };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        return null;
    }
}

export default connectRabbitMQ;
