export interface Trade {
    sequence: string;
    price: string;
    size: string;
    side: string;
    time: number;
}

export interface SymbolData {
    symbol: string, 
    lastCumulativeDelta: number, 
    state: number, 
    sequenceNumber: number 
}