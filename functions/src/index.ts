import { fn, db } from './firebase'
// import dayjs from 'dayjs'

import { cmcRequest } from './cmcapi'
import { collectionExists } from './utils'
import { Fiat, CryptoResponse, Crypto } from './types/cmcapi'
import * as dayjs from 'dayjs'

const statsCol = db.collection('stats')
const fiatsCol = db.collection('fiats')
const cryptosCol = db.collection('cryptos')
// const cryptoUpdateInterval = 1 // day
const fiatUpdateInterval = 30 // day

export const testPopulateFiats = fn.onRequest(async (req, resp) => {
    const batch = db.batch()

    for (let j = 0; j < 486; j++) {
        batch.create(fiatsCol.doc(), {})
    }

    await batch.commit()
    resp.json((await fiatsCol.get()).docs.length)
})

export const getFiats = fn.onRequest(async (req, resp) => {
    const fiats: Fiat[] = []

    const now = dayjs()
    const lastUpdatedAt = (await statsCol.doc('fiats').get()).data()
    console.log(
        lastUpdatedAt,
        dayjs(lastUpdatedAt as Date).isAfter(now.add(fiatUpdateInterval, 'day'))
    )
    const updateCol = false

    const deleteFiats = async () => {
        const batch = db.batch()
        const existingFiats = await fiatsCol.get()
        if (existingFiats.size === 0) {
            return
        }

        if (existingFiats.size <= 500) {
            existingFiats.docs.forEach((val) => batch.delete(val.ref))
            await batch.commit()
            return
        } else {
            for (let i = 0; i < 500; i++) {
                batch.delete(existingFiats.docs[i].ref)
            }
        }

        await batch.commit()
        await deleteFiats()
    }

    if (!lastUpdatedAt || updateCol) {
        await deleteFiats()
    }

    resp.status(200).json(fiats)
})

export const getCryptos = fn.onRequest(async (req, resp) => {
    let updateCol = false
    let cryptos: Crypto[] = []

    if (!collectionExists(cryptosCol)) {
        const { data } = await cmcRequest.get<CryptoResponse>(
            '/v1/cryptocurrency/map'
        )
        cryptos = data.data
        updateCol = true
    }

    if (updateCol) {
        const batch = db.batch()
        for (let i = 0; i < cryptos.length; i += 500) {
            cryptos.forEach((val) => batch.set(cryptosCol.doc(), val))
            await batch.commit()
        }
        await statsCol.doc('cryptos').set({ last_updated: dayjs().toDate() })
    }

    resp.status(200).json(cryptos)
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

export const listCurrencies = fn.onCall(async (req) => {
    let url = '/v1/cryptocurrency/map'
    if (req.type === 'fiat') {
        url = '/v1/fiat/map'
    }

    const { data } = await cmcRequest.get(url)
    return data
})
