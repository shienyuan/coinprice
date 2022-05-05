import { fn, db } from './firebase'
// import dayjs from 'dayjs'

import { cmcRequest } from './cmcapi'
import { Crypto, CryptoResponse, Fiat, FiatResponse } from './types/cmcapi'
import * as dayjs from 'dayjs'

const statsCol = db.collection('stats')
const fiatsCol = db.collection('fiats')
const cryptosCol = db.collection('cryptos')
const fetchDataInterval = 30 // day

export const getFiats = fn.onCall(async (): Promise<Fiat[]> => {
    const now = dayjs()
    const stats = await statsCol.doc('fiats').get()
    const expired = dayjs(stats.data()?.last_updated_at.toDate()).isAfter(
        now.add(fetchDataInterval, 'd')
    )

    if (!stats.exists || expired) {
        return await updateFiats(now.toDate())
    }

    const snaps = await fiatsCol.get()
    return snaps.docs.map((doc) => doc.data() as Fiat)
})

export const getCryptos = fn.onCall(async (): Promise<Crypto[]> => {
    const now = dayjs()
    const stats = await statsCol.doc('cryptos').get()
    const expired = dayjs(stats.data()?.last_updated_at.toDate()).isAfter(
        now.add(fetchDataInterval, 'd')
    )

    if (!stats.exists || expired) {
        return await updateCryptos(now.toDate())
    }

    const snaps = await cryptosCol.get()
    return snaps.docs.map((doc) => doc.data() as Crypto)
})

export const convertCurrency = fn.onCall(async (req: any) => {
    const converted = await cmcRequest.get('/v2/tools/price-conversion', {
        params: {
            amount: req.from.amount,
            id: req.from.currency.id,
            convert_id: req.to.currency.id,
        },
    })

    return converted.data
})

const updateFiats = async (now: Date): Promise<Fiat[]> => {
    const { data } = await cmcRequest.get<FiatResponse>('/v1/fiat/map')
    const batch = db.batch()

    data.data.forEach((fiat) =>
        batch.set(fiatsCol.doc(fiat.id.toString()), fiat)
    )

    await batch.commit()
    await statsCol
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
    const batch = db.batch()

    data.data.forEach((fiat) =>
        batch.set(cryptosCol.doc(fiat.id.toString()), fiat)
    )

    await batch.commit()
    await statsCol
        .doc('cryptos')
        .set({ last_updated_at: now, total: data.data.length })

    return data.data
}
