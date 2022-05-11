import { Crypto } from 'shared/types'

export interface Status {
    timestamp: Date
    errorCode: number
    errorMessage: null
    elapsed: number
    creditCount: number
    notice: null
}

export interface FiatResponse {
    status: Status
    data: Fiat[]
}

export interface CryptoResponse {
    status: Status
    data: Crypto[]
}

export interface Fiat {
    id: number
    name: string
    sign: string
    symbol: string
}

export interface oldCrypto {
    id: number
    rank: number
    name: string
    symbol: string
    slug: string
    isActive: number
    firstHistoricalData: Date
    lastHistoricalData: Date
    platform: {
        id: number
        name: string
        symbol: string
        slug: string
        tokenAddress: string
    } | null
}
