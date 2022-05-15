import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { Pair } from 'shared/types'

admin.initializeApp()
export const fs = admin.firestore()
export const fn = functions.runWith({
    timeoutSeconds: 500,
}).https
export const HttpError = functions.https.HttpsError

export const db = {
    pairsCol: fs.collection(
        `pairs`
    ) as admin.firestore.CollectionReference<Pair>,
    fiatsCol: fs.collection(`fiats`),
    cryptosCol: fs.collection(`cryptos`),
}
