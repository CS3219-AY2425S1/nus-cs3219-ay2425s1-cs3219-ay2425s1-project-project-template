import { Router } from 'express';

const router = Router();

router.get("/test-a", (req, res) => {
    res.send("Hello World!");
});

router.get("/test-b", (req, res) => {
    res.send("Goodbye World!");
});

/**
 * The frontend should include 3 pieces of information:
 * 1. The user's ID (or some form of identification)
 * 2. The selected question topic
 * 3. The selected question difficulty
 * 
 * The method is asynchronous (non-blocking).
 * It will return a response to the frontend to say that
 * the matching request is being processed.
 */
router.post('/match-user', async (req, res) => {
    console.log("Request received", req.body);
})

export default router;