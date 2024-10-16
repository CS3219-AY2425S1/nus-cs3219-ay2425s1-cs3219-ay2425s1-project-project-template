import { Router } from 'express';

const router = Router();

router.post('/match-me', async (req, res) => {
    // TODO: Set matchStatus of this specific user
    // TODO: Wait for the user to be matched
    // TODO: Return match found information

    console.log('Authorization Header:', req.headers.authorization);
    console.log('Request Body:', req.body);

    // Temporary code to simulate long-polling API return
    const delay = 5000;
    setTimeout(() => {
        res.json({
            message: "Pseudo match found!"
        });
    }, delay);
});

router.get('/match-status', async (req, res) => {
    // TODO: Actually pull the correct match status instead of hardcoded
    res.json({
        matchStatus: "isNotMatching" // [isNotMatching, isMatching, isMatched]
    })
})

export default router;