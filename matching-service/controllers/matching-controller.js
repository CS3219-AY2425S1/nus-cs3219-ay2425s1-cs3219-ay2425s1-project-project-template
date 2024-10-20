const { send } = require('../rabbit/rabbit.js')

const ROUTING_KEY = 'USER-ROUTING-KEY'

// TODO: Processes match request and finds 
exports.processMatchRequest = (channel) => {
    return (data) => {
        console.log('Matching service received: ', data)
        if (data) {
            console.log("working??", data)
            const message = data.content.toString()
            const parsedData = JSON.parse(message)

            const user1Id = parsedData["id"]
            const user2Id = "temp id"
            const user1SocketId = parsedData["socketId"]
            const user2SocketId = "temp socket id"
            
            const payload = { user1Id, user2Id, user1SocketId, user2SocketId }
            console.log("json parsed in matching: ", JSON.parse(message))
            send(channel, ROUTING_KEY, Buffer.from(JSON.stringify(payload)));
        }
    }
}