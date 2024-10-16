const { send } = require('../rabbit/sender');
const { receive } = require('../rabbit/receiver');

exports.requestMatch = (req, res, next) => {
    try {
        const { complexity, category } = req.body;
        send(complexity, category);
        res.status(200).send({ message: "match request sent" })
    } catch (e) {
        res.status(500).send({
            message: 'Failed to create new order.'+ e
        });
    }
}

exports.consumeMatch = (req, res, next) => {
    try {
        receive();
        res.status(200).send({ message: "received" })
    } catch (e) {
        res.status(500).send({
            message: 'Failed to create new order.'+ e
        });
    }
}