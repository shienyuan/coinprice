import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()
export const fs = admin.firestore()
export const fn = functions.runWith({
    timeoutSeconds: 500,
}).https
export const HttpError = functions.https.HttpsError
export const db = {
    statsCol: fs.collection(`stats`),
    fiatsCol: fs.collection(`fiats`),
    cryptosCol: fs.collection(`cryptos`),
}
