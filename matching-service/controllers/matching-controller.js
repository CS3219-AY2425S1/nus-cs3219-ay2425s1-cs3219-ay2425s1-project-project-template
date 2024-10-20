const { send } = require('../rabbit/rabbit.js')
const { v4 } = require('uuid')

const ROUTING_KEY = 'USER-ROUTING-KEY'

const waitingRequests = {}

const COMPLEXITIES_MAPPING = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3
}

exports.processMatchRequest = (channel) => {
    return (data) => {
        console.log('Matching service received: ', data)
        if (data) {
            const {socketId, id, complexity, category} = JSON.parse(data.content)
            const uuid = v4()
            console.log(`Received request: ${JSON.stringify(JSON.parse(data.content))}`)
            const request = {socketId: socketId, id: id, complexity: complexity, category: category}
            // Perfect match
            const perfectMatch = findPerfectMatch(complexity, category)
            if (perfectMatch) {
                console.log(perfectMatch)
                const waitingRequest = waitingRequests[perfectMatch]
                console.log(JSON.stringify(waitingRequest))
                delete waitingRequests[perfectMatch]
                send(channel, ROUTING_KEY, Buffer.from(JSON.stringify(createSuccessPayload(request, waitingRequest))))
            } else {
                // No perfect match
                // Add to wait queue
                waitingRequests[uuid] = request
                console.log(`Request ${id} waiting`)
                // Wait 30s
                setTimeout(async () => {
                    console.log(`Request ${uuid} finished waiting`)
                    if (!waitingRequests[uuid]) {
                        console.log(`Request ${uuid} already matched`)
                        return
                    }
                    delete waitingRequests[uuid]
                    const match = findMatch(complexity, category)
                    console.log(`Request ${uuid} matched with ${match}`)
                    if (match) {
                        const waitingRequest = waitingRequests[match]
                        delete waitingRequests[match]
                        send(channel, ROUTING_KEY, Buffer.from(JSON.stringify(createSuccessPayload(request, waitingRequest))))
                    } else {
                        send(channel, ROUTING_KEY, Buffer.from(`User ${id} did not match`))
                    }
                }, 30 * 1000)
            }
        }
    }
}

function findPerfectMatch(complexity, category) {
    for (const [uuid, waiting] of Object.entries(waitingRequests)) {
        if (waiting.complexity == complexity && waiting.category == category) {
            return uuid
        }
    }
    return null
}

function createSuccessPayload(request1, request2) {
    return {
        user1Id: request1.id,
        user2Id: request2.id,
        user1SocketId: request1.socketId,
        user2SocketId: request2.socketId
    }
}

function findMatch(complexity, category) {
    const possibleMatches = Object.entries(waitingRequests).filter(entry => entry[1].category == category)
    possibleMatches.sort((x, y) => Math.abs(COMPLEXITIES_MAPPING[x[1].complexity] - complexity) - Math.abs(COMPLEXITIES_MAPPING[y[1].complexity] - complexity))
    console.log(JSON.stringify(possibleMatches))
    if (possibleMatches.length > 0)
        return possibleMatches[0][0]
    return null
}
