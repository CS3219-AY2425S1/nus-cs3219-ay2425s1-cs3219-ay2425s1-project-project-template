const express = require('express');
const CollabHistory = require('./models/CollabHistory');
const router = new express.Router();

// Save collab history
router.post('/saveAttempt', async (req, res) => {
    try {
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

router.get('/attempts/:username/:attemptid', async (req, res) => {
    try {
        const username = req.params.username;
        const attemptid = req.params.attemptid;
        await CollabHistory.findOne({
            username: username,
            "attempts._id": attemptid
        }, { "attempts.$": 1}).then((attempt) => {
            if (attempt) {
                console.log(attempt);
                res.json({ attempt: attempt });
            } else {
                console.log("Attempt not found!");
                res.status(404).send("Attempt not found!");
            }
        })
    } catch (error) {
        console.log(`Error getting attempt! Error: ${error}`);
    }
})

router.get('/attempts/:username', async (req, res) => {
    try {
        const username = req.params.username;
        await CollabHistory.findOne({ username }).then((user) => {
            if (user) {                
                // Data cleaning & sending it back
                const output = [];
                for (const item of user.attempts) {
                    output.push({attemptId: item._id, 
                        timestamp: (new Date(item.timestamp)).toLocaleString('en-SG', {
                        year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false
                    }), title: item.title
                    , partner: item.partner_username})
                }
                output.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                res.json({ attempts: output} );
            } else {
                console.log("User not found");
                res.json({ attempts: [] });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

module.exports = router;
