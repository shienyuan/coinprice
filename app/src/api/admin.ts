import { httpsCallable } from 'firebase/functions'
import { functions } from '@/plugins/firebase'

export const syncCryptos = async (): Promise<string> => {
    const req = httpsCallable<void, string>(functions, 'syncCryptos')
    const resp = await req()
    return resp.data
}

export const syncCryptoMetadata = async (): Promise<string> => {
    const req = httpsCallable<void, string>(functions, 'syncCryptoMetadata')
    const resp = await req()
    return resp.data
}

export const syncCryptoAlgolia = async (): Promise<string> => {
    const req = httpsCallable<void, string>(functions, 'syncCryptoAlgolia')
    const resp = await req()
    return resp.data
}
