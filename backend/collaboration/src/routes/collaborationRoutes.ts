import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from collaboration service!');
});

export default router;