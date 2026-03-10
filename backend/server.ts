import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/infrastructure/config/db';

import portfoliorouter from './src/presentation/router/PortfolioRouter';
import notificationRouter from './src/presentation/router/NotificationRouter';
import { SocketService } from './src/infrastructure/service/SocketService';


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

app.use('/api/dashboard',portfolio)
app.use('/api/notifications', notificationRouter);

const server = http.createServer(app);
const socketService = SocketService.getInstance();
socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
