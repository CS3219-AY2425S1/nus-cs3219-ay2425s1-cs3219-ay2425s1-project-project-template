const amqp = require('amqplib');

const reqCh = process.env.RABBITMQ_REQ_CH;
const resCh = process.env.RABBITMQ_RES_CH;

let requests = [];


const matchUsers = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false }); // A (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false }); // B (topic)

    //Waiting for user details to come in
    const q = await channel.assertQueue('', { exclusive: true }) // Bind to A
    channel.bindQueue(q.queue, reqCh);

    channel.consume(q.queue, msg => {
        user = JSON.parse(msg.content.toString());

        //""" YOUR CODE HERE """

        if (requests.length == 0) {
            requests.push(user);
        } else {
            //For now I just match the first 2 people that enters.
            const user1 = user;
            const user2 = requests.pop();
            result = JSON.stringify({ matched: true, user1: user1.id, user2: user2.id });
            channel.publish(resCh, user1.id, Buffer.from(JSON.stringify(result))); // B to D
            channel.publish(resCh, user2.id, Buffer.from(JSON.stringify(result)));
        }

        //""" YOUR CODE END HERE """

        //TOCHANGE: timeout to 30000.
        setTimeout(() => {
            if (requests.filter(request => request.id == user.id).length != 0) {
                //Remove from list
                console.log(`No match found for user ${user.id}`)
                requests = requests.filter(request => request.id !== user.id);
                result = JSON.stringify({ matched: false, user1: "", user2: "" });
                channel.publish(resCh, user.id, Buffer.from(result)); //B to D
            }
        }, 3000)
    }, { noAck: true });

    console.log("Matching queues initalized.");
}



const handleMatchRequest = async (user) => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false });  // C (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false });  // D (topic)

    //Sending user details
    channel.publish(reqCh, '', Buffer.from(JSON.stringify(user))); // C to A
    console.log(`Sent user ${user.id} for matching.`);

    //Comsuming results
    const q = await channel.assertQueue('', { exclusive: true }) // Bind to D
    channel.bindQueue(q.queue, resCh, user.id);

    // Dummy user, can use to test if matching is working.
    // const user_details2 = { id: '2', complexity: ['A, B'], difficulty: 'Easy' };
    // channel.publish(reqCh, '', Buffer.from(JSON.stringify(user_details2)));

    //Waiting for results
    channel.consume(q.queue, msg => {
        console.log(`Results: ${msg.content.toString()}`);
        result = JSON.parse(msg.content.toString());
        return result;
    }, { noAck: true });


    setTimeout(() => {
        //If by 60 seconds no response, return not matched.
        return { matched: false, user1: "", user2: "" };
    }, 60000)
}

module.exports = { matchUsers, handleMatchRequest };