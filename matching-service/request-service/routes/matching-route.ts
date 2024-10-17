import { Router } from 'express';

const router = Router();

router.post('/find-match', async (req, res) => {
    // console.log('Authorization Header:', req.headers.authorization);
    // console.log('Request Body:', req.body);

    // TODO: Produce a `match-event`

    // TODO: Consume a `match-found-event` ==> return match-found information

    // Temporary code to simulate long-polling API return
    const delay = 5000;
    setTimeout(() => {
        res.json({
            message: "Pseudo match found!"
        });
    }, delay);
});

router.post('/cancel-matching', async (req, res) => {
    // TODO: Produce a `cancel-match-event`
})

router.get('/match-status', async (req, res) => {
    // TODO: Actually pull the correct match status instead of hardcoded
    res.json({
        matchStatus: "isNotMatching" // [isNotMatching, isMatching, isMatched]
    })
})

export default router;