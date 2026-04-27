import express from 'express';
import { getAllClasses } from '../controllers/classesCon.js';

const router = express.Router();

router.get('/', getAllClasses);

export default router;
