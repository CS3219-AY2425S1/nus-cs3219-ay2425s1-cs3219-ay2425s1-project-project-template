import { Router } from 'express';
import { registerForMatching, getMatchingTime, getMatchingUsersCount } from '../controller/matching-controller';

const router = Router();

router.get('/', (req, res) => {res.send('Hello from matching service!')}); // Test route

router.post('/match/register', registerForMatching); // Register for matching
router.get('/match/count', getMatchingUsersCount); // Retrieve the count of users matching

export const matchingRoutes = router;
