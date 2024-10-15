import { Router } from 'express';

const router = Router();

router.post('/match-me', async (req, res) => {
    // TODO: Set matchStatus of this specific user

    // TODO: Wait for the user to be matched

    // TODO: Return match found information

})

router.get('/match-status', async (req, res) => {
    res.json({
        matchStatus: "isNotMatching" // [isNotMatching, isMatching, isMatched]
    })
})

export default router;