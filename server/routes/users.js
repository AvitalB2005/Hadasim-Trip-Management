import express from 'express';
import { getUserById,getAllUser,getStudentsByClass,getUserByUserNamePassword,registerUser } from '../controllers/usersCon.js';
import {verifyToken}  from '../middlewares/verifyToken.js';
const router = express.Router();

router.get('/my-students', verifyToken(['teacher']), getStudentsByClass);
router.get('/user/:id', verifyToken(['teacher']), getUserById);
router.get('/',verifyToken(['teacher']), getAllUser);
router.post('/login', getUserByUserNamePassword);
router.post('/register', registerUser);


export default router;

