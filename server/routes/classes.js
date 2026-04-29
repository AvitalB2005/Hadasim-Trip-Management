import express from 'express';
import { getAllClasses, createClass } from '../controllers/classesCon.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', getAllClasses);
router.post('/', verifyToken(['teacher']), createClass);

export default router;
