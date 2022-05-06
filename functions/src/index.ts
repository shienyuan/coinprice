import * as dayjs from 'dayjs'

import { fn, db, fs } from './firebase'
import { cmcRequest } from './cmcapi'
import { Crypto, CryptoResponse, Fiat, FiatResponse } from './types/cmcapi'
import { ConvertRequest, ConvertResponse } from 'shared/types'

const fetchDataInterval = 30 // day

export const getFiats = fn.onCall(async (): Promise<Fiat[]> => {
    const now = dayjs()
    const stats = await db.statsCol.doc('fiats').get()
    const expired = dayjs(stats.data()?.last_updated_at.toDate()).isAfter(
        now.add(fetchDataInterval, 'd')
    )

    if (!stats.exists || expired) {
        return await updateFiats(now.toDate())
    }

    const snaps = await db.fiatsCol.get()
    return snaps.docs.map((doc) => doc.data() as Fiat)
})

export const getCryptos = fn.onCall(async (): Promise<Crypto[]> => {
    const now = dayjs()
    const stats = await db.statsCol.doc('cryptos').get()
    const expired = dayjs(stats.data()?.last_updated_at.toDate()).isAfter(
        now.add(fetchDataInterval, 'd')
    )

    if (!stats.exists || expired) {
        return await updateCryptos(now.toDate())
    }

    const snaps = await db.cryptosCol.get()
    return snaps.docs.map((doc) => doc.data() as Crypto)
})

export const convert = fn.onCall(
    async (req: ConvertRequest): Promise<ConvertResponse> => {
        const converted = await cmcRequest.get('/v2/tools/price-conversion', {
            params: {
                amount: req.from.amount,
                id: req.from.currency.id,
                convert_id: req.to.currency.id,
            },
        })

        let data = converted.data.data.quote[req.to.currency.id]

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

const updateCryptos = async (now: Date): Promise<Crypto[]> => {
    const { data } = await cmcRequest.get<CryptoResponse>(
        '/v1/cryptocurrency/map',
        {
            params: {
                limit: 500,
                sort: 'cmc_rank',
            },
        }
    )
    const batch = fs.batch()

    data.data.forEach((fiat) => {
        batch.set(db.cryptosCol.doc(fiat.id.toString()), fiat)
    })

    await batch.commit()
    await db.statsCol
        .doc('cryptos')
        .set({ last_updated_at: now, total: data.data.length })

    return data.data
}
