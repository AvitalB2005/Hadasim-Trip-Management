import express from 'express';
import { importLocations } from '../controllers/locationsCon.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/import', verifyToken(['teacher']), importLocations);

export default router;
