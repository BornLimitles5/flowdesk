import { Request, Response } from 'express';
import { type Trade, type SymbolData } from '../interfaces/Trade';
import { readSymbolData, writeSymbolData } from '../utils/symbolData';
import fetchTradeHistory from '../api/kucoin';

// Function to retrieve the symbol data index from the array
function findSymbolIndex(symbolData: SymbolData[], symbol: string): number {
    return symbolData.findIndex((data: any) => data.symbol === symbol);
}

// Function to update symbol data with trade information
function updateSymbolData(symbolData: SymbolData[], symbol: string, side: string, amount: string, tradeHistory: Trade[]): void {
    let existingSymbolIndex = findSymbolIndex(symbolData, symbol);

    if (existingSymbolIndex === -1) {
        // Symbol does not exist, initialize with cumulative delta of 0
        symbolData.push({ symbol, lastCumulativeDelta: 0, state: 0, sequenceNumber: 0 });
        // Update existingSymbolIndex to the new symbol index
        existingSymbolIndex = symbolData.length - 1; 
    }

    let cumulativeDelta = symbolData[existingSymbolIndex].lastCumulativeDelta || 0;
    let state = symbolData[existingSymbolIndex].state || 0;
    let sequenceNumber = symbolData[existingSymbolIndex].sequenceNumber || 0;

    let tradeStateChange = 0;
    if (side === 'buy') {
        tradeStateChange += parseInt(amount);
    } else if (side === 'sell') {
        tradeStateChange -= parseInt(amount);
    }

    state += tradeStateChange; // Update the state with the trade state change

    tradeHistory.forEach((trade: Trade) => {
        const tradeAmount = parseFloat(trade.size);
        if (trade.side.toLowerCase() === side.toLowerCase()) {
            if (side === 'buy') {
                cumulativeDelta += parseFloat(amount) * tradeAmount;
            } else if (side === 'sell') {
                cumulativeDelta -= parseFloat(amount) * tradeAmount;
            }
            // Update the sequence number from the trade object
            sequenceNumber = parseInt(trade.sequence);
        }
    });

    // Update the symbol data
    symbolData[existingSymbolIndex].lastCumulativeDelta = cumulativeDelta;
    symbolData[existingSymbolIndex].state = state;
    symbolData[existingSymbolIndex].sequenceNumber = sequenceNumber;
}

// Function to generate HTML table response
function generateHtmlTable(symbol: string, state: number, cumulativeDelta: number, sequenceNumber: number): string {
    return `<table border="1">
                <tr>
                    <th>Symbol</th>
                    <th>Cumulative Delta State</th>
                    <th>Cumulative Delta Size</th>
                    <th>Sequence Number of Size Purchased</th>
                </tr>
                <tr>
                    <td>${symbol}</td>
                    <td>${state}</td>
                    <td>${cumulativeDelta}</td>
                    <td>${sequenceNumber}</td>
                </tr>
            </table>`;
}

export async function calculateCumulativeDelta(req: Request, res: Response) {
    const { symbol, side, amount } = req.params;

    // Validate required parameters
    if (!symbol || typeof symbol !== 'string') {
        return res.status(400).send('Invalid or missing symbol');
    }

    if (!side || (side !== 'buy' && side !== 'sell')) {
        return res.status(400).send('Invalid or missing side. Side must be "buy" or "sell"');
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
        return res.status(400).send('Invalid or missing amount. Amount must be a positive number');
    }

    try {
        // Continue with processing if all required parameters are valid
        let symbolData = readSymbolData();
        const tradeHistoryResponse = await fetchTradeHistory(symbol);
        const tradeHistory: Trade[] = tradeHistoryResponse.data;

        // Update symbol data with trade information
        updateSymbolData(symbolData, symbol, side, amount, tradeHistory);

        // Write the updated symbol data back to the JSON file
        writeSymbolData(symbolData);

        // Respond with the updated cumulative delta, state, and sequence number
        const existingSymbolIndex = findSymbolIndex(symbolData, symbol);
        const { state, lastCumulativeDelta: cumulativeDelta, sequenceNumber } = symbolData[existingSymbolIndex];

        const htmlTable = generateHtmlTable(symbol, state, cumulativeDelta, sequenceNumber);
        res.send(htmlTable);
    } catch (error) {
        console.error('Error calculating cumulative delta:', error);
        res.status(500).send('Error calculating cumulative delta');
    }
}

