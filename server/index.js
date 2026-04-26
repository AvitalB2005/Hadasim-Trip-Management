import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import usersRoutes from './routes/users.js';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);