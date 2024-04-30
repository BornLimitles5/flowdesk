import express, { Request, Response } from 'express';
import { calculateCumulativeDelta } from './controllers/deltaController';
import { testDelta } from './controllers/Delta';
import { resetCumulativeDelta } from './controllers/deltaReset';

const app = express();

app.use(express.json());

// API route to calculate cumulative delta
app.get('/cumulative-delta/:symbol/:side/:amount', calculateCumulativeDelta);

// Test if symbol exist 
app.get('/cumulative-delta/:symbol', testDelta);

//Reset Symbol Delta in Json
app.post('/cumulative-delta/:symbol', resetCumulativeDelta);

//Reset All?

//BTC-USDT
//DOGE-BTC
//ETH-BTC


export default app;

