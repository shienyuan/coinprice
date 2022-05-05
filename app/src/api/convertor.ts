import { useAxios } from '@vueuse/integrations/useAxios'
import { httpsCallable } from 'firebase/functions'
import { IConvertorCurrency } from 'shared/convertor.model'
import { functions } from '@/plugins/firebase'

import axios from '.'

export const convertor = async (req: any): Promise<number> => {
    const { data } = await useAxios(
        '/convert',
        {
            method: 'POST',
            data: req,
        },
        axios
    )

    return data.value.data[req.from.id].quote[req.to.id].price as number
}

export interface Currency {
    id: number
    name: string
    sign: string
    symbol: string
}

export const getCryptos = async (): Promise<IConvertorCurrency[]> => {
    const req = httpsCallable(functions, 'getCryptos')
    const resp = await req()
    return resp.data as IConvertorCurrency[]
}
export const getFiats = async (): Promise<IConvertorCurrency[]> => {
    const req = httpsCallable<void, IConvertorCurrency[]>(functions, 'getFiats')
    const resp = await req()
    return resp.data
}

export const convertCurrency = async (req: any): Promise<any> => {
    const convert = httpsCallable<unknown, { data: any }>(
        functions,
        'convertCurrency'
    )
    const resp = await convert(req)

    // TODO: this should be handled in cloud functions
    if (process.env.NODE_ENV === 'development') {
        return {
            price: resp.data.data[req.from.currency.id].quote[
                req.to.currency.id
            ].price,
            updatedAt:
                resp.data.data[req.from.currency.id].quote[req.to.currency.id]
                    .last_updated,
        }
    } else {
        return {
            price: resp.data.data.quote[req.to.currency.id].price,
            updatedAt: resp.data.data.quote[req.to.currency.id].last_updated,
        }
    }
}
