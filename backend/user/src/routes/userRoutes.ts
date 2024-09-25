import express from 'express';
import createUpdateUserController from '../controllers/createUpdateUserController';
import getUserController from '../controllers/getUserController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from user service!');
});

// GET USER
router.get("/get", getUserController);

// CREATE/UPDATE USER
router.post("/update", createUpdateUserController);

export default router;