import { db } from './utils/firebase'
import { Pair } from 'shared/types'

export const getPopularPairsFunc = async (): Promise<
    Array<FirebaseFirestore.QueryDocumentSnapshot<Pair>>
> => (await db.pairsCol.orderBy('hits').limit(10).get()).docs
