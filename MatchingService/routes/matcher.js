const events = require('events');
const eventEmitter = new events.EventEmitter();
const express = require('express');
const router = express.Router();
const waitingTime = 60000;

// hash table of waiting users
const criteriaToUsers = new Map();

router.get('/matcher', (req, res) => {
    // Returns queue view with the current queue data
    res.json(criteriaToUsers);
});

router.post('/matcher', (req, res) => {
    mainUserId = req.query.userId
    key = {
        questionId: req.query.questionId,
        topic: req.query.topic,
        diffLevel: req.query.diffLevel
    };

    if (criteriaToUsers.has(key)) {
        // get details of other user
        otherUserId = criteriaToUsers.get(key);
        
        // delete other user from hash table
        criteriaToUsers.delete(key);

        // send event signifying match found
        eventEmitter.emit('matchFound', { userId1: mainUserId, userId2: otherUserId });
        
        res.json({ message: "Match found!", otherUserId });
        
        // FOR FUTURE CONSIDERATION (collab service logic)
        // if question id not null, go to waiting room
        // if null, pick random question based on diffLevel and topic
    } else {
        criteriaToUsers.set(key, mainUserId);

        const timeoutId = setTimeout(() => {
            // Check if user is still in the map
            if (criteriaToUsers.has(key) && criteriaToUsers.get(key) == mainUserId) {
                // User did not find match
                criteriaToUsers.delete(key);
                
                // Send error message indicating no match found
                res.status(404).json({ message: "No match found within time limit.", key });
            }
        }, waitingTime);
        
        // Listen for the 'matchFound' event and clear the timeout if it occurs
        eventEmitter.on('matchFound', (data) => {
            // Check if the event relates to the current user
            userId1 = data.userId1;
            userId2 = data.userId2;
            if (userId1 == mainUserId) {
                clearTimeout(timeoutId);
                res.json({ message: "Match found!", userId2 });
            } else if (userId2 == mainUserId) {
                clearTimeout(timeoutId);
                res.json({ message: "Match found!", userId1 });
            }
        });

        // FOR FUTURE CONSIDERATION (collab service logic)
        // if question id not null, go to waiting room
        // if null, pick random question based on diffLevel and topic
    }
});

router.delete('/matcher', (req, res) => {
    key = {
        questionId: req.query.questionId,
        topic: req.query.topic,
        diffLevel: req.query.diffLevel
    };
    
    if (criteriaToUsers.has(key)) {
        criteriaToUsers.delete(key);
        res.json({ message: 'Key deleted successfully', key });
    } else {
        res.json({ message: 'Key not found', key });
    }
});

module.exports = router;