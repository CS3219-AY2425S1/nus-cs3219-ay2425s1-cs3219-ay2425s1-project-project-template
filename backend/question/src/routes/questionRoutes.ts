import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from question service!');
});

export default router;