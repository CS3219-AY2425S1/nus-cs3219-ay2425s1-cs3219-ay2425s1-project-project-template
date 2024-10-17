const amqp = require('amqplib');

let waitingUsers = []; 

async function findMatch(user) {
    const { difficulty, topic, language } = user;

    const matchIndex = waitingUsers.findIndex((waitingUser) =>
        waitingUser.difficulty === difficulty &&
        waitingUser.topic === topic &&
        waitingUser.language === language
    );

    if (matchIndex !== -1) {
        // Found a match
        const matchedUser = waitingUsers[matchIndex];
        console.log(`Matched users: ${user.username} and ${matchedUser.username}`);
        
        // Remove matched users from waiting list
        waitingUsers.splice(matchIndex, 1);
        return true;
    }

    // No match found, add user to waiting list
    waitingUsers.push(user);
    console.log(`User ${user.username} added to waiting list.`);

    setTimeout(() => {
        const userIndex = waitingUsers.findIndex(waitingUser => waitingUser.username === user.username);
        if (userIndex !== -1) {
            waitingUsers.splice(userIndex, 1);
            console.log(`Time's up! User ${user.username} removed from the waiting list`);
        }
    }, 30000);

    return false; // Return false if no match was found
}

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'matching-queue';

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const matchData = JSON.parse(msg.content.toString());
                findMatch(matchData);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

module.exports = startConsumer;
