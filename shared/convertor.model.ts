export interface IConvertorInput {
    currency: IConvertorCurrency
    amount: number
}

export interface IConvertorCurrency {
    id: number
    name: string
    symbol: string
}
