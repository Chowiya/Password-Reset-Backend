import express from 'express';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserRouter } from './routes/user.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
import path from 'path';
console.log(path.resolve('models/user.js'));


const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use('/auth',UserRouter)

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(4001, () => {
        console.log(`Server is running on port 4001`);
    })
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

