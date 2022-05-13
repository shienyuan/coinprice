import { ConvertRequest, ConvertResponse } from 'shared/types'
import * as dayjs from 'dayjs'
import cmc from './utils/cmcApi'

export default async (req: ConvertRequest): Promise<ConvertResponse> => {
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
