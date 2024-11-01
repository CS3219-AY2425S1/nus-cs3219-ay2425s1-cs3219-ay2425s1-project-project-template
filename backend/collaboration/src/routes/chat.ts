import express from 'express';

import { queryOpenAI } from '@/controller/openai-controller';

const router = express.Router();

router.get('/chat', queryOpenAI);

export default router;
