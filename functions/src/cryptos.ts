import { db, fs } from './utils/firebase'
import { Crypto } from 'shared/types'
import { cmcRequest, Status } from './utils/cmcApi'
import { cryptosIndex } from './utils/algolia'

interface CryptoResponse {
    status: Status
    data: Crypto[]
}

export const getCryptosFunc = async (): Promise<Crypto[]> => {
    const snaps = await db.cryptosCol.limit(10).orderBy('rank').get()
    return snaps.docs.map((doc) => doc.data() as Crypto)
}

export const syncCryptosFunc = async (): Promise<string> => {
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
}

export const syncCryptoMetadataFunc = async (): Promise<string> => {
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
}

export const syncCryptoAlgoliaFunc = async (): Promise<string> => {
    const cryptos = await db.cryptosCol.get()
    cryptosIndex.saveObjects(
        cryptos.docs.map((val) => {
            return {
                objectID: val.id,
                ...val.data(),
            }
        }),
        { autoGenerateObjectIDIfNotExist: true }
    )
    return 'Success'
}
