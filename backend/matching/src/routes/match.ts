import { requestMatchController } from '@/controllers/request-match';
import { Router } from 'express';

const route = Router();

route.post('/request', requestMatchController);

export default route;
