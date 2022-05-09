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
    apiKey: 'AIzaSyAiUWulccTEN50-MpJSrz6UGXs35GFzOac',
    authDomain: 'coinprice-exchange.firebaseapp.com',
    projectId: 'coinprice-exchange',
    storageBucket: 'coinprice-exchange.appspot.com',
    messagingSenderId: '924864630587',
    appId: '1:924864630587:web:2a89c7231c901d5bad311e',
    measurementId: 'G-2MTYD31PEX',
}

export const fb = initializeApp(configs)
export const analytics = getAnalytics(fb)
export const analyticsLogEvent = (
    eventName: string,
    eventParams?: {
        [key: string]: any
    },
    options?: AnalyticsCallOptions
): void => logEvent(analytics, eventName, eventParams, options)
export const functions = getFunctions(fb)
export const auth = getAuth(fb)
export const authSignInEmail = (
    email: string,
    password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password)
export const authSignOut = (): Promise<void> => signOut(auth)

export const appCheck = initializeAppCheck(fb, {
    provider: new ReCaptchaV3Provider(
        '6LfUZ9YfAAAAAJRLEKfSSEcNKH9pm8kpVCBcBqPW'
    ),
    isTokenAutoRefreshEnabled: true,
})

if (process.env.NODE_ENV === 'development')
    connectFunctionsEmulator(functions, 'localhost', 5001)

export default {
    install: (): void => {
        return
    },
}
