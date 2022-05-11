export enum CurrencyType {
  fiat = "fiat",
  crypto = "crypto",
}

export enum ConvertorMode {
  cryptoToFiat,
  cryptoToCrypto,
}

export interface ConvertRequest {
  from: ConvertInput;
  to: ConvertInput;
}

export interface ConvertInput {
  type: CurrencyType;
  amount?: number;
  currency?: Currency;
}

export interface ConvertResponse {
  amount: number;
  lastUpdated: Date;
}

export interface Currency {
  id: number;
  name: string;
  symbol: string;
  icon: string;
}

export interface Fiat extends Currency {
  sign: string;
}

export interface Crypto extends Currency {
  rank: number;
  slug: string;
  isActive: number;
  firstHistoricalData: Date;
  lastHistoricalData: Date;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    tokenAddress: string;
  } | null;
}
