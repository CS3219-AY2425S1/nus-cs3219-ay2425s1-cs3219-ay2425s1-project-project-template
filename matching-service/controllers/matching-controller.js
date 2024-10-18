const { send } = require('../rabbit/rabbit.js')

const ROUTING_KEY = 'USER-ROUTING-KEY'

// TODO: Processes match request and finds 
exports.processMatchRequest = (channel) => {
    return (data) => {
        console.log('Matching service received: ', data)
        if (data) {
            send(channel, ROUTING_KEY, Buffer.from("Users matched"))
        }
    }
}