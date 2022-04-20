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

export interface Crypto {
    id: number
    name: string
    sign: string
    symbol: string
}

export const listCrypto = async (): Promise<Crypto[] | undefined> => {
    const { data } = await useAxios(
        '/list/crypto',
        {
            method: 'GET',
        },
        axios
    )

    return data.value.data
}
