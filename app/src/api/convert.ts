import { useAxios } from '@vueuse/integrations/useAxios'
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

export const listCrypto = async (): Promise<Currency[]> => {
    const { data } = await useAxios(
        '/list/crypto',
        {
            method: 'GET',
        },
        axios
    )

    return data.value.data
}

export const listFiat = async (): Promise<Currency[]> => {
    const { data } = await useAxios(
        '/list/fiat',
        {
            method: 'GET',
        },
        axios
    )

    return data.value.data
}
