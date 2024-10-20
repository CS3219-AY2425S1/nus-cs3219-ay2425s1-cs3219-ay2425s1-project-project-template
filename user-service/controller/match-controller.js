import { send } from "../rabbit/rabbit.js"

export const requestMatch = (channel) => {
    return (req, res, next) => {
        try {
            // const { complexity, category, } = req.body
            // const { id } = req.user
            // const { socketId } = 
            const payload = { id: req.user, ...req.body }
            sendMatchRequest(channel, payload)
            res.status(200).send({ message: "match request sent" })
        } catch (e) {
            res.status(500).send({
                message: 'Failed to create new order.' + e
            });
        }
    }
}

const sendMatchRequest = (channel, payload) => {
    // console.log("id: ", payload.id)
    // console.log("complexity: ", payload.complexity)
    // console.log("category: ", payload.category)
    // console.log("socketId: ", payload.socketId)
    send(channel, payload)
}

