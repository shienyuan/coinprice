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
    apiKey: '***REMOVED***',
    authDomain: '***REMOVED***',
    projectId: '***REMOVED***',
    storageBucket: '***REMOVED***.appspot.com',
    messagingSenderId: '***REMOVED***',
    appId: '1:***REMOVED***:web:2a89c7231c901d5bad311e',
    measurementId: '***REMOVED***',
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
        '***REMOVED***'
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
