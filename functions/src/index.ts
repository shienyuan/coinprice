import * as functions from 'firebase-functions'
import { cmcRequest } from './axios'

export const convertCurrency = functions
    .region('us-central1')
    .https.onCall(async (req: any) => {
        const converted = await cmcRequest.get('/v2/tools/price-conversion', {
            params: {
                amount: req.from.amount,
                id: req.from.currency.id,
                convert_id: req.to.currency.id,
            },
        })

        return converted.data
    })

export const listCurrencies = functions
    .region('us-central1')
    .https.onCall(async (req) => {
        let url = '/v1/cryptocurrency/map'
        if (req.type === 'fiat') {
            url = '/v1/fiat/map'
        }

        const { data } = await cmcRequest.get(url)
        return data
    })
