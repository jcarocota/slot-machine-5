export interface SymbolSlot {
  id: number;
  description: string;
}

export interface SymbolsResponse {
  idRequest: number;
  symbols: SymbolSlot[];
  wildcardSymbolId: number;
  wildcardBigWinSymbolId: number;
}

export type Strip = SymbolSlot[];

export interface StripsResponse {
  idRequest: number;
  strips: Strip[];
}

export interface InitPositionsResponse {
  idRequest: number;
  symbolsArray: number[][];
}

export interface MoneyBalanceResponse {
  idRequest: number;
  moneyBalance: number;
}

export interface Payline {
  id: number;
  payline: boolean[][];
  description: string;
}

export interface PaylineInfo {
  payline: Payline;
  numberOfCoincidences: number;
  numberOfBigWins: number;
  amountWinByLine: number;
  stake: number;
}

export interface SpinResponse {
  idRequest: number;
  symbolsArray: number[][];
  gottenPaylinesInfo: PaylineInfo[];
  moneyBalance: number;
  amountTotalWin: number;
}
