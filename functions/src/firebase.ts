import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

if (process.env.ENV === 'development') {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:5000'
}

export const db = admin.firestore()
export const fn = functions.https
