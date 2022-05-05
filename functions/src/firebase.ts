import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const REGION = 'us-central1'

admin.initializeApp()

export const db = admin.firestore()
export const fn = functions.region(REGION).https
