import { matchRequestController } from '@/controllers/match-request';
import { cancelMatchController } from '@/controllers/match-request';
import { Router } from 'express';

const route = Router();

route.post('/request', matchRequestController);
route.post('/cancel', cancelMatchController);

export default route;
