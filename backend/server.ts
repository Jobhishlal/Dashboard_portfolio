import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/infrastructure/config/db';

import portfoliorouter from './src/presentation/router/PortfolioRouter';


// Configuration

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const portfolio = portfoliorouter


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/dashboard',portfolio)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
