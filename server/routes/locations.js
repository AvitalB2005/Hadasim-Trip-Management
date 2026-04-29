import express from 'express';
import { importLocations, getAllStudentLocations } from '../controllers/locationsCon.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/update', importLocations);
router.get('/all', verifyToken(['teacher']), getAllStudentLocations);

export default router;