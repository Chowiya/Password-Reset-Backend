import express from 'express';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserRouter } from './routes/user.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());

import cors from 'cors';

const allowedOrigins = ['https://jimjam.netlify.app'];

app.use(cors({
  origin: allowedOrigins[0], // Use the specific frontend domain
  credentials: true,         // Allow cookies and credentials
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

