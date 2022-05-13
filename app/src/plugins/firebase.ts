import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { AnalyticsCallOptions } from '@firebase/analytics'

const configs = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID,
    measurementId: process.env.VUE_APP_MEASUREMENT_ID,
}

export const fb = initializeApp(configs)
initializeAppCheck(fb, {
    provider: new ReCaptchaV3Provider(process.env.VUE_APP_RECAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true,
})
export const analytics = getAnalytics(fb)
export const functions = getFunctions(fb)
export const auth = getAuth(fb)

export const authSignInEmail = (
    email: string,
    password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password)
export const authSignOut = (): Promise<void> => signOut(auth)
export const analyticsLogEvent = (
    eventName: string,
    eventParams?: {
        [key: string]: string
    },
    options?: AnalyticsCallOptions
): void => logEvent(analytics, eventName, eventParams, options)

if (process.env.NODE_ENV === 'development')
    connectFunctionsEmulator(functions, 'localhost', 5001)

export default {
    install: (): void => {
        return
    },
}
