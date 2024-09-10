import { Router } from 'express';
import { registerForMatching, getMatchingTime, getMatchingUsersCount } from '../controller/matching-controller';
import { validateJWT } from '../middleware/jwt-validation';

const router = Router();

router.get('/', (req, res) => {res.send('Hello from matching service!')}); // Test route


router.post('/match/register', validateJWT, registerForMatching); // Register for matching
router.get('/match/count', getMatchingUsersCount); // Retrieve the count of users matching

export const matchingRoutes = router;
