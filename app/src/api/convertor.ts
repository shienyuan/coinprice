import { httpsCallable } from 'firebase/functions'
import { functions } from '@/plugins/firebase'
import { Fiat, Crypto, ConvertRequest, ConvertResponse } from 'shared/types'

export interface Currency {
    id: number
    name: string
    sign: string
    symbol: string
}

export const getCryptos = async (): Promise<Crypto[]> => {
    const req = httpsCallable<void, Crypto[]>(functions, 'getCryptos')
    const resp = await req()
    return resp.data
}
export const getFiats = async (): Promise<Fiat[]> => {
    const req = httpsCallable<void, Fiat[]>(functions, 'getFiats')
    const resp = await req()
    return resp.data
}

export const convert = async (
    req: ConvertRequest
): Promise<ConvertResponse> => {
    const convert = httpsCallable<ConvertRequest, ConvertResponse>(
        functions,
        'convert'
    )
    const resp = await convert(req)
    return resp.data
}
