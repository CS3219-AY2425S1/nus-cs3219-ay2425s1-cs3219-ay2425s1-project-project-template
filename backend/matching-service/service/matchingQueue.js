const amqp = require('amqplib');

const reqCh = process.env.RABBITMQ_REQ_CH;
const resCh = process.env.RABBITMQ_RES_CH;

let requests = [];
//TOCHANGE: timeout to 30000.
let timeout = 5000;

const matchUsers = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false }); // A (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false }); // B (topic)

    const q = await channel.assertQueue('', { exclusive: true }) // Bind to A
    channel.bindQueue(q.queue, reqCh);

    //Waiting for user details to come in
    channel.consume(q.queue, msg => {
        const newRequest = JSON.parse(msg.content.toString());

        let matchedCategory = requests.filter(function(req) {
            return req.category == newRequest.category
        })
        let matchedDiffculty = requests.filter(function(req) {
            return req.difficulty == newRequest.difficulty
        })



        if (matchedCategory.length == 0) {
            requests.push(newRequest);
        } else {
            //For now I just match the first 2 people that enters.
            const request1 = newRequest;
            const request2 = requests.pop();
            result = JSON.stringify({ matched: true, 
                                      user1: request1.id, 
                                      user2: request2.id,  
                                      category: request1.category,
                                      difficulty: request1.difficulty
                                    });
            channel.publish(resCh, newRequest.id, Buffer.from(JSON.stringify(result))); // B to D
            channel.publish(resCh, request2.id, Buffer.from(JSON.stringify(result)));
        }

        setTimeout(() => {
            if (handleDeleteRequest(newRequest)) {
                result = { matched: false, user1: newRequest.id, user2: "" };
                channel.publish(resCh, newRequest.id, Buffer.from(JSON.stringify(result))); //B to D
            }
        }, timeout)
    }, { noAck: true });

    console.log("Matching queues initalized.");
}


const handleMatchRequest = async (user) => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(reqCh, 'fanout', { durable: false });  // C (fanout)
    await channel.assertExchange(resCh, 'topic', { durable: false });  // D (topic)

    const q = await channel.assertQueue('', { exclusive: true }) // Bind to D
    channel.bindQueue(q.queue, resCh, user.id);

    //Sending user details
    channel.publish(reqCh, '', Buffer.from(JSON.stringify(user))); // C to A
    console.log(`Sent user ${user.id} for matching.`);

    //Waiting for results
    let recevied = false;
    channel.consume(q.queue, msg => {
        console.log(`User ${user.id} ~ Result: ${msg.content.toString()}`);
        result = JSON.parse(msg.content.toString());
        recevied = true;
        return result;
    }, { noAck: true });


    setTimeout(() => {
        //If by 60 seconds no response, return not matched.
        if (!recevied) {
            console.log(`60 seconds time out for matching for user ${user.id}`)
            return { matched: false, user1: "", user2: "" };
        }
        connection.close();
    }, 60000)
}

const handleDeleteRequest = (user) => {
    if (requests.filter(request => request.id == user.id).length != 0) {
        requests = requests.filter(request => request.id !== user.id);
        console.log(`User ${user.id} deleted.`)
        return true;
    }
    return false;
}

module.exports = { matchUsers, handleMatchRequest, handleDeleteRequest };