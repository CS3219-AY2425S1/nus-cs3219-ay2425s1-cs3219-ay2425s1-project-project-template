const { send, sendMatchResult, sendCancelResult } = require('../rabbit/rabbit.js')

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
            // sendMatchResult(channel, Buffer.from(JSON.stringify(payload)));
        }
    }
}


exports.processCancelRequest = (channel) => {
    return (data) => {
        console.log('Matching service received: ', data)
        if (data) {
            console.log("cancel working??", data)
            const message = data.content.toString()
            console.log('stringify buffer: ', message)

            const parsedData = JSON.parse(message)

            const user1Id = parsedData["id"]
            const user1SocketId = parsedData["socketId"]
            
            const payload = { success: "successful", user1Id, user1SocketId }
            console.log("json parsed in cancelling: ", JSON.parse(message))
            sendCancelResult(channel, Buffer.from(JSON.stringify(payload)));
        }
    }
}