import { Request, Response } from 'express';
import * as fs from 'fs';
import path from 'path';


const jsonFolderPath = path.join(__dirname, '..', 'json');
const symbolFilePath = path.join(jsonFolderPath, 'symbol.json');

export async function resetCumulativeDelta(req: Request, res: Response) {
    const { symbol } = req.params;

    try {
        // Read the JSON file
        const rawData = fs.readFileSync(symbolFilePath, 'utf-8');
        const symbols = JSON.parse(rawData);

        // Find the symbol in the array
        const index = symbols.findIndex((entry: { symbol: string }) => entry.symbol === symbol);

        if (index !== -1) {
            // Reset the lastCumulativeDelta to 0
            symbols[index].lastCumulativeDelta = 0;
            symbols[index].state = 0;
            symbols[index].sequenceNumber = 0;

            // Write back the updated data to the JSON file
            fs.writeFileSync(symbolFilePath, JSON.stringify(symbols, null, 2));

            res.send(`Last cumulative delta for ${symbol} has been reset to 0.`);
        } else {
            res.status(404).send('Symbol not found in the JSON file.');
        }
    } catch (error) {
        console.error('Error resetting cumulative delta:', error);
        res.status(500).send('Error resetting cumulative delta');
    }
}
