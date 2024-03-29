import * as dayjs from 'dayjs'

import { fn, db, fs, HttpError } from './firebase'
import { cmcRequest } from './cmcapi'
import { CryptoResponse, Fiat, FiatResponse } from './types/cmcapi'
import { ConvertRequest, ConvertResponse } from 'shared/types'
import algolia from 'algoliasearch'

const algoliaClient = algolia(
    process.env.AG_APP_ID as string,
    process.env.AG_API_KEY as string
)
const algoliaIndex = algoliaClient.initIndex('cryptos')

const fetchDataInterval = 30 // day

export const getFiats = fn.onCall(async (_, context): Promise<Fiat[]> => {
    if (context.app == undefined) {
        throw new HttpError(
            'failed-precondition',
            'The function must be called from an App Check verified app.'
        )
    }

    const now = dayjs()
    const stats = await db.statsCol.doc('fiats').get()
    const expired = dayjs(stats.data()?.last_updated_at.toDate()).isAfter(
        now.add(fetchDataInterval, 'd')
    )

    if (!stats.exists || expired) {
        return await updateFiats(now.toDate())
    }

    const snaps = await db.fiatsCol.limit(10).orderBy('rank').get()
    return snaps.docs.map((doc) => doc.data() as Fiat)
})

export const getCryptos = fn.onCall(async (_, context): Promise<Crypto[]> => {
    if (context.app == undefined) {
        throw new HttpError(
            'failed-precondition',
            'The function must be called from an App Check verified app.'
        )
    }

    const snaps = await db.cryptosCol.limit(10).orderBy('rank').get()
    return snaps.docs.map((doc) => doc.data() as Crypto)
})

export const convert = fn.onCall(
    async (req: ConvertRequest, context): Promise<ConvertResponse> => {
        if (context.app == undefined) {
            throw new HttpError(
                'failed-precondition',
                'The function must be called from an App Check verified app.'
            )
        }

        if (!req.from.currency || !req.to.currency)
            return {
                amount: 0,
                lastUpdated: dayjs().toDate(),
            }

        const converted = await cmcRequest.get('/v2/tools/price-conversion', {
            params: {
                amount: req.from.amount,
                id: req.from.currency.id,
                convert_id: req.to.currency.id,
            },
        })

        const data = converted.data.data.quote[req.to.currency.id]

        return {
            amount: data.price,
            lastUpdated: data.last_updated,
        }
    }
)

const updateFiats = async (now: Date): Promise<Fiat[]> => {
    const { data } = await cmcRequest.get<FiatResponse>('/v1/fiat/map')
    const batch = fs.batch()

    data.data.forEach((fiat) =>
        batch.set(db.fiatsCol.doc(fiat.id.toString()), fiat)
    )

    await batch.commit()
    await db.statsCol
        .doc('fiats')
        .set({ last_updated_at: now, total: data.data.length })

    return data.data
}

export const syncCryptos = fn.onCall(async (): Promise<string> => {
    let page = 1

    const fetch = async () => {
        const { data } = await cmcRequest.get<CryptoResponse>(
            '/v1/cryptocurrency/map',
            {
                params: {
                    start: page,
                    limit: 500,
                    sort: 'cmc_rank',
                },
            }
        )

        const batch = fs.batch()
        for (const crypto of data.data) {
            batch.set(db.cryptosCol.doc(crypto.id.toString()), crypto)
        }
        await batch.commit()

        // only 500 for alpha stage
        if (data.data.length >= 500 && page < 0) {
            page += 500
            await fetch()
        }
    }

    await fetch()

    return 'Success'
})

export const syncCryptoMetadata = fn.onCall(async (): Promise<string> => {
    const cryptos = await db.cryptosCol.get()
    const ids = cryptos.docs.map((val) => val.data().id)

    console.log('syncing ', ids.length)
    for (let i = 0; i < ids.length; i += 100) {
        const { data } = await cmcRequest.get('/v2/cryptocurrency/info', {
            params: {
                id: ids.slice(i, i + 100).toString(),
                aux: 'logo',
            },
        })

        const batch = fs.batch()
        for (const id of ids.slice(i, i + 100)) {
            batch.update(db.cryptosCol.doc(id.toString()), {
                icon: data.data[id]?.logo ? data.data[id].logo : '',
            })
        }
        await batch.commit()
    }

    return 'Success'
})

export const syncCryptoAlgolia = fn.onCall(async (): Promise<string> => {
    const cryptos = await db.cryptosCol.get()
    algoliaIndex.saveObjects(
        cryptos.docs.map((val) => {
            return {
                objectID: val.id,
                ...val.data(),
            }
        }),
        { autoGenerateObjectIDIfNotExist: true }
    )
    return 'Success'
})
