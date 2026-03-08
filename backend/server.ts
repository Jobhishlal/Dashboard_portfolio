import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/infrastructure/config/db';



// Configuration

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;





// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
