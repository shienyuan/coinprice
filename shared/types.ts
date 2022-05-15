export enum CurrencyType {
  fiat = "fiat",
  crypto = "crypto",
}

export enum ConvertType {
  cryptoToFiat,
  cryptoToCrypto,
}

export interface ConvertRequest {
  from: {
    type: CurrencyType;
    amount: number;
    currency: Currency;
  };
  to: {
    type: CurrencyType;
    currency: Currency;
  };
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

export const isFiat = (obj: Currency): obj is Fiat => {
  return "sign" in obj;
};

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

export interface Pair {
  from: Currency;
  to: Currency;
  hits: number;
}
