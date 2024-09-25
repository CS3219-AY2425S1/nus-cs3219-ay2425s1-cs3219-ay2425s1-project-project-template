const express = require('express');
const router = express.Router();

// hash table of waiting users
const criteriaToUsers = new Map();
const usersToCriteria = new Map();

router.get('/', (req, res) => {
    // Render the queue view with the current queue data
    // res.render('queue', { queue });
});

router.post('/', (req, res) => {
    key = {
        questionId: req.body.questionId,
        diffLevel: req.body.diffLevel,
        topic: req.body.topic
    };

    if (criteriaToUsers.has(key)) {
        // get details of other user
        otherUserId = criteriaToUsers.get(key);
        
        // delete other user from hash tables
        criteriaToUsers.delete(key);
        usersToCriteria.delete(req.body.userId);
        
        // if question id not null, go to waiting room
        // if null, pick random question based on diffLevel and topic
    } else {
        criteriaToUsers.set(key, req.body.userId);
        usersToCriteria.set(req.body.userId, key);
    }
});

router.delete('/', (req, res) => {
    key = {
        questionId: req.body.questionId,
        diffLevel: req.body.diffLevel,
        topic: req.body.topic
    };
    criteriaToUsers.delete(key);
    usersToCriteria.set(req.body.userId);
});

router.put('/', (req, res) => {
    oldCriteria = usersToCriteria.get(req.body.userId);
    criteriaToUsers.delete(oldCriteria);
    usersToCriteria.delete(req.body.userId);

    newCriteria = {
        questionId: req.body.questionId,
        diffLevel: req.body.diffLevel,
        topic: req.body.topic
    };

    if (criteriaToUsers.has(newCriteria)) {
        // get details of other user
        otherUserId = criteriaToUsers.get(newCriteria);
        
        // delete other user from hash tables
        criteriaToUsers.delete(newCriteria);
        usersToCriteria.delete(req.body.userId);
        
        // if question id not null, go to waiting room
        // if null, pick random question based on diffLevel and topic
    } else {
        criteriaToUsers.set(newCriteria, req.body.userId);
        usersToCriteria.set(req.body.userId, newCriteria);
    }
});

module.exports = router;