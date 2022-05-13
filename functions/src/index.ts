import { fn, HttpError } from './utils/firebase'
import { ConvertRequest, ConvertResponse, Crypto } from 'shared/types'
import { AppCheckData } from 'firebase-functions/lib/common/providers/https'
import convertFunc from './convert'
import {
    getCryptosFunc,
    syncCryptosFunc,
    syncCryptoMetadataFunc,
    syncCryptoAlgoliaFunc,
} from './cryptos'

export const getCryptos = fn.onCall(async (_, { app }): Promise<Crypto[]> => {
    authCheck(app)
    return await getCryptosFunc()
})

export const convert = fn.onCall(
    async (req: ConvertRequest, { app }): Promise<ConvertResponse> => {
        authCheck(app)
        return await convertFunc(req)
    }
)

export const syncCryptos = fn.onCall(async (_, { app }): Promise<string> => {
    authCheck(app)
    return await syncCryptosFunc()
})

export const syncCryptoMetadata = fn.onCall(
    async (_, { app }): Promise<string> => {
        authCheck(app)
        return await syncCryptoMetadataFunc()
    }
)

export const syncCryptoAlgolia = fn.onCall(
    async (_, { app }): Promise<string> => {
        authCheck(app)
        return await syncCryptoAlgoliaFunc()
    }
)

const authCheck = (app: AppCheckData | undefined) => {
    if (!app) {
        throw new HttpError(
            'failed-precondition',
            'The function must be called from an App Check verified app.'
        )
    }
}
