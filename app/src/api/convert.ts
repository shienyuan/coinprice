import { inject } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { Functions, httpsCallable } from 'firebase/functions'
import { IConvertorCurrency } from 'shared/convertor.model'
import { functions } from '@/plugins/firebase'

import axios from '.'

export const convert = async (req: any): Promise<number> => {
    const { data } = await useAxios(
        '/convert',
        {
            method: 'POST',
            data: req,
        },
        axios
    )

    console.log(data.value.data)
    return data.value.data[req.from.id].quote[req.to.id].price as number
}

export interface Currency {
    id: number
    name: string
    sign: string
    symbol: string
}

export const listCryptos = async (): Promise<IConvertorCurrency[]> => {
    const list = httpsCallable<unknown, { data: IConvertorCurrency[] }>(
        functions,
        'listCurrencies'
    )

    const resp = await list({ type: 'crypto' })
    return resp.data.data
}

export const listFiats = async (): Promise<IConvertorCurrency[]> => {
    const list = httpsCallable<unknown, { data: IConvertorCurrency[] }>(
        functions,
        'listCurrencies'
    )

    const resp = await list({ type: 'fiat' })
    return resp.data.data
}

export const convertCurrency = async (req: any): Promise<any> => {
    const convert = httpsCallable<unknown, { data: any }>(
        functions,
        'convertCurrency'
    )

    const resp = await convert(req)
    return resp.data.data[req.from.currency.id].quote[req.to.currency.id].price
}
