import fs from 'fs';
import path from 'path';

// Define the file path where symbol data is stored
const symbolFilePath = path.join(__dirname, '..', 'Json', 'symbol.json');

// Function to read symbol data from the JSON file
export function readSymbolData(): any[] {
    try {
        const symbolData = fs.readFileSync(symbolFilePath, 'utf-8');
        return JSON.parse(symbolData);
    } catch (error) {
        console.error('Error reading symbol data:', error);
        return []; // Return an empty array if file not found or empty
    }
}

// Function to write symbol data to the JSON file
export function writeSymbolData(symbolData: any[]): void {
    try {
        fs.writeFileSync(symbolFilePath, JSON.stringify(symbolData, null, 2));
    } catch (error) {
        console.error('Error writing symbol data:', error);
    }
}
