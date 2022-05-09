import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

const dev = process.env.ENV === 'development'

export const fs = admin.firestore()
export const fn = functions.https
export const HttpError = functions.https.HttpsError
export const db = {
    statsCol: fs.collection(`stats${dev ? '_dev' : ''}`),
    fiatsCol: fs.collection(`fiats${dev ? '_dev' : ''}`),
    cryptosCol: fs.collection(`cryptos${dev ? '_dev' : ''}`),
}
