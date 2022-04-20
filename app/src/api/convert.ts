import { useAxios } from '@vueuse/integrations/useAxios'
import axios from '.'

export const convert = async (): Promise<boolean> => {
    const { data } = await useAxios(
        '/convert',
        {
            method: 'GET',
        },
        axios
    )

    console.log(data)

    return false
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
