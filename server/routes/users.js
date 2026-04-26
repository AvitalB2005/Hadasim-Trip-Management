import express from 'express';
import { getUserById,getUserByUserNamePassword,getAllUser,registerUser,updateUser } from '../controllers/usersCon.js';
import {verifyToken}  from '../middlewares/verifyToken.js';
const router = express.Router();

 
router.get('/id', verifyToken(), getUserById);
router.get('/',verifyToken(['manager']), getAllUser);
router.post('/login', getUserByUserNamePassword);
router.post('/register', registerUser);

export default router;

