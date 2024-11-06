const express = require('express');
const CollabHistory = require('./models/CollabHistory');
const router = new express.Router();

// Save collab history
router.post('/saveAttempt', async (req, res) => {
    try {
        console.log(req.body);
        const { username, attempts } = req.body;
        const existingUser = await CollabHistory.findOne({ username });
        if (!existingUser) {
            // We add new user here
            const newUser = new CollabHistory({
                username, attempts
            });
            await newUser.save();
            return res.status(201).send({ message: "Created new user" });
        } else {
            existingUser.attempts.push(...attempts);
            await existingUser.save();
            return res.status(200).send({ message: "Updated user"});
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

module.exports = router;
