import { send } from "../rabbit/rabbit.js"

export const requestMatch = (channel) => {
    return (req, res, next) => {
        try {
            const { complexity, category } = req.body
            const { id } = req.user
            sendMatchRequest(channel, id, complexity, category)
            res.status(200).send({ message: "match request sent" })
        } catch (e) {
            res.status(500).send({
                message: 'Failed to create new order.' + e
            });
        }
    }
}

const sendMatchRequest = (channel, id, complexity, category) => {
    console.log("id: ", id)
    console.log("complexity: ", complexity)
    console.log("category: ", category)
    send(channel, { id: id, complexity: complexity, category: category })
}

