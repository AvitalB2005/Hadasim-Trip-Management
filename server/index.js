import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json()); //עבור קריאת הגוף של פוסט


app.use('/api/users', usersRoutes);

// הפעלת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});