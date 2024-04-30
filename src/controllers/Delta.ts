import { Request, Response } from 'express';
import fetchTradeHistory from '../api/kucoin';
import {Trade} from '../interfaces/Trade'

export async function testDelta(req: Request, res: Response) {
    const { symbol } = req.params;

    try {
        const tradeHistory: { data: Trade[] } = await fetchTradeHistory(symbol);

        if (tradeHistory.data && tradeHistory.data.length > 0) {

            res.json(tradeHistory.data);

        } else {
            res.status(404).send('No trade history found for the symbol');
        }
    } catch (error) {
        console.error('Error fetching trade history:', error);
        res.status(500).send('Error fetching trade history');
    }
};