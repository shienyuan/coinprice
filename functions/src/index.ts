import { fn, HttpError } from './utils/firebase'
import { ConvertRequest, ConvertResponse, Crypto, Pair } from 'shared/types'
import { AppCheckData } from 'firebase-functions/lib/common/providers/https'
import { addConvertPair, convertFunc } from './convert'
import {
    getCryptosFunc,
    syncCryptoAlgoliaFunc,
    syncCryptoMetadataFunc,
    syncCryptosFunc,
} from './cryptos'
import { getPopularPairsFunc } from './recommand'

export const getCryptos = fn.onCall(async (_, { app }): Promise<Crypto[]> => {
    authCheck(app)
    return await getCryptosFunc()
})

export const convert = fn.onCall(
    async (req: ConvertRequest, { app }): Promise<ConvertResponse> => {
        authCheck(app)
        addConvertPair(req.from.currency, req.to.currency)
        return await convertFunc(req)
    }
)

export const getPairs = fn.onCall(async (_, { app }): Promise<Pair[]> => {
    authCheck(app)
    const docs = await getPopularPairsFunc()
    return docs.map((doc) => doc.data())
})

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
