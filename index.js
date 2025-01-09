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

const allowedOrigins = ['https://jimjams.netlify.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies to be sent with requests
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

