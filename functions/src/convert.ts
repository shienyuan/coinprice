import { ConvertRequest, ConvertResponse, Currency } from 'shared/types'
import * as dayjs from 'dayjs'
import cmc from './utils/cmcApi'
import { db } from './utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'

export const convertFunc = async (
    req: ConvertRequest
): Promise<ConvertResponse> => {
    if (!req.from.currency || !req.to.currency)
        return {
            amount: 0,
            lastUpdated: dayjs().toDate(),
        }

    const converted = await cmc.get('/v2/tools/price-conversion', {
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

export const addConvertPair = async (from: Currency, to: Currency) => {
    const doc = await db.pairsCol.doc(`${from.symbol}${to.symbol}`).get()
    if (doc.exists) {
        await db.pairsCol.doc(`${from.symbol}${to.symbol}`).update({
            hits: FieldValue.increment(1),
        })
    } else {
        await db.pairsCol.doc(`${from.symbol}${to.symbol}`).set({
            from,
            to,
            hits: 1,
        })
    }
}
